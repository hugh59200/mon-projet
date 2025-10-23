-- =====================================================
-- 🧬  SEED DES PRODUITS PEPTIDES (basé sur src/assets/products)
-- =====================================================

-- 🛡️ Désactivation du RLS pour garantir l’accès public au catalogue
alter table public.products disable row level security;

-- 1️⃣ Nettoyage : suppression des produits obsolètes
DELETE FROM public.products
WHERE name NOT IN (
  'BPC-157',
  'CJC-1295',
  'DSIP',
  'IGF-1 LR3',
  'Melanothan-2',
  'MOTS-c',
  'PT-141',
  'Retatrutide',
  'Selank',
  'Semaglutide',
  'Semax',
  'TB-500',
  'Tesamorelin'
);

-- 2️⃣ Insertion / mise à jour cohérente
INSERT INTO public.products 
(id, name, category, price, purity, stock, image, created_at, description)
VALUES
('8e30a5b8-cc7f-4e65-ba95-acd9bbcd4b8c', 'BPC-157',       'Récupération', 34.90, 99.00, true,  '/src/assets/products/bpc-157/peptide-bpc-157.png',       NOW(), 'Peptide pro-régénératif pour tendons et tissus.'),
('4f5337fd-5b34-4e38-88b8-09d80f732c81', 'CJC-1295',      'Performance',  44.90, 98.00, false, '/src/assets/products/cjc-1295/peptide-cjc-1295.png',      NOW(), 'Stimule la sécrétion naturelle de l’hormone de croissance (GH).'),
('cb8034c6-f2e7-46b3-8169-7cb9731634ab', 'DSIP',          'Bien-être',    29.90, 99.00, true,  '/src/assets/products/dsip/peptide-dsip.png',              NOW(), 'Delta Sleep-Inducing Peptide, étudié pour le sommeil.'),
('055325fa-d4cf-4fff-99c9-6b2313efd21e', 'IGF-1 LR3',     'Performance',  59.90, 98.00, false, '/src/assets/products/igf-1-lr3/peptide-igf-1-lr3.png',    NOW(), 'Facteur de croissance insulinomimétique, variante LR3.'),
('c0e8f904-5cdc-4020-a41a-019e99c5b0a6', 'Melanothan-2',  'Recherche',    39.90, 99.00, true,  '/src/assets/products/melanothan-2/peptide-melanothan-2.png', NOW(), 'Analogue de l’α-MSH ; stimule le bronzage et la libido.'),
('a5a75105-0731-4adc-8ea2-bc23caf68dca', 'MOTS-c',        'Recherche',    49.90, 99.00, true,  '/src/assets/products/mots-c/peptide-mots-c.png',          NOW(), 'Peptide mitochondrial étudié pour le métabolisme énergétique.'),
('d2c28d0b-8b14-4c12-b86b-44e075c0ba7b', 'PT-141',        'Bien-être',    42.90, 99.00, true,  '/src/assets/products/pt-141/peptide-pt-141.png',          NOW(), 'Bremelanotide ; applications libido / dysfonction sexuelle.'),
('36aa8192-5ff4-475f-8e8b-2ae9acd99750', 'Retatrutide',   'Métabolisme',  54.90, 99.00, true,  '/src/assets/products/retatrutide/peptide-retatrutide.png', NOW(), 'Agoniste multiple étudié pour la perte de poids.'),
('4c9db888-2682-4fb0-9c78-9a14529c9916', 'Selank',        'Bien-être',    27.90, 99.00, true,  '/src/assets/products/selank/peptide-selank.png',          NOW(), 'Peptide anxiolytique et nootropique.'),
('7979d686-c341-4606-944b-16f35097385c', 'Semaglutide',   'Métabolisme',  52.90, 99.00, true,  '/src/assets/products/semaglutide/peptide-semaglutide.png', NOW(), 'Analogue du GLP-1 étudié pour le contrôle glycémique.'),
('33139fef-a328-4f89-9586-29d7ee594cd7', 'Semax',         'Bien-être',    27.90, 99.00, true,  '/src/assets/products/semax/peptide-semax.png',            NOW(), 'Peptide neuroprotecteur / stimulant cognitif.'),
('480b7044-e72d-4616-b114-14b6ea7b7aad', 'TB-500',        'Récupération', 32.90, 99.00, true,  '/src/assets/products/tb-500/peptide-tb-500.png',          NOW(), 'Fragment synthétique du TB4 ; régénération tissulaire.'),
('4fa90261-496c-44e0-8dc8-dd81bd443d4a', 'Tesamorelin',   'Performance',  49.90, 98.00, false, '/src/assets/products/tesamorelin/peptide-tesamorelin.png', NOW(), 'GHRH analogue ; stimule la libération d’hormone de croissance.')

ON CONFLICT (name)
DO UPDATE SET
  category    = EXCLUDED.category,
  price       = EXCLUDED.price,
  purity      = EXCLUDED.purity,
  stock       = EXCLUDED.stock,
  image       = EXCLUDED.image,
  description = EXCLUDED.description,
  created_at  = NOW();

-- =====================================================
-- ✅ Fin du seed produits (cohérent avec assets/)
-- =====================================================
