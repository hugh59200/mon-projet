-- ============================================================
-- SYSTEME DE CODES PROMO - Phase 1
-- ============================================================
-- Ce script ajoute le support des codes promotionnels
-- A executer apres back-up-tables-v5.sql
-- ============================================================

-- ============================
-- TABLE PROMO_CODES
-- ============================
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identifiant du code (ex: "WELCOME10", "SUMMER2024")
  code text UNIQUE NOT NULL,

  -- Description interne pour l'admin
  description text,

  -- Type de remise: 'percentage' (%) ou 'fixed' (montant fixe en euros)
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),

  -- Valeur de la remise (ex: 10 pour 10% ou 5.00 pour 5 euros)
  discount_value numeric(10,2) NOT NULL CHECK (discount_value > 0),

  -- Montant minimum de commande requis (optionnel)
  min_order_amount numeric(10,2) DEFAULT 0 CHECK (min_order_amount >= 0),

  -- Plafond de remise pour les codes pourcentage (optionnel)
  max_discount_amount numeric(10,2),

  -- Limites d'utilisation
  max_uses integer,                    -- Limite totale (NULL = illimite)
  max_uses_per_user integer DEFAULT 1, -- Limite par utilisateur
  current_uses integer DEFAULT 0,      -- Compteur d'utilisations

  -- Periode de validite
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,

  -- Statut
  active boolean DEFAULT true,

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour recherche rapide par code
CREATE INDEX idx_promo_codes_code ON public.promo_codes (upper(code));
CREATE INDEX idx_promo_codes_active ON public.promo_codes (active) WHERE active = true;

COMMENT ON TABLE public.promo_codes IS 'Codes promotionnels pour remises sur commandes';
COMMENT ON COLUMN public.promo_codes.discount_type IS 'percentage = remise en %, fixed = remise en euros';
COMMENT ON COLUMN public.promo_codes.max_discount_amount IS 'Plafond pour les codes pourcentage (ex: -20% plafonné à 50 euros max)';

-- ============================
-- TABLE PROMO_CODE_USAGE (tracking par utilisateur)
-- ============================
CREATE TABLE IF NOT EXISTS public.promo_code_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id uuid NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email text NOT NULL,  -- Pour tracker aussi les guests
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_applied numeric(10,2) NOT NULL,
  used_at timestamptz DEFAULT now()
);

CREATE INDEX idx_promo_usage_code ON public.promo_code_usage (promo_code_id);
CREATE INDEX idx_promo_usage_user ON public.promo_code_usage (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_promo_usage_email ON public.promo_code_usage (lower(user_email));

-- ============================
-- AJOUTER COLONNE promo_code_id A ORDERS (si pas deja presente)
-- ============================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'orders'
    AND column_name = 'promo_code_id'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN promo_code_id uuid REFERENCES public.promo_codes(id) ON DELETE SET NULL;
    ALTER TABLE public.orders ADD COLUMN promo_code_snapshot text; -- Garder trace du code utilise
  END IF;
END $$;

-- ============================
-- FONCTION: validate_promo_code
-- Valide un code promo et calcule la remise
-- ============================
CREATE OR REPLACE FUNCTION public.validate_promo_code(
  p_code text,
  p_subtotal numeric,
  p_user_id uuid DEFAULT NULL,
  p_user_email text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
  v_discount_amount numeric(10,2);
  v_user_usage_count integer;
  v_effective_email text;
BEGIN
  -- Normaliser le code (majuscules, trim)
  p_code := upper(trim(p_code));

  -- Email effectif (user connecte ou guest)
  v_effective_email := COALESCE(
    p_user_email,
    (SELECT email FROM profiles WHERE id = p_user_id)
  );

  -- Rechercher le code
  SELECT * INTO v_promo
  FROM promo_codes
  WHERE upper(code) = p_code;

  -- Code non trouve
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'CODE_NOT_FOUND',
      'message', 'Ce code promo n''existe pas'
    );
  END IF;

  -- Code inactif
  IF NOT v_promo.active THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'CODE_INACTIVE',
      'message', 'Ce code promo n''est plus actif'
    );
  END IF;

  -- Verifier la periode de validite
  IF v_promo.valid_from IS NOT NULL AND now() < v_promo.valid_from THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'CODE_NOT_YET_VALID',
      'message', 'Ce code promo n''est pas encore valide'
    );
  END IF;

  IF v_promo.valid_until IS NOT NULL AND now() > v_promo.valid_until THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'CODE_EXPIRED',
      'message', 'Ce code promo a expire'
    );
  END IF;

  -- Verifier la limite totale d'utilisation
  IF v_promo.max_uses IS NOT NULL AND v_promo.current_uses >= v_promo.max_uses THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'CODE_MAX_USES_REACHED',
      'message', 'Ce code promo a atteint sa limite d''utilisation'
    );
  END IF;

  -- Verifier la limite par utilisateur
  IF v_promo.max_uses_per_user IS NOT NULL AND v_effective_email IS NOT NULL THEN
    SELECT COUNT(*) INTO v_user_usage_count
    FROM promo_code_usage
    WHERE promo_code_id = v_promo.id
      AND lower(user_email) = lower(v_effective_email);

    IF v_user_usage_count >= v_promo.max_uses_per_user THEN
      RETURN jsonb_build_object(
        'valid', false,
        'error', 'CODE_USER_LIMIT_REACHED',
        'message', 'Vous avez deja utilise ce code promo'
      );
    END IF;
  END IF;

  -- Verifier le montant minimum
  IF p_subtotal < v_promo.min_order_amount THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'MIN_AMOUNT_NOT_REACHED',
      'message', format('Montant minimum requis: %s EUR', v_promo.min_order_amount),
      'min_amount', v_promo.min_order_amount
    );
  END IF;

  -- Calculer la remise
  IF v_promo.discount_type = 'percentage' THEN
    v_discount_amount := ROUND(p_subtotal * v_promo.discount_value / 100, 2);
    -- Appliquer le plafond si defini
    IF v_promo.max_discount_amount IS NOT NULL AND v_discount_amount > v_promo.max_discount_amount THEN
      v_discount_amount := v_promo.max_discount_amount;
    END IF;
  ELSE
    -- Remise fixe
    v_discount_amount := v_promo.discount_value;
    -- Ne pas depasser le subtotal
    IF v_discount_amount > p_subtotal THEN
      v_discount_amount := p_subtotal;
    END IF;
  END IF;

  -- Succes
  RETURN jsonb_build_object(
    'valid', true,
    'promo_code_id', v_promo.id,
    'code', v_promo.code,
    'discount_type', v_promo.discount_type,
    'discount_value', v_promo.discount_value,
    'discount_amount', v_discount_amount,
    'message', CASE
      WHEN v_promo.discount_type = 'percentage'
      THEN format('-%s%% applique', v_promo.discount_value::integer)
      ELSE format('-%s EUR applique', v_promo.discount_value)
    END
  );
END;
$$;

COMMENT ON FUNCTION public.validate_promo_code IS 'Valide un code promo et retourne le montant de remise calcule';

-- ============================
-- FONCTION: apply_promo_code (appelee lors de la creation de commande)
-- ============================
CREATE OR REPLACE FUNCTION public.apply_promo_code(
  p_promo_code_id uuid,
  p_order_id uuid,
  p_user_id uuid,
  p_user_email text,
  p_discount_applied numeric
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Incrementer le compteur d'utilisation
  UPDATE promo_codes
  SET current_uses = current_uses + 1,
      updated_at = now()
  WHERE id = p_promo_code_id;

  -- Enregistrer l'utilisation
  INSERT INTO promo_code_usage (
    promo_code_id,
    user_id,
    user_email,
    order_id,
    discount_applied
  ) VALUES (
    p_promo_code_id,
    p_user_id,
    p_user_email,
    p_order_id,
    p_discount_applied
  );

  RETURN true;
END;
$$;

-- ============================
-- RLS POLICIES
-- ============================

-- Activer RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;

-- Les codes actifs sont lisibles par tous (pour validation)
CREATE POLICY "promo_codes_select_active" ON public.promo_codes
  FOR SELECT USING (active = true);

-- Seuls les admins peuvent gerer les codes
CREATE POLICY "promo_codes_admin_all" ON public.promo_codes
  FOR ALL USING (public.is_admin());

-- Les utilisateurs peuvent voir leurs propres utilisations
CREATE POLICY "promo_usage_user_select" ON public.promo_code_usage
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.is_admin()
  );

-- Seul le systeme (via SECURITY DEFINER) peut inserer
CREATE POLICY "promo_usage_insert_system" ON public.promo_code_usage
  FOR INSERT WITH CHECK (public.is_admin());

-- ============================
-- DONNEES DE TEST (optionnel - a commenter en prod)
-- ============================
-- INSERT INTO public.promo_codes (code, description, discount_type, discount_value, min_order_amount, max_uses, valid_until) VALUES
-- ('WELCOME10', 'Code de bienvenue -10%', 'percentage', 10, 0, NULL, NULL),
-- ('SUMMER20', 'Promo ete -20% (max 50 EUR)', 'percentage', 20, 50, 100, '2025-09-01'),
-- ('FLAT5', 'Remise fixe 5 EUR', 'fixed', 5, 20, NULL, NULL);

-- ============================
-- GRANT PERMISSIONS
-- ============================
GRANT SELECT ON public.promo_codes TO authenticated, anon;
GRANT SELECT ON public.promo_code_usage TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_promo_code TO authenticated, anon;
