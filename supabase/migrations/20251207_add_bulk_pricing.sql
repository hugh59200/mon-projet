-- ============================
-- 💰 MIGRATION AOV (Prix Dégressifs)
-- ============================
-- Prix dégressifs par quantité pour augmenter le panier moyen

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS bulk_pricing JSONB DEFAULT '[{"quantity": 3, "discount_percent": 5}, {"quantity": 5, "discount_percent": 10}]'::jsonb;

COMMENT ON COLUMN public.products.bulk_pricing IS 'Prix dégressifs: [{"quantity": 3, "discount_percent": 5}, {"quantity": 5, "discount_percent": 10}]';
