-- ============================================================
-- MIGRATION: Ajout système de codes promo
-- ============================================================
-- A exécuter APRÈS back-up-tables-v5.sql et promo-codes.sql
-- ============================================================

-- ============================
-- 1. Mettre à jour la fonction create_order_with_items_full
--    pour accepter les paramètres promo_code
-- ============================

CREATE OR REPLACE FUNCTION public.create_order_with_items_full(
  p_user_id uuid,
  p_email text,
  p_full_name text,
  p_address text,
  p_zip text,
  p_city text,
  p_country text,
  p_payment_method text,
  p_subtotal numeric,
  p_tax_amount numeric,
  p_shipping_cost numeric,
  p_discount_amount numeric,
  p_total_amount numeric,
  p_items jsonb,
  -- Parametres optionnels pour le point relais
  p_relay_id text DEFAULT NULL,
  p_relay_name text DEFAULT NULL,
  p_relay_address text DEFAULT NULL,
  p_relay_zipcode text DEFAULT NULL,
  p_relay_city text DEFAULT NULL,
  p_relay_country text DEFAULT 'FR',
  -- Parametres optionnels pour le code promo
  p_promo_code_id uuid DEFAULT NULL,
  p_promo_code_snapshot text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_order_id uuid;
  new_tracking_token text;
  item jsonb;
  product_record RECORD;
BEGIN
  -- Validation des donnees
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email requis';
  END IF;

  IF p_total_amount <= 0 THEN
    RAISE EXCEPTION 'Montant invalide';
  END IF;

  -- 1. Creation Commande avec infos relay et promo optionnelles
  INSERT INTO public.orders (
    user_id, email, full_name, address, zip, city, country,
    payment_method, status,
    subtotal, tax_amount, shipping_cost, discount_amount, total_amount,
    relay_id, relay_name, relay_address, relay_zipcode, relay_city, relay_country,
    promo_code_id, promo_code_snapshot
  )
  VALUES (
    p_user_id, p_email, p_full_name, p_address, p_zip, p_city, p_country,
    p_payment_method, 'pending',
    COALESCE(p_subtotal, 0), COALESCE(p_tax_amount, 0),
    COALESCE(p_shipping_cost, 0), COALESCE(p_discount_amount, 0),
    p_total_amount,
    p_relay_id, p_relay_name, p_relay_address, p_relay_zipcode, p_relay_city,
    CASE WHEN p_relay_id IS NOT NULL THEN COALESCE(p_relay_country, 'FR') ELSE NULL END,
    p_promo_code_id, p_promo_code_snapshot
  )
  RETURNING id, tracking_token INTO new_order_id, new_tracking_token;

  -- 2. Insertion Produits avec verification de stock
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO product_record
    FROM public.products p
    WHERE p.id = (item->>'product_id')::uuid;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produit introuvable: %', item->>'product_id';
    END IF;

    IF product_record.stock < COALESCE((item->>'quantity')::integer, 1) THEN
      RAISE EXCEPTION 'Stock insuffisant pour: %', product_record.name;
    END IF;

    INSERT INTO public.order_items (order_id, product_id, quantity, price, product_name_snapshot)
    VALUES (
      new_order_id,
      product_record.id,
      COALESCE((item->>'quantity')::integer, 1),
      CASE
        WHEN product_record.is_on_sale AND product_record.sale_price IS NOT NULL
        THEN product_record.sale_price
        ELSE product_record.price
      END,
      product_record.name || CASE
        WHEN product_record.dosage IS NOT NULL
        THEN ' (' || product_record.dosage || ')'
        ELSE ''
      END
    );

    -- Decrementation du stock
    UPDATE public.products
    SET stock = stock - COALESCE((item->>'quantity')::integer, 1)
    WHERE id = product_record.id;
  END LOOP;

  -- Si user connecte, vider son panier
  IF p_user_id IS NOT NULL THEN
    DELETE FROM public.user_cart_items WHERE user_id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'order_id', new_order_id,
    'tracking_token', new_tracking_token,
    'is_relay_delivery', (p_relay_id IS NOT NULL),
    'has_promo_code', (p_promo_code_id IS NOT NULL),
    'status', 'success'
  );
END;
$$;

-- ============================
-- 2. Données de test (quelques codes promo)
-- ============================

-- Code de bienvenue -10%
INSERT INTO public.promo_codes (code, description, discount_type, discount_value, min_order_amount, max_uses_per_user)
VALUES ('WELCOME10', 'Code de bienvenue - 10% de remise', 'percentage', 10, 0, 1)
ON CONFLICT (code) DO NOTHING;

-- Code été -15% avec minimum 50€
INSERT INTO public.promo_codes (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, max_uses)
VALUES ('SUMMER15', 'Promotion été - 15% (max 30€)', 'percentage', 15, 50, 30, 200)
ON CONFLICT (code) DO NOTHING;

-- Code fixe -5€
INSERT INTO public.promo_codes (code, description, discount_type, discount_value, min_order_amount)
VALUES ('FLAT5', 'Remise fixe de 5€', 'fixed', 5, 25)
ON CONFLICT (code) DO NOTHING;

-- ============================
-- 3. Vue admin pour voir les codes promo
-- ============================

CREATE OR REPLACE VIEW public.promo_codes_admin AS
SELECT
  pc.*,
  COALESCE(usage_stats.total_usage, 0) as total_usage,
  COALESCE(usage_stats.total_discount_given, 0) as total_discount_given
FROM public.promo_codes pc
LEFT JOIN (
  SELECT
    promo_code_id,
    COUNT(*) as total_usage,
    SUM(discount_applied) as total_discount_given
  FROM public.promo_code_usage
  GROUP BY promo_code_id
) usage_stats ON pc.id = usage_stats.promo_code_id
ORDER BY pc.created_at DESC;

-- RLS pour la vue admin
GRANT SELECT ON public.promo_codes_admin TO authenticated;

COMMENT ON VIEW public.promo_codes_admin IS 'Vue admin des codes promo avec statistiques d''utilisation';
