-- Migration: Ajouter applied_discount_percent au panier
-- Date: 2025-12-08
-- Description: Permet de stocker la réduction de pack appliquée à chaque item du panier

-- 1. Ajouter la colonne à user_cart_items si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_cart_items'
    AND column_name = 'applied_discount_percent'
  ) THEN
    ALTER TABLE public.user_cart_items
    ADD COLUMN applied_discount_percent numeric(5,2) DEFAULT 0
    CHECK (applied_discount_percent >= 0 AND applied_discount_percent <= 100);

    RAISE NOTICE 'Colonne applied_discount_percent ajoutée à user_cart_items';
  ELSE
    RAISE NOTICE 'Colonne applied_discount_percent existe déjà';
  END IF;
END $$;

-- 2. Supprimer l'ancienne vue puis la recréer avec la nouvelle colonne
DROP VIEW IF EXISTS public.user_cart_view;

CREATE VIEW public.user_cart_view AS
SELECT
  c.id AS cart_item_id,
  c.user_id,
  c.product_id,
  COALESCE(c.quantity, 1) AS quantity,
  COALESCE(c.applied_discount_percent, 0)::numeric(5,2) AS applied_discount_percent,
  c.updated_at,
  p.name AS product_name,
  p.dosage AS product_dosage,
  p.category AS product_category,
  p.price AS product_price,
  p.purity AS product_purity,
  p.sale_price AS product_sale_price,
  p.is_on_sale,
  p.image AS product_image,
  p.stock AS product_stock,
  p.name_i18n,
  p.category_i18n
FROM public.user_cart_items c
JOIN public.products p ON c.product_id = p.id;

-- 3. Vérification
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_cart_items'
AND column_name = 'applied_discount_percent';
