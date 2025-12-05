-- ============================================================
-- CODES PROMO AUTOMATIQUES - Phase 4
-- ============================================================
-- Système de codes promo automatiques :
-- 1. Code de bienvenue (nouveaux inscrits)
-- 2. Code de fidélité (après X commandes)
-- 3. Abandon panier (via Edge Function)
-- ============================================================

-- ============================
-- TABLE: user_promo_rewards
-- Stocke les codes promo attribués automatiquement aux utilisateurs
-- ============================
CREATE TABLE IF NOT EXISTS public.user_promo_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  promo_code_id uuid REFERENCES public.promo_codes(id) ON DELETE SET NULL,
  reward_type text NOT NULL CHECK (reward_type IN ('welcome', 'loyalty', 'cart_abandonment', 'birthday')),
  generated_code text,  -- Code unique généré (si applicable)
  is_used boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_user_promo_rewards_user ON public.user_promo_rewards (user_id);
CREATE INDEX idx_user_promo_rewards_email ON public.user_promo_rewards (lower(user_email));
CREATE INDEX idx_user_promo_rewards_type ON public.user_promo_rewards (reward_type);

COMMENT ON TABLE public.user_promo_rewards IS 'Codes promo automatiques attribués aux utilisateurs';

-- ============================
-- TABLE: auto_promo_settings
-- Configuration des codes automatiques
-- ============================
CREATE TABLE IF NOT EXISTS public.auto_promo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Configuration par défaut
INSERT INTO public.auto_promo_settings (setting_key, setting_value, is_enabled) VALUES
  ('welcome', '{
    "discount_type": "percentage",
    "discount_value": 10,
    "min_order_amount": 0,
    "expires_days": 30,
    "email_subject": "Bienvenue ! Voici votre code promo",
    "max_uses_per_code": 1
  }'::jsonb, true),
  ('loyalty', '{
    "orders_threshold": 3,
    "discount_type": "percentage",
    "discount_value": 15,
    "min_order_amount": 0,
    "expires_days": 60,
    "email_subject": "Merci pour votre fidélité !"
  }'::jsonb, true),
  ('cart_abandonment', '{
    "delay_hours": 24,
    "discount_type": "percentage",
    "discount_value": 10,
    "min_order_amount": 30,
    "expires_days": 7,
    "email_subject": "Vous avez oublié quelque chose..."
  }'::jsonb, true)
ON CONFLICT (setting_key) DO NOTHING;

-- ============================
-- FONCTION: generate_unique_promo_code
-- Génère un code promo unique
-- ============================
CREATE OR REPLACE FUNCTION public.generate_unique_promo_code(
  p_prefix text DEFAULT 'AUTO'
)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_code text;
  v_exists boolean;
BEGIN
  LOOP
    -- Générer un code: PREFIX + 6 caractères alphanumériques
    v_code := p_prefix || '-' || upper(substr(md5(random()::text), 1, 6));

    -- Vérifier qu'il n'existe pas déjà
    SELECT EXISTS(SELECT 1 FROM promo_codes WHERE code = v_code) INTO v_exists;

    IF NOT v_exists THEN
      RETURN v_code;
    END IF;
  END LOOP;
END;
$$;

-- ============================
-- FONCTION: create_welcome_promo
-- Crée un code de bienvenue pour un nouvel utilisateur
-- ============================
CREATE OR REPLACE FUNCTION public.create_welcome_promo(
  p_user_id uuid,
  p_user_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings jsonb;
  v_is_enabled boolean;
  v_code text;
  v_promo_id uuid;
  v_expires_at timestamptz;
  v_already_exists boolean;
BEGIN
  -- Vérifier si le système est activé
  SELECT setting_value, is_enabled INTO v_settings, v_is_enabled
  FROM auto_promo_settings
  WHERE setting_key = 'welcome';

  IF NOT v_is_enabled THEN
    RETURN jsonb_build_object('success', false, 'reason', 'welcome_promo_disabled');
  END IF;

  -- Vérifier si l'utilisateur a déjà reçu un code de bienvenue
  SELECT EXISTS(
    SELECT 1 FROM user_promo_rewards
    WHERE (user_id = p_user_id OR lower(user_email) = lower(p_user_email))
    AND reward_type = 'welcome'
  ) INTO v_already_exists;

  IF v_already_exists THEN
    RETURN jsonb_build_object('success', false, 'reason', 'already_received');
  END IF;

  -- Générer un code unique
  v_code := generate_unique_promo_code('WELCOME');
  v_expires_at := now() + ((v_settings->>'expires_days')::integer || ' days')::interval;

  -- Créer le code promo
  INSERT INTO promo_codes (
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    max_uses,
    max_uses_per_user,
    valid_until,
    active
  ) VALUES (
    v_code,
    'Code de bienvenue pour ' || p_user_email,
    v_settings->>'discount_type',
    (v_settings->>'discount_value')::numeric,
    COALESCE((v_settings->>'min_order_amount')::numeric, 0),
    1,  -- Usage unique
    1,
    v_expires_at,
    true
  )
  RETURNING id INTO v_promo_id;

  -- Enregistrer l'attribution
  INSERT INTO user_promo_rewards (
    user_id,
    user_email,
    promo_code_id,
    reward_type,
    generated_code,
    expires_at,
    metadata
  ) VALUES (
    p_user_id,
    p_user_email,
    v_promo_id,
    'welcome',
    v_code,
    v_expires_at,
    jsonb_build_object('discount_value', v_settings->>'discount_value', 'discount_type', v_settings->>'discount_type')
  );

  RETURN jsonb_build_object(
    'success', true,
    'code', v_code,
    'promo_code_id', v_promo_id,
    'discount_type', v_settings->>'discount_type',
    'discount_value', v_settings->>'discount_value',
    'expires_at', v_expires_at
  );
END;
$$;

-- ============================
-- FONCTION: check_loyalty_reward
-- Vérifie et attribue un code de fidélité après X commandes
-- ============================
CREATE OR REPLACE FUNCTION public.check_loyalty_reward(
  p_user_id uuid,
  p_user_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings jsonb;
  v_is_enabled boolean;
  v_orders_count integer;
  v_threshold integer;
  v_code text;
  v_promo_id uuid;
  v_expires_at timestamptz;
  v_already_rewarded boolean;
  v_reward_level integer;
BEGIN
  -- Vérifier si le système est activé
  SELECT setting_value, is_enabled INTO v_settings, v_is_enabled
  FROM auto_promo_settings
  WHERE setting_key = 'loyalty';

  IF NOT v_is_enabled THEN
    RETURN jsonb_build_object('success', false, 'reason', 'loyalty_promo_disabled');
  END IF;

  v_threshold := (v_settings->>'orders_threshold')::integer;

  -- Compter les commandes confirmées de l'utilisateur
  SELECT COUNT(*) INTO v_orders_count
  FROM orders
  WHERE (user_id = p_user_id OR lower(email) = lower(p_user_email))
  AND status IN ('confirmed', 'processing', 'shipped', 'delivered');

  -- Calculer le niveau de récompense (multiples du seuil)
  v_reward_level := v_orders_count / v_threshold;

  IF v_reward_level < 1 THEN
    RETURN jsonb_build_object(
      'success', false,
      'reason', 'threshold_not_reached',
      'orders_count', v_orders_count,
      'threshold', v_threshold
    );
  END IF;

  -- Vérifier si déjà récompensé pour ce niveau
  SELECT EXISTS(
    SELECT 1 FROM user_promo_rewards
    WHERE (user_id = p_user_id OR lower(user_email) = lower(p_user_email))
    AND reward_type = 'loyalty'
    AND (metadata->>'reward_level')::integer = v_reward_level
  ) INTO v_already_rewarded;

  IF v_already_rewarded THEN
    RETURN jsonb_build_object('success', false, 'reason', 'already_rewarded_for_level', 'level', v_reward_level);
  END IF;

  -- Générer un code unique
  v_code := generate_unique_promo_code('MERCI');
  v_expires_at := now() + ((v_settings->>'expires_days')::integer || ' days')::interval;

  -- Créer le code promo
  INSERT INTO promo_codes (
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    max_uses,
    max_uses_per_user,
    valid_until,
    active
  ) VALUES (
    v_code,
    'Code fidélité niveau ' || v_reward_level || ' pour ' || p_user_email,
    v_settings->>'discount_type',
    (v_settings->>'discount_value')::numeric,
    COALESCE((v_settings->>'min_order_amount')::numeric, 0),
    1,
    1,
    v_expires_at,
    true
  )
  RETURNING id INTO v_promo_id;

  -- Enregistrer l'attribution
  INSERT INTO user_promo_rewards (
    user_id,
    user_email,
    promo_code_id,
    reward_type,
    generated_code,
    expires_at,
    metadata
  ) VALUES (
    p_user_id,
    p_user_email,
    v_promo_id,
    'loyalty',
    v_code,
    v_expires_at,
    jsonb_build_object(
      'reward_level', v_reward_level,
      'orders_count', v_orders_count,
      'discount_value', v_settings->>'discount_value',
      'discount_type', v_settings->>'discount_type'
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'code', v_code,
    'promo_code_id', v_promo_id,
    'reward_level', v_reward_level,
    'orders_count', v_orders_count,
    'discount_type', v_settings->>'discount_type',
    'discount_value', v_settings->>'discount_value',
    'expires_at', v_expires_at
  );
END;
$$;

-- ============================
-- FONCTION: create_cart_abandonment_promo
-- Crée un code pour panier abandonné
-- ============================
CREATE OR REPLACE FUNCTION public.create_cart_abandonment_promo(
  p_user_id uuid,
  p_user_email text,
  p_cart_value numeric DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings jsonb;
  v_is_enabled boolean;
  v_code text;
  v_promo_id uuid;
  v_expires_at timestamptz;
  v_recent_abandonment boolean;
BEGIN
  -- Vérifier si le système est activé
  SELECT setting_value, is_enabled INTO v_settings, v_is_enabled
  FROM auto_promo_settings
  WHERE setting_key = 'cart_abandonment';

  IF NOT v_is_enabled THEN
    RETURN jsonb_build_object('success', false, 'reason', 'cart_abandonment_disabled');
  END IF;

  -- Vérifier qu'on n'a pas envoyé de code récemment (7 jours)
  SELECT EXISTS(
    SELECT 1 FROM user_promo_rewards
    WHERE (user_id = p_user_id OR lower(user_email) = lower(p_user_email))
    AND reward_type = 'cart_abandonment'
    AND created_at > now() - interval '7 days'
  ) INTO v_recent_abandonment;

  IF v_recent_abandonment THEN
    RETURN jsonb_build_object('success', false, 'reason', 'recent_abandonment_code_sent');
  END IF;

  -- Générer un code unique
  v_code := generate_unique_promo_code('PANIER');
  v_expires_at := now() + ((v_settings->>'expires_days')::integer || ' days')::interval;

  -- Créer le code promo
  INSERT INTO promo_codes (
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    max_uses,
    max_uses_per_user,
    valid_until,
    active
  ) VALUES (
    v_code,
    'Code panier abandonné pour ' || p_user_email,
    v_settings->>'discount_type',
    (v_settings->>'discount_value')::numeric,
    COALESCE((v_settings->>'min_order_amount')::numeric, 0),
    1,
    1,
    v_expires_at,
    true
  )
  RETURNING id INTO v_promo_id;

  -- Enregistrer l'attribution
  INSERT INTO user_promo_rewards (
    user_id,
    user_email,
    promo_code_id,
    reward_type,
    generated_code,
    expires_at,
    metadata
  ) VALUES (
    p_user_id,
    p_user_email,
    v_promo_id,
    'cart_abandonment',
    v_code,
    v_expires_at,
    jsonb_build_object(
      'cart_value', p_cart_value,
      'discount_value', v_settings->>'discount_value',
      'discount_type', v_settings->>'discount_type'
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'code', v_code,
    'promo_code_id', v_promo_id,
    'discount_type', v_settings->>'discount_type',
    'discount_value', v_settings->>'discount_value',
    'expires_at', v_expires_at,
    'cart_value', p_cart_value
  );
END;
$$;

-- ============================
-- TRIGGER: Créer code bienvenue à l'inscription
-- ============================
CREATE OR REPLACE FUNCTION public.trigger_welcome_promo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Créer le code de bienvenue directement
  v_result := create_welcome_promo(NEW.id, NEW.email);

  -- Log le résultat (pour debug)
  IF (v_result->>'success')::boolean THEN
    RAISE NOTICE 'Code bienvenue créé pour %: %', NEW.email, v_result->>'code';
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ne pas bloquer l'inscription si la création du code échoue
    RAISE WARNING 'Erreur création code bienvenue pour %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger sur création de profil
DROP TRIGGER IF EXISTS tr_welcome_promo ON public.profiles;
CREATE TRIGGER tr_welcome_promo
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_welcome_promo();

-- ============================
-- TRIGGER: Vérifier fidélité après commande confirmée
-- ============================
CREATE OR REPLACE FUNCTION public.trigger_check_loyalty()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Vérifier seulement si le statut passe à 'confirmed'
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status <> 'confirmed') THEN
    -- Vérifier et attribuer un code de fidélité
    v_result := check_loyalty_reward(NEW.user_id, NEW.email);

    IF (v_result->>'success')::boolean THEN
      RAISE NOTICE 'Code fidélité créé pour %: % (niveau %)',
        NEW.email, v_result->>'code', v_result->>'reward_level';
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ne pas bloquer la commande si le check fidélité échoue
    RAISE WARNING 'Erreur check fidélité pour %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_check_loyalty ON public.orders;
CREATE TRIGGER tr_check_loyalty
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_check_loyalty();

-- ============================
-- FONCTION: find_abandoned_carts
-- Trouve les paniers abandonnés pour le cron job
-- ============================
CREATE OR REPLACE FUNCTION public.find_abandoned_carts(
  p_cutoff_time timestamptz,
  p_min_value numeric DEFAULT 30
)
RETURNS TABLE (
  user_id uuid,
  email text,
  cart_total numeric,
  last_activity timestamptz,
  items_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as user_id,
    p.email,
    COALESCE(SUM(
      CASE
        WHEN pr.is_on_sale AND pr.sale_price IS NOT NULL
        THEN pr.sale_price * ci.quantity
        ELSE pr.price * ci.quantity
      END
    ), 0) as cart_total,
    MAX(ci.updated_at) as last_activity,
    COUNT(ci.id) as items_count
  FROM profiles p
  INNER JOIN user_cart_items ci ON ci.user_id = p.id
  INNER JOIN products pr ON pr.id = ci.product_id
  WHERE
    -- Panier mis à jour avant le cutoff (abandonné)
    ci.updated_at < p_cutoff_time
    -- Pas de commande récente (dans les dernières 48h)
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.user_id = p.id
      AND o.created_at > p_cutoff_time - interval '24 hours'
    )
    -- Pas de code abandon envoyé récemment (7 jours)
    AND NOT EXISTS (
      SELECT 1 FROM user_promo_rewards upr
      WHERE upr.user_id = p.id
      AND upr.reward_type = 'cart_abandonment'
      AND upr.created_at > now() - interval '7 days'
    )
  GROUP BY p.id, p.email
  HAVING COALESCE(SUM(
    CASE
      WHEN pr.is_on_sale AND pr.sale_price IS NOT NULL
      THEN pr.sale_price * ci.quantity
      ELSE pr.price * ci.quantity
    END
  ), 0) >= p_min_value;
END;
$$;

GRANT EXECUTE ON FUNCTION public.find_abandoned_carts TO authenticated;

-- ============================
-- RLS POLICIES
-- ============================
ALTER TABLE public.user_promo_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_promo_settings ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres récompenses
CREATE POLICY "user_promo_rewards_user_select" ON public.user_promo_rewards
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- Seuls les admins peuvent tout gérer
CREATE POLICY "user_promo_rewards_admin_all" ON public.user_promo_rewards
  FOR ALL USING (public.is_admin());

-- Settings: lecture publique, écriture admin
CREATE POLICY "auto_promo_settings_select" ON public.auto_promo_settings
  FOR SELECT USING (true);

CREATE POLICY "auto_promo_settings_admin" ON public.auto_promo_settings
  FOR ALL USING (public.is_admin());

-- ============================
-- GRANTS
-- ============================
GRANT SELECT ON public.user_promo_rewards TO authenticated;
GRANT SELECT ON public.auto_promo_settings TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_welcome_promo TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_loyalty_reward TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_cart_abandonment_promo TO authenticated;
