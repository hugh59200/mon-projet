-- ============================================================
-- MIGRATION V6.4 — Ajout code promo WELCOME10 pour newsletter
-- ============================================================
-- Ce script est idempotent (peut être exécuté plusieurs fois)

-- Insérer le code promo WELCOME10 s'il n'existe pas déjà
INSERT INTO public.promo_codes (id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount, max_uses, max_uses_per_user, valid_from, valid_until, active)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  'WELCOME10',
  'Code newsletter -10% première commande',
  'percentage',
  10,
  0,        -- Pas de minimum de commande
  NULL,     -- Pas de plafond de réduction
  NULL,     -- Pas de limite d'utilisations totales
  1,        -- 1 utilisation par utilisateur
  now(),
  NULL,     -- Pas d'expiration
  true
)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  description = EXCLUDED.description,
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  max_uses_per_user = EXCLUDED.max_uses_per_user,
  active = EXCLUDED.active;

-- Vérification
SELECT code, description, discount_value, max_uses_per_user, active
FROM public.promo_codes
WHERE code = 'WELCOME10';
