-- === Insertion cohérente des peptides présents dans assets/products ===
WITH data(name, category, price, purity, stock, image, description) AS (
    VALUES
    ('BPC-157',       'Récupération', 34.90, 99.00, true,  '/assets/products/bpc-157/peptide-bpc-157.png',       'Peptide pro-régénératif pour tendons et tissus.'),
    ('CJC-1295',      'Performance',  44.90, 98.00, false, '/assets/products/cjc-1295/peptide-cjc-1295.png',      'Stimule la sécrétion naturelle de l’hormone de croissance (GH).'),
    ('DSIP',          'Bien-être',    29.90, 99.00, true,  '/assets/products/dsip/peptide-dsip.png',              'Delta Sleep-Inducing Peptide, étudié pour le sommeil.'),
    ('IGF-1 LR3',     'Performance',  59.90, 98.00, false, '/assets/products/igf-1-lr3/peptide-igf-1-lr3.png',    'Facteur de croissance insulinomimétique, variante LR3.'),
    ('Melanothan-2',  'Recherche',    39.90, 99.00, true,  '/assets/products/melanothan-2/peptide-melanothan-2.png','Analogue de l’α-MSH ; stimule le bronzage et la libido.'),
    ('MOTS-c',        'Recherche',    49.90, 99.00, true,  '/assets/products/mots-c/peptide-mots-c.png',          'Peptide mitochondrial étudié pour le métabolisme énergétique.'),
    ('PT-141',        'Bien-être',    42.90, 99.00, true,  '/assets/products/pt-141/peptide-pt-141.png',          'Bremelanotide ; applications libido / dysfonction sexuelle.'),
    ('Retatrutide',   'Métabolisme',  54.90, 99.00, true,  '/assets/products/retatrutide/peptide-retatrutide.png','Agoniste multiple étudié pour la perte de poids.'),
    ('Selank',        'Bien-être',    27.90, 99.00, true,  '/assets/products/selank/peptide-selank.png',          'Peptide anxiolytique et nootropique.'),
    ('Semaglutide',   'Métabolisme',  52.90, 99.00, true,  '/assets/products/semaglutide/peptide-semaglutide.png','Analogue du GLP-1 étudié pour le contrôle glycémique.'),
    ('Semax',         'Bien-être',    27.90, 99.00, true,  '/assets/products/semax/peptide-semax.png',            'Peptide neuroprotecteur / stimulant cognitif.'),
    ('TB-500',        'Récupération', 32.90, 99.00, true,  '/assets/products/tb-500/peptide-tb-500.png',          'Fragment synthétique du TB4 ; régénération tissulaire.'),
    ('Tesamorelin',   'Performance',  49.90, 98.00, false, '/assets/products/tesamorelin/peptide-tesamorelin.png','GHRH analogue ; stimule la libération d’hormone de croissance.')
)

INSERT INTO public.products
    (id, name, category, price, purity, stock, image, created_at, description)
SELECT
    gen_random_uuid(),
    d.name,
    d.category,
    d.price::numeric,
    d.purity::numeric,
    d.stock::boolean,
    d.image,
    NOW(),
    d.description
FROM data d
ON CONFLICT (name)
DO UPDATE SET
    category    = EXCLUDED.category,
    price       = EXCLUDED.price,
    purity      = EXCLUDED.purity,
    stock       = EXCLUDED.stock,
    image       = EXCLUDED.image,
    description = EXCLUDED.description;

-- (Optionnel) Supprimer les produits obsolètes
-- DELETE FROM public.products p WHERE p.name NOT IN (SELECT name FROM data);

-- CREATE UNIQUE INDEX IF NOT EXISTS products_name_key ON public.products (name);
