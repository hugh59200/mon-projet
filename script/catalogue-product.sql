-- ===========================
-- Table products
-- ===========================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL,
  purity numeric(4,2),
  stock boolean DEFAULT true,
  image text,
  created_at timestamp DEFAULT now()
);

INSERT INTO public.products (name, category, price, purity, stock, image)
VALUES
('GHK-Cu Peptide', 'Performance', 39.90, 99, true, '/images/products/ghkcu.jpg'),
('BPC-157 Peptide', 'Récupération', 34.90, 99, true, '/images/products/bpc157.jpg'),
('CJC-1295 DAC', 'Performance', 44.90, 98, false, '/images/products/cjc1295.jpg'),
('Thymosin Beta-4', 'Récupération', 32.90, 99, true, '/images/products/tb4.jpg'),
('Epitalon', 'Recherche', 36.50, 99, true, '/images/products/epitalon.jpg');

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description text;

UPDATE public.products
SET description = CASE name
  WHEN 'GHK-Cu Peptide' THEN 'Peptide de cuivre régénérant favorisant la cicatrisation et la synthèse du collagène.'
  WHEN 'BPC-157 Peptide' THEN 'Peptide pro-régénératif favorisant la récupération musculaire et tendineuse.'
  WHEN 'CJC-1295 DAC' THEN 'Peptide stimulant la sécrétion naturelle de l’hormone de croissance (GH).'
  WHEN 'Thymosin Beta-4' THEN 'Peptide impliqué dans la régénération cellulaire et la récupération tissulaire.'
  WHEN 'Epitalon' THEN 'Peptide étudié pour ses effets anti-âge et la régulation du cycle circadien.'
END;