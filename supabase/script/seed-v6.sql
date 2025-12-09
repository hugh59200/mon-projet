-- =========================================
-- 🚀 SEED DATA V6.4 - AVEC RESOURCES (Lab Notes)
-- =========================================
-- Ce script inclut :
-- 1. Migration pour les colonnes i18n (JSONB)
-- 2. Migration SEO/GEO (cas_number, sequence)
-- 3. Données produits avec traductions EN + données scientifiques
-- 4. Données news et topics
-- 5. Configuration codes promo automatiques (V5.3)
-- 6. Système de reviews avec RLS policies (V6.2)
-- 7. Profil admin "Paloma" avec avatar
-- 8. Trigger email de bienvenue (V6.3)
-- 9. Ressources techniques Lab Notes (V6.4)
-- =========================================

-- ============================
-- 🌍 MIGRATION I18N
-- ============================

-- Products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS name_i18n JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category_i18n JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_products_name_i18n ON public.products USING GIN (name_i18n);

-- News
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS title_i18n JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS excerpt_i18n JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS content_i18n JSONB DEFAULT '{}';

-- News Topics
ALTER TABLE public.news_topics
  ADD COLUMN IF NOT EXISTS label_i18n JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}';

-- ============================
-- 🔬 MIGRATION SEO/GEO
-- ============================
-- Champs scientifiques pour améliorer l'indexation SEO
-- et la crédibilité auprès des IA (GEO)

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS cas_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS sequence TEXT;

CREATE INDEX IF NOT EXISTS idx_products_cas_number ON public.products (cas_number);

COMMENT ON COLUMN public.products.cas_number IS 'Numéro CAS (Chemical Abstracts Service) - Identifiant unique international pour les substances chimiques';
COMMENT ON COLUMN public.products.sequence IS 'Séquence d''acides aminés du peptide';

-- ============================
-- 📜 MIGRATION COA (Certificate of Analysis)
-- ============================
-- URL vers le certificat d'analyse du produit

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS coa_url TEXT;

COMMENT ON COLUMN public.products.coa_url IS 'URL du Certificate of Analysis (COA) - Preuve de pureté du peptide';

-- ============================
-- 💰 MIGRATION AOV (Prix Dégressifs)
-- ============================
-- Prix dégressifs par quantité pour augmenter le panier moyen

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS bulk_pricing JSONB DEFAULT '[{"quantity": 3, "discount_percent": 5}, {"quantity": 5, "discount_percent": 10}]'::jsonb;

COMMENT ON COLUMN public.products.bulk_pricing IS 'Prix dégressifs: [{"quantity": 3, "discount_percent": 5}, {"quantity": 5, "discount_percent": 10}]';

-- ============================
-- 👤 SEED — AUTH USERS
-- ============================
-- Création des utilisateurs :
-- 1. Admin (contact@fast-peptides.com) - mdp: 162497
-- 2. User test (h.bogrand@yopmail.com) - mdp: 162497

-- Utiliser des UUID fixes pour pouvoir référencer les utilisateurs
DO $$
DECLARE
  v_admin_id uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  v_user_id uuid := 'b2c3d4e5-f6a7-8901-bcde-f23456789012';
BEGIN
  -- ============================
  -- ADMIN USER
  -- ============================
  -- Supprimer les identities et l'utilisateur existants
  DELETE FROM auth.identities WHERE user_id = v_admin_id;
  DELETE FROM auth.users WHERE id = v_admin_id;

  -- Créer l'utilisateur admin
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    raw_app_meta_data,
    raw_user_meta_data,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
  VALUES (
    v_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'contact@fast-peptides.com',
    crypt('162497', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    '',
    '',
    '',
    ''
  );

  -- Créer l'identity pour l'admin
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    provider,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    v_admin_id,
    v_admin_id,
    'contact@fast-peptides.com',
    'email',
    jsonb_build_object(
      'sub', v_admin_id::text,
      'email', 'contact@fast-peptides.com',
      'email_verified', true,
      'provider', 'email'
    ),
    now(),
    now(),
    now()
  );

  -- ============================
  -- TEST USER
  -- ============================
  -- Supprimer les identities et l'utilisateur existants
  DELETE FROM auth.identities WHERE user_id = v_user_id;
  DELETE FROM auth.users WHERE id = v_user_id;

  -- Créer l'utilisateur test
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    raw_app_meta_data,
    raw_user_meta_data,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
  VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'h.bogrand@yopmail.com',
    crypt('162497', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    '',
    '',
    '',
    ''
  );

  -- Créer l'identity pour l'utilisateur test
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    provider,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    v_user_id,
    'h.bogrand@yopmail.com',
    'email',
    jsonb_build_object(
      'sub', v_user_id::text,
      'email', 'h.bogrand@yopmail.com',
      'email_verified', true,
      'provider', 'email'
    ),
    now(),
    now(),
    now()
  );
END $$;

-- ============================
-- 👤 SEED — PROFILES
-- ============================
INSERT INTO public.profiles (id, email, full_name, role, address, zip, city, avatar_url)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'contact@fast-peptides.com', 'Paloma', 'admin', '5850 Eubank Blvd NE, Suite B13', '87111', 'Albuquerque', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/avatars/admin-paloma.jpg'),
  ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'h.bogrand@yopmail.com', 'Hugo Test', 'user', '123 rue de Test', '75001', 'Paris', NULL)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  address = EXCLUDED.address,
  zip = EXCLUDED.zip,
  city = EXCLUDED.city,
  avatar_url = EXCLUDED.avatar_url;

-- ============================
-- 📦 SEED — PRODUCTS AVEC I18N + SEO
-- ============================

INSERT INTO public.products (name, name_i18n, dosage, category, category_i18n, price, sale_price, is_on_sale, stock, image, tags, description, description_i18n, cas_number, sequence, coa_url)
VALUES

-- 1. BPC-157
('BPC-157',
 '{"en": "BPC-157"}',
 '10mg',
 'Récupération',
 '{"en": "Recovery"}',
 40.00, 36.00, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/bpc-157-10mg.webp',
 '{"recuperation", "articulations"}',
 '<p><strong>Le BPC-157 (Body Protection Compound-157)</strong> est un pentadécapeptide composé de 15 acides aminés, dérivé d''une protéine protectrice présente naturellement dans l''estomac humain.</p><p>Dans le cadre de la recherche, ce peptide est largement étudié pour ses propriétés potentielles de cytoprotection et d''angiogenèse (formation de nouveaux vaisseaux sanguins).</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Accélération de la cicatrisation des tendons et ligaments.</li><li>Réduction de l''inflammation intestinale.</li><li>Protection cellulaire contre les toxines.</li></ul>',
 '{"en": "<p><strong>BPC-157 (Body Protection Compound-157)</strong> is a pentadecapeptide composed of 15 amino acids, derived from a protective protein naturally present in the human stomach.</p><p>In research, this peptide is widely studied for its potential cytoprotective and angiogenic properties (formation of new blood vessels).</p><p><strong>Main research areas:</strong></p><ul><li>Acceleration of tendon and ligament healing.</li><li>Reduction of intestinal inflammation.</li><li>Cellular protection against toxins.</li></ul>"}',
 '137525-51-0',
 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/bpc-157-5mg.jpg'),

-- 2. TB-500
('TB-500',
 '{"en": "TB-500"}',
 '5mg',
 'Récupération',
 '{"en": "Recovery"}',
 45.00, 40.50, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/tb-500-5mg.webp',
 '{"recuperation", "souplesse"}',
 '<p><strong>Le TB-500</strong> est une version synthétique de la Thymosin Beta-4, une protéine présente dans presque toutes les cellules humaines et animales. Elle joue un rôle clé dans la régulation de l''actine cellulaire.</p><p>Les chercheurs s''intéressent à sa capacité à favoriser la migration cellulaire vers les zones lésées, facilitant ainsi la régénération tissulaire.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Réduction de l''inflammation tissulaire.</li><li>Amélioration de la flexibilité et réduction des adhérences.</li><li>Récupération musculaire post-traumatique.</li></ul>',
 '{"en": "<p><strong>TB-500</strong> is a synthetic version of Thymosin Beta-4, a protein present in almost all human and animal cells. It plays a key role in cellular actin regulation.</p><p>Researchers are interested in its ability to promote cell migration to injured areas, facilitating tissue regeneration.</p><p><strong>Main research areas:</strong></p><ul><li>Reduction of tissue inflammation.</li><li>Improved flexibility and reduced adhesions.</li><li>Post-traumatic muscle recovery.</li></ul>"}',
 '77591-33-4',
 'Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Gly-Glu-Ser',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/tb-500-10mg.jpg'),

-- 3. Semaglutide
('Semaglutide',
 '{"en": "Semaglutide"}',
 '10mg',
 'Perte de poids',
 '{"en": "Weight Loss"}',
 75.00, 67.50, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/semaglutide-10mg.webp',
 '{"minceur", "metabolisme"}',
 '<p><strong>Le Semaglutide</strong> est un agoniste des récepteurs du GLP-1 (Glucagon-Like Peptide-1). Il imite l''action de l''hormone incrétine naturelle qui régule la glycémie.</p><p>En laboratoire, il est étudié pour sa capacité à ralentir la vidange gastrique et à influencer les signaux de satiété au niveau de l''hypothalamus.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Régulation de l''insuline et de la glycémie.</li><li>Études sur la réduction de la masse adipeuse.</li><li>Contrôle de l''appétit dans les modèles animaux.</li></ul>',
 '{"en": "<p><strong>Semaglutide</strong> is a GLP-1 (Glucagon-Like Peptide-1) receptor agonist. It mimics the action of the natural incretin hormone that regulates blood sugar.</p><p>In the laboratory, it is studied for its ability to slow gastric emptying and influence satiety signals in the hypothalamus.</p><p><strong>Main research areas:</strong></p><ul><li>Insulin and blood sugar regulation.</li><li>Studies on adipose mass reduction.</li><li>Appetite control in animal models.</li></ul>"}',
 '910463-68-2',
 'His-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys-Glu-Phe-Ile-Ala-Trp-Leu-Val-Arg-Gly-Arg-Gly',
 NULL),

-- 4. Tirzepatide
('Tirzepatide',
 '{"en": "Tirzepatide"}',
 '10mg',
 'Perte de poids',
 '{"en": "Weight Loss"}',
 85.00, 76.50, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/tirzepatide-10mg.webp',
 '{"minceur", "avancé"}',
 '<p><strong>Le Tirzepatide</strong> est un peptide innovant à double action : il agit comme agoniste des récepteurs GIP (polypeptide insulinotrope dépendant du glucose) et GLP-1.</p><p>Cette synergie unique en fait un sujet d''étude privilégié pour le traitement des désordres métaboliques sévères, offrant une efficacité potentiellement supérieure aux agonistes GLP-1 seuls.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Synergie GIP/GLP-1 pour le métabolisme.</li><li>Amélioration de la sensibilité à l''insuline.</li><li>Impact significatif sur la composition corporelle.</li></ul>',
 '{"en": "<p><strong>Tirzepatide</strong> is an innovative dual-action peptide: it acts as an agonist of both GIP (glucose-dependent insulinotropic polypeptide) and GLP-1 receptors.</p><p>This unique synergy makes it a preferred subject for studying severe metabolic disorders, offering potentially superior efficacy to GLP-1 agonists alone.</p><p><strong>Main research areas:</strong></p><ul><li>GIP/GLP-1 synergy for metabolism.</li><li>Improved insulin sensitivity.</li><li>Significant impact on body composition.</li></ul>"}',
 '2023788-19-2',
 'Tyr-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Tyr-Ser-Ile-Aib-Leu-Asp-Lys-Ile-Ala-Gln-Lys-Ala-Phe-Val-Gln-Trp-Leu-Ile-Ala-Gly-Gly-Pro-Ser-Ser-Gly-Ala-Pro-Pro-Pro-Ser',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/tirzepatide-60mg.jpg'),

-- 5. Retatrutide
('Retatrutide',
 '{"en": "Retatrutide"}',
 '10mg',
 'Perte de poids',
 '{"en": "Weight Loss"}',
 60.00, 54.00, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/retatrutide-10mg.webp',
 '{"metabolisme", "perte-de-poids"}',
 '<p><strong>Le Retatrutide</strong> est un candidat de nouvelle génération qualifié de "triple agoniste" (GLP-1, GIP et Glucagon). C''est actuellement l''un des peptides les plus prometteurs en recherche métabolique.</p><p>L''ajout de l''agonisme du récepteur au glucagon vise à augmenter la dépense énergétique basale, en plus des effets sur la satiété.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Stimulation de la dépense énergétique.</li><li>Régulation hépatique des lipides.</li><li>Gestion avancée de l''obésité.</li></ul>',
 '{"en": "<p><strong>Retatrutide</strong> is a next-generation candidate qualified as a \"triple agonist\" (GLP-1, GIP and Glucagon). It is currently one of the most promising peptides in metabolic research.</p><p>The addition of glucagon receptor agonism aims to increase basal energy expenditure, in addition to satiety effects.</p><p><strong>Main research areas:</strong></p><ul><li>Stimulation of energy expenditure.</li><li>Hepatic lipid regulation.</li><li>Advanced obesity management.</li></ul>"}',
 '2381089-83-2',
 'Tyr-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Tyr-Ser-Ile-Aib-Leu-Asp-Lys-Ile-Ala-Gln-Glu-Ala-Phe-Ile-Glu-Trp-Leu-Leu-Ala-Gly-Gly-Pro-Ser-Ser-Gly-Ala-Pro-Pro-Pro-Ser',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/retatrutide-60mg.jpg'),

-- 6. CJC-1295 DAC
('CJC-1295 DAC',
 '{"en": "CJC-1295 DAC"}',
 '5mg',
 'Croissance',
 '{"en": "Growth"}',
 42.00, 37.80, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/cjc-1295-dac-5mg.webp',
 '{"croissance", "masse"}',
 '<p><strong>Le CJC-1295 avec DAC</strong> (Drug Affinity Complex) est un analogue synthétique de la GHRH (Growth Hormone Releasing Hormone). La modification DAC permet de se lier à l''albumine sérique, prolongeant considérablement sa demi-vie.</p><p>Contrairement au CJC sans DAC, cette version permet de maintenir des niveaux physiologiques élevés d''hormone de croissance de manière continue sur plusieurs jours.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Stimulation continue de la sécrétion de GH et d''IGF-1.</li><li>Études sur l''anabolisme musculaire à long terme.</li><li>Amélioration de la synthèse protéique.</li></ul>',
 '{"en": "<p><strong>CJC-1295 with DAC</strong> (Drug Affinity Complex) is a synthetic analog of GHRH (Growth Hormone Releasing Hormone). The DAC modification allows binding to serum albumin, considerably extending its half-life.</p><p>Unlike CJC without DAC, this version maintains elevated physiological growth hormone levels continuously over several days.</p><p><strong>Main research areas:</strong></p><ul><li>Continuous stimulation of GH and IGF-1 secretion.</li><li>Studies on long-term muscle anabolism.</li><li>Improved protein synthesis.</li></ul>"}',
 '863288-34-0',
 'Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/cjc-1295-5mg.jpg'),

-- 7. GHRP-6
('GHRP-6',
 '{"en": "GHRP-6"}',
 '10mg',
 'Croissance',
 '{"en": "Growth"}',
 32.00, 28.80, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/ghrp-6-10mg.webp',
 '{"croissance", "appetit"}',
 '<p><strong>Le GHRP-6</strong> (Growth Hormone Releasing Peptide-6) est un hexapeptide sécrétagogue qui stimule la libération d''hormone de croissance par l''hypophyse.</p><p>Il est également connu pour son interaction avec les récepteurs de la ghréline, ce qui peut induire une augmentation significative de l''appétit, un effet recherché dans certains contextes de prise de masse.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Pics rapides de sécrétion de GH.</li><li>Stimulation de l''appétit et prise de masse.</li><li>Effets anti-inflammatoires systémiques.</li></ul>',
 '{"en": "<p><strong>GHRP-6</strong> (Growth Hormone Releasing Peptide-6) is a hexapeptide secretagogue that stimulates growth hormone release from the pituitary gland.</p><p>It is also known for its interaction with ghrelin receptors, which can induce a significant increase in appetite, an effect sought in certain mass-gaining contexts.</p><p><strong>Main research areas:</strong></p><ul><li>Rapid GH secretion peaks.</li><li>Appetite stimulation and mass gain.</li><li>Systemic anti-inflammatory effects.</li></ul>"}',
 '87616-84-0',
 'His-D-Trp-Ala-Trp-D-Phe-Lys',
 NULL),

-- 8. Hexarelin
('Hexarelin',
 '{"en": "Hexarelin"}',
 '5mg',
 'Croissance',
 '{"en": "Growth"}',
 38.00, 34.20, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/hexarelin-5mg.webp',
 '{"croissance", "force"}',
 '<p><strong>L''Hexarelin</strong> est considéré comme l''un des sécrétagogues de GH les plus puissants disponibles, structurellement similaire au GHRP-6 mais avec un profil d''efficacité plus élevé.</p><p>Il a la particularité de ne pas augmenter l''appétit de manière aussi marquée que le GHRP-6, tout en offrant une libération massive de GH.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Augmentation maximale des niveaux plasmatiques de GH.</li><li>Propriétés cardioprotectrices potentielles.</li><li>Récupération neurale.</li></ul>',
 '{"en": "<p><strong>Hexarelin</strong> is considered one of the most potent GH secretagogues available, structurally similar to GHRP-6 but with a higher efficacy profile.</p><p>It has the distinction of not increasing appetite as markedly as GHRP-6, while offering massive GH release.</p><p><strong>Main research areas:</strong></p><ul><li>Maximum increase in plasma GH levels.</li><li>Potential cardioprotective properties.</li><li>Neural recovery.</li></ul>"}',
 '140703-51-1',
 'His-D-2MeTrp-Ala-Trp-D-Phe-Lys',
 NULL),

-- 9. Sermorelin
('Sermorelin',
 '{"en": "Sermorelin"}',
 '5mg',
 'Anti-âge',
 '{"en": "Anti-aging"}',
 35.00, 31.50, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/sermorelin-5mg.webp',
 '{"anti-age", "sommeil"}',
 '<p><strong>La Sermorelin</strong> est un analogue biologique de la GHRH (correspondant aux 29 premiers acides aminés). C''est l''un des peptides les plus prescrits en clinique anti-âge aux États-Unis.</p><p>Il stimule l''hypophyse de manière naturelle pour produire de la GH par vagues (pulsatile), respectant ainsi le rythme circadien du corps.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Amélioration de la qualité du sommeil profond.</li><li>Effets anti-âge et vitalité générale.</li><li>Optimisation de la composition corporelle.</li></ul>',
 '{"en": "<p><strong>Sermorelin</strong> is a biological analog of GHRH (corresponding to the first 29 amino acids). It is one of the most prescribed peptides in anti-aging clinics in the United States.</p><p>It naturally stimulates the pituitary to produce GH in waves (pulsatile), thus respecting the body''s circadian rhythm.</p><p><strong>Main research areas:</strong></p><ul><li>Improved deep sleep quality.</li><li>Anti-aging effects and general vitality.</li><li>Body composition optimization.</li></ul>"}',
 '86168-78-7',
 'Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg',
 NULL),

-- 10. PEG-MGF
('PEG-MGF',
 '{"en": "PEG-MGF"}',
 '2mg',
 'Performance',
 '{"en": "Performance"}',
 40.00, 36.00, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/peg-mgf-2mg.webp',
 '{"muscle", "récupération"}',
 '<p><strong>Le PEG-MGF</strong> (Pegylated Mechano Growth Factor) est une variante épissée de l''IGF-1. L''ajout de polyéthylène glycol (PEG) protège le peptide de la dégradation rapide.</p><p>Il est spécifiquement étudié pour son rôle dans l''activation des cellules satellites musculaires suite à un stress mécanique (entraînement), favorisant l''hypertrophie locale.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Réparation musculaire localisée.</li><li>Activation des cellules souches musculaires.</li><li>Neuroprotection.</li></ul>',
 '{"en": "<p><strong>PEG-MGF</strong> (Pegylated Mechano Growth Factor) is a spliced variant of IGF-1. The addition of polyethylene glycol (PEG) protects the peptide from rapid degradation.</p><p>It is specifically studied for its role in activating muscle satellite cells following mechanical stress (training), promoting local hypertrophy.</p><p><strong>Main research areas:</strong></p><ul><li>Localized muscle repair.</li><li>Muscle stem cell activation.</li><li>Neuroprotection.</li></ul>"}',
 '112445-51-5',
 'PEG-Tyr-Gly-Pro-Lys-Gly-Thr-Met-Asp-Leu-Glu-Cys-Val-Leu-Ser-Leu-Ala-Arg-Gln-Pro-His-Gln-Gly',
 NULL),

-- 11. Melanotan 2
('Melanotan 2',
 '{"en": "Melanotan 2"}',
 '10mg',
 'Bien-être',
 '{"en": "Wellness"}',
 35.00, 31.50, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/melanotan-2-10mg.webp',
 '{"bronzage", "libido"}',
 '<p><strong>Le Melanotan 2</strong> est un analogue synthétique de l''hormone alpha-mélanocytaire (α-MSH). Il agit principalement sur les récepteurs de la mélanocortine.</p><p>Il est célèbre pour sa capacité à stimuler la mélanogenèse (production de mélanine) sans exposition excessive aux UV, mais possède également des effets marqués sur la libido.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Stimulation de la pigmentation de la peau.</li><li>Amélioration de la fonction érectile et de la libido.</li><li>Réduction de l''appétit.</li></ul>',
 '{"en": "<p><strong>Melanotan 2</strong> is a synthetic analog of alpha-melanocyte-stimulating hormone (α-MSH). It primarily acts on melanocortin receptors.</p><p>It is famous for its ability to stimulate melanogenesis (melanin production) without excessive UV exposure, but also has marked effects on libido.</p><p><strong>Main research areas:</strong></p><ul><li>Stimulation of skin pigmentation.</li><li>Improvement of erectile function and libido.</li><li>Appetite reduction.</li></ul>"}',
 '121062-08-6',
 'Ac-Nle-cyclo(Asp-His-D-Phe-Arg-Trp-Lys)',
 NULL),

-- 12. PT-141
('PT-141',
 '{"en": "PT-141"}',
 '10mg',
 'Bien-être',
 '{"en": "Wellness"}',
 45.00, 40.50, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/pt-141-10mg.webp',
 '{"libido", "sexualité"}',
 '<p><strong>Le PT-141 (Bremelanotide)</strong> est un dérivé du Melanotan 2, spécifiquement affiné pour cibler les récepteurs responsables de l''excitation sexuelle, en minimisant l''effet sur la pigmentation.</p><p>Contrairement aux traitements classiques (type Viagra) qui agissent sur le système vasculaire, le PT-141 agit directement sur le système nerveux central.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Traitement des troubles du désir hypoactif.</li><li>Efficacité chez l''homme et la femme.</li><li>Action via le système nerveux central.</li></ul>',
 '{"en": "<p><strong>PT-141 (Bremelanotide)</strong> is a derivative of Melanotan 2, specifically refined to target receptors responsible for sexual arousal, while minimizing the effect on pigmentation.</p><p>Unlike classic treatments (Viagra type) that act on the vascular system, PT-141 acts directly on the central nervous system.</p><p><strong>Main research areas:</strong></p><ul><li>Treatment of hypoactive desire disorders.</li><li>Efficacy in both men and women.</li><li>Action via the central nervous system.</li></ul>"}',
 '189691-06-3',
 'Ac-Nle-cyclo(Asp-His-D-Phe-Arg-Trp-Lys)',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/pt-141-10mg.jpg'),

-- 13. Kisspeptine-10
('Kisspeptine-10',
 '{"en": "Kisspeptine-10"}',
 '10mg',
 'Hormonal',
 '{"en": "Hormonal"}',
 38.00, 34.20, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/kisspeptine-10-10mg.webp',
 '{"hormonal", "equilibre"}',
 '<p><strong>La Kisspeptine-10</strong> est un peptide puissant qui initie la sécrétion de GnRH (Gonadotropin-releasing hormone). C''est un régulateur clé de l''axe reproducteur.</p><p>En recherche, elle est étudiée pour sa capacité à relancer la production naturelle de testostérone sans inhiber la spermatogenèse.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Stimulation de la LH et de la FSH.</li><li>Restauration de l''axe HPTA.</li><li>Recherche sur la fertilité.</li></ul>',
 '{"en": "<p><strong>Kisspeptine-10</strong> is a potent peptide that initiates GnRH (Gonadotropin-releasing hormone) secretion. It is a key regulator of the reproductive axis.</p><p>In research, it is studied for its ability to restart natural testosterone production without inhibiting spermatogenesis.</p><p><strong>Main research areas:</strong></p><ul><li>Stimulation of LH and FSH.</li><li>HPTA axis restoration.</li><li>Fertility research.</li></ul>"}',
 '374675-21-5',
 'Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe',
 NULL),

-- 14. Selank
('Selank',
 '{"en": "Selank"}',
 '5mg',
 'Nootropique',
 '{"en": "Nootropic"}',
 30.00, 27.00, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/selank-5mg.webp',
 '{"anti-stress", "nootropique"}',
 '<p><strong>Le Selank</strong> est un peptide synthétique dérivé de la tuftsin, naturellement produite par le corps. Il est classé comme anxiolytique et nootropique.</p><p>Il module l''expression du facteur neurotrophique BDNF et influence l''équilibre des neurotransmetteurs (sérotonine, dopamine) pour stabiliser l''humeur.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Réduction de l''anxiété généralisée sans sédation.</li><li>Amélioration de la clarté mentale.</li><li>Renforcement du système immunitaire.</li></ul>',
 '{"en": "<p><strong>Selank</strong> is a synthetic peptide derived from tuftsin, naturally produced by the body. It is classified as an anxiolytic and nootropic.</p><p>It modulates the expression of neurotrophic factor BDNF and influences the balance of neurotransmitters (serotonin, dopamine) to stabilize mood.</p><p><strong>Main research areas:</strong></p><ul><li>Reduction of generalized anxiety without sedation.</li><li>Improved mental clarity.</li><li>Immune system strengthening.</li></ul>"}',
 '129954-34-3',
 'Thr-Lys-Pro-Arg-Pro-Gly-Pro',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/selank-10mg.jpg'),

-- 15. Semax
('Semax',
 '{"en": "Semax"}',
 '5mg',
 'Nootropique',
 '{"en": "Nootropic"}',
 30.00, 27.00, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/semax-5mg.webp',
 '{"focus", "memoire"}',
 '<p><strong>Le Semax</strong> est un heptapeptide développé initialement en Russie pour traiter les accidents vasculaires cérébraux. C''est un puissant modulateur cognitif.</p><p>Il augmente significativement les niveaux de BDNF (Brain-Derived Neurotrophic Factor), favorisant la survie des neurones et la plasticité synaptique.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Amélioration de la concentration et de la mémoire.</li><li>Neuroprotection en cas d''hypoxie.</li><li>Réduction de la fatigue mentale.</li></ul>',
 '{"en": "<p><strong>Semax</strong> is a heptapeptide originally developed in Russia to treat strokes. It is a powerful cognitive modulator.</p><p>It significantly increases BDNF (Brain-Derived Neurotrophic Factor) levels, promoting neuron survival and synaptic plasticity.</p><p><strong>Main research areas:</strong></p><ul><li>Improved concentration and memory.</li><li>Neuroprotection in case of hypoxia.</li><li>Reduced mental fatigue.</li></ul>"}',
 '80714-61-0',
 'Met-Glu-His-Phe-Pro-Gly-Pro',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/semax-10mg.jpg'),

-- 16. GHK-Cu
('GHK-Cu',
 '{"en": "GHK-Cu"}',
 '100mg',
 'Cosmétique',
 '{"en": "Cosmetic"}',
 55.00, 49.50, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/ghk-cu-100mg.webp',
 '{"peau", "cheveux", "anti-age"}',
 '<p><strong>Le GHK-Cu</strong> est un complexe peptide-cuivre naturel présent dans le plasma humain. Sa concentration diminue drastiquement avec l''âge.</p><p>Il est célèbre pour ses propriétés régénératrices exceptionnelles sur la peau (synthèse de collagène) et les follicules pileux.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Raffermissement de la peau et réduction des rides.</li><li>Stimulation de la pousse des cheveux.</li><li>Cicatrisation avancée des plaies.</li></ul>',
 '{"en": "<p><strong>GHK-Cu</strong> is a natural peptide-copper complex present in human plasma. Its concentration decreases drastically with age.</p><p>It is famous for its exceptional regenerative properties on skin (collagen synthesis) and hair follicles.</p><p><strong>Main research areas:</strong></p><ul><li>Skin firming and wrinkle reduction.</li><li>Hair growth stimulation.</li><li>Advanced wound healing.</li></ul>"}',
 '49557-75-7',
 'Gly-His-Lys-Cu',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/ghk-cu-100mg.jpg'),

-- 17. NAD+
('NAD+',
 '{"en": "NAD+"}',
 '500mg',
 'Anti-âge',
 '{"en": "Anti-aging"}',
 48.00, 43.20, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/nad-500mg.webp',
 '{"energie", "longevite"}',
 '<p><strong>Le NAD+ (Nicotinamide Adénine Dinucléotide)</strong> est une coenzyme présente dans toutes les cellules vivantes, essentielle à la production d''énergie (ATP) dans les mitochondries.</p><p>Les niveaux de NAD+ chutent avec l''âge, ce qui est lié au vieillissement cellulaire et métabolique. La supplémentation est une voie majeure de la recherche anti-âge.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Restauration de la fonction mitochondriale.</li><li>Réparation de l''ADN (activation des sirtuines).</li><li>Amélioration de l''énergie cellulaire et cognitive.</li></ul>',
 '{"en": "<p><strong>NAD+ (Nicotinamide Adenine Dinucleotide)</strong> is a coenzyme present in all living cells, essential for energy production (ATP) in mitochondria.</p><p>NAD+ levels drop with age, which is linked to cellular and metabolic aging. Supplementation is a major avenue of anti-aging research.</p><p><strong>Main research areas:</strong></p><ul><li>Restoration of mitochondrial function.</li><li>DNA repair (sirtuin activation).</li><li>Improved cellular and cognitive energy.</li></ul>"}',
 '53-84-9',
 NULL,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/nad-500mg.jpg'),

-- 18. Thymosin Alpha-1
('Thymosin Alpha-1',
 '{"en": "Thymosin Alpha-1"}',
 '5mg',
 'Santé',
 '{"en": "Health"}',
 52.00, 46.80, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/thymosin-alpha-1-5mg.webp',
 '{"immunite", "sante"}',
 '<p><strong>La Thymosin Alpha-1</strong> est un peptide thymique naturel qui joue un rôle crucial dans la modulation du système immunitaire.</p><p>Il aide à la maturation des lymphocytes T. Il est étudié pour sa capacité à renforcer la réponse immunitaire face aux infections virales et au vieillissement du système immunitaire (immunosénescence).</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Renforcement des défenses immunitaires.</li><li>Propriétés antivirales et antifongiques.</li><li>Amélioration de l''efficacité des vaccins.</li></ul>',
 '{"en": "<p><strong>Thymosin Alpha-1</strong> is a natural thymic peptide that plays a crucial role in immune system modulation.</p><p>It helps with T lymphocyte maturation. It is studied for its ability to strengthen immune response against viral infections and immune system aging (immunosenescence).</p><p><strong>Main research areas:</strong></p><ul><li>Immune defense strengthening.</li><li>Antiviral and antifungal properties.</li><li>Improved vaccine efficacy.</li></ul>"}',
 '62304-98-7',
 'Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn',
 NULL),

-- 19. DSIP
('DSIP',
 '{"en": "DSIP"}',
 '5mg',
 'Anti-âge',
 '{"en": "Anti-aging"}',
 38.00, 34.20, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/dsip-5mg.webp',
 '{"sommeil", "stress", "neuroprotection"}',
 '<p><strong>Le DSIP (Delta Sleep-Inducing Peptide)</strong> est un nonapeptide neuromodulateur découvert pour sa capacité à induire le sommeil à ondes lentes (delta). Il est naturellement présent dans l''hypothalamus et le système limbique.</p><p>Ce peptide régule le cycle veille-sommeil, module la réponse au stress via l''axe HPA et possède des propriétés antioxydantes au niveau mitochondrial.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Amélioration de la qualité du sommeil profond.</li><li>Réduction du cortisol et modulation du stress.</li><li>Propriétés neuroprotectrices et antioxydantes.</li></ul>',
 '{"en": "<p><strong>DSIP (Delta Sleep-Inducing Peptide)</strong> is a neuromodulatory nonapeptide discovered for its ability to induce slow-wave sleep (delta). It is naturally present in the hypothalamus and limbic system.</p><p>This peptide regulates the sleep-wake cycle, modulates stress response via the HPA axis, and has antioxidant properties at the mitochondrial level.</p><p><strong>Main research areas:</strong></p><ul><li>Improved deep sleep quality.</li><li>Cortisol reduction and stress modulation.</li><li>Neuroprotective and antioxidant properties.</li></ul>"}',
 '62568-57-4',
 'Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/dsip-5mg.jpg'),

-- 20. Ipamorelin
('Ipamorelin',
 '{"en": "Ipamorelin"}',
 '5mg',
 'Croissance',
 '{"en": "Growth"}',
 40.00, 36.00, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/ipamorelin-5mg.webp',
 '{"croissance", "selectif"}',
 '<p><strong>L''Ipamorelin</strong> est un pentapeptide sécrétagogue de GH de 3ème génération, reconnu comme le premier agoniste du récepteur GHRP avec une sélectivité comparable à la GHRH.</p><p>Contrairement au GHRP-6 et GHRP-2, l''Ipamorelin ne stimule pas la libération d''ACTH ni de cortisol, même à des doses 200 fois supérieures à l''ED50 pour la GH.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Libération sélective de GH sans effets sur le cortisol.</li><li>Pas d''augmentation significative de l''appétit.</li><li>Amélioration de la densité osseuse et récupération musculaire.</li></ul>',
 '{"en": "<p><strong>Ipamorelin</strong> is a 3rd generation GH secretagogue pentapeptide, recognized as the first GHRP receptor agonist with selectivity comparable to GHRH.</p><p>Unlike GHRP-6 and GHRP-2, Ipamorelin does not stimulate ACTH or cortisol release, even at doses 200 times higher than the ED50 for GH.</p><p><strong>Main research areas:</strong></p><ul><li>Selective GH release without cortisol effects.</li><li>No significant appetite increase.</li><li>Improved bone density and muscle recovery.</li></ul>"}',
 '170851-70-4',
 'Aib-His-D-2Nal-D-Phe-Lys',
 NULL),

-- 21. Klow
('Klow',
 '{"en": "Klow"}',
 '80mg',
 'Récupération',
 '{"en": "Recovery"}',
 95.00, 85.50, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/klow-80mg.webp',
 '{"regeneration", "anti-inflammatoire", "blend"}',
 '<p><strong>Le Klow Blend</strong> est une formulation synergique combinant quatre peptides régénératifs : GHK-Cu (50mg), BPC-157 (10mg), TB-500 (10mg) et KPV (10mg).</p><p>Cette combinaison cible des voies complémentaires : réparation tissulaire, modulation de l''inflammation, angiogenèse et remodelage de la matrice extracellulaire.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Régénération tissulaire et cicatrisation accélérée.</li><li>Modulation anti-inflammatoire via inhibition NF-κB.</li><li>Stimulation de la production de collagène et élastine.</li></ul>',
 '{"en": "<p><strong>Klow Blend</strong> is a synergistic formulation combining four regenerative peptides: GHK-Cu (50mg), BPC-157 (10mg), TB-500 (10mg), and KPV (10mg).</p><p>This combination targets complementary pathways: tissue repair, inflammation modulation, angiogenesis, and extracellular matrix remodeling.</p><p><strong>Main research areas:</strong></p><ul><li>Tissue regeneration and accelerated healing.</li><li>Anti-inflammatory modulation via NF-κB inhibition.</li><li>Stimulation of collagen and elastin production.</li></ul>"}',
 NULL,
 NULL,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/klow-80mg.jpg'),

-- 22. SLU-PP-332
('SLU-PP-332',
 '{"en": "SLU-PP-332"}',
 '10mg',
 'Performance',
 '{"en": "Performance"}',
 65.00, 58.50, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/slu-pp-332-10mg.webp',
 '{"metabolisme", "exercice-mimetique", "mitochondrie"}',
 '<p><strong>Le SLU-PP-332</strong> est un agoniste pan-ERR (Estrogen-Related Receptor) qualifié de "mimétique de l''exercice". Il cible les trois isoformes ERRα, ERRβ et ERRγ avec une préférence pour ERRα.</p><p>Ce composé active un programme génétique d''exercice aérobie aigu, augmentant la fonction mitochondriale et la respiration cellulaire dans le muscle squelettique.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Augmentation de l''endurance et des fibres musculaires oxydatives.</li><li>Amélioration de l''oxydation des acides gras.</li><li>Réduction de la masse adipeuse viscérale.</li></ul>',
 '{"en": "<p><strong>SLU-PP-332</strong> is a pan-ERR (Estrogen-Related Receptor) agonist qualified as an \"exercise mimetic\". It targets all three ERRα, ERRβ, and ERRγ isoforms with preference for ERRα.</p><p>This compound activates an acute aerobic exercise genetic program, increasing mitochondrial function and cellular respiration in skeletal muscle.</p><p><strong>Main research areas:</strong></p><ul><li>Increased endurance and oxidative muscle fibers.</li><li>Improved fatty acid oxidation.</li><li>Reduced visceral adipose mass.</li></ul>"}',
 '1628607-64-0',
 NULL,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/slu-pp-332-5mg.jpg'),

-- 23. SS-31
('SS-31',
 '{"en": "SS-31"}',
 '10mg',
 'Anti-âge',
 '{"en": "Anti-aging"}',
 70.00, 63.00, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/ss-31-10mg.webp',
 '{"mitochondrie", "energie", "cardioprotection"}',
 '<p><strong>Le SS-31 (Elamipretide)</strong> est un tétrapeptide synthétique ciblant spécifiquement les mitochondries. Il interagit avec la cardiolipine de la membrane mitochondriale interne pour stabiliser la chaîne de transport d''électrons.</p><p>Ce peptide améliore la production d''ATP tout en réduisant le stress oxydatif à la source, dans les mitochondries elles-mêmes.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Restauration de la bioénergétique mitochondriale.</li><li>Protection contre le stress oxydatif cellulaire.</li><li>Amélioration de la fonction cardiaque et musculaire liée à l''âge.</li></ul>',
 '{"en": "<p><strong>SS-31 (Elamipretide)</strong> is a synthetic tetrapeptide specifically targeting mitochondria. It interacts with cardiolipin of the inner mitochondrial membrane to stabilize the electron transport chain.</p><p>This peptide improves ATP production while reducing oxidative stress at the source, in the mitochondria themselves.</p><p><strong>Main research areas:</strong></p><ul><li>Restoration of mitochondrial bioenergetics.</li><li>Protection against cellular oxidative stress.</li><li>Improved age-related cardiac and muscle function.</li></ul>"}',
 '736992-21-5',
 'D-Arg-Dmt-Lys-Phe',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/coa/ss-31-50mg.jpg'),

-- 24. Tesamorelin
('Tesamorelin',
 '{"en": "Tesamorelin"}',
 '10mg',
 'Perte de poids',
 '{"en": "Weight Loss"}',
 80.00, 72.00, true, 10,
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/products/tesamorelin-10mg.webp',
 '{"ghrh", "adiposite", "cognition"}',
 '<p><strong>Le Tesamorelin</strong> est un analogue synthétique de 44 acides aminés de la GHRH, modifié par l''ajout d''un groupe trans-3-hexanoïque qui le protège de la dégradation par la DPP-4.</p><p>C''est le seul peptide GHRH approuvé par la FDA pour le traitement de la lipodystrophie associée au VIH, avec une réduction de la graisse viscérale d''environ 18%.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Réduction significative du tissu adipeux viscéral.</li><li>Amélioration du profil lipidique et de la stéatose hépatique.</li><li>Effets nootropiques et amélioration cognitive.</li></ul>',
 '{"en": "<p><strong>Tesamorelin</strong> is a 44 amino acid synthetic analog of GHRH, modified by adding a trans-3-hexanoic group that protects it from DPP-4 degradation.</p><p>It is the only GHRH peptide approved by the FDA for treating HIV-associated lipodystrophy, with approximately 18% reduction in visceral fat.</p><p><strong>Main research areas:</strong></p><ul><li>Significant reduction of visceral adipose tissue.</li><li>Improved lipid profile and hepatic steatosis.</li><li>Nootropic effects and cognitive improvement.</li></ul>"}',
 '218949-48-5',
 'Trans-3-hexenoic acid-Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg',
 NULL)

ON CONFLICT (name, dosage) DO UPDATE SET
  name_i18n = EXCLUDED.name_i18n,
  category_i18n = EXCLUDED.category_i18n,
  description_i18n = EXCLUDED.description_i18n,
  stock = EXCLUDED.stock,
  price = EXCLUDED.price,
  sale_price = EXCLUDED.sale_price,
  is_on_sale = EXCLUDED.is_on_sale,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  cas_number = EXCLUDED.cas_number,
  sequence = EXCLUDED.sequence,
  coa_url = EXCLUDED.coa_url;

-- ============================
-- 📰 SEED — NEWS TOPICS
-- ============================
INSERT INTO public.news_topics (id, slug, label, label_i18n, description, description_i18n, image)
VALUES
('76bb3e2d-d0c7-41aa-a59c-32f4c77379e9', 'recherche', 'Recherche & Innovation', '{"en": "Research & Innovation"}', 'Les dernières avancées sur les peptides.', '{"en": "The latest advances in peptides."}', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/recherche-innovation/topic-recherche-innovation-de988705-a90a-4fd8-bf3a-5a09091b5c5b.png'),
('82334ce4-0fcd-4947-9aa8-1bb16da64d91', 'bien-etre', 'Bien-être & Cosmétiques', '{"en": "Wellness & Cosmetics"}', 'Les peptides dans les soins, la beauté et le bien-être.', '{"en": "Peptides in skincare, beauty and wellness."}', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/bien-etre-cosmetiques/topic-bien-etre-cosmetiques-1761754899574.png?v=1761754899574'),
('ac5e9b57-ff9b-43d6-a69d-498a136c799a', 'marche', 'Marché & Économie', '{"en": "Market & Economy"}', 'Les tendances et la croissance du marché des peptides.', '{"en": "Trends and growth in the peptide market."}', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/marche-economie/topic-marche-economie-1761754697638.png?v=1761754697638'),
('b24c81ab-d24d-4860-91f7-faabad0892f7', 'usages', 'Usages & Performances', '{"en": "Uses & Performance"}', 'Les applications sportives et les bénéfices sur la santé.', '{"en": "Sports applications and health benefits."}', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/usages-performances/topic-usages-performances-1761754829727.png?v=1761754829727'),
('f5401164-9929-413d-8a7b-6f1bfdabf9dc', 'reglementation', 'Réglementation & Conformité', '{"en": "Regulation & Compliance"}', 'Les évolutions légales et politiques du marché.', '{"en": "Legal and policy developments in the market."}', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/reglementation-conformite/topic-reglementation-conformite-1761754763294.png?v=1761754763294')
ON CONFLICT (id) DO UPDATE SET
  label_i18n = EXCLUDED.label_i18n,
  description_i18n = EXCLUDED.description_i18n;

-- ============================
-- 📰 SEED — NEWS (6 articles réalistes)
-- ============================

-- Suppression des anciennes news
DELETE FROM public.news WHERE id IN (
  '9d4a3f43-40b4-47a2-863b-9c6dd5c6af43',
  'a2bab8fc-943b-4b32-acb9-044d54828014',
  'facb0cb2-d70d-4fcb-a0b2-04466bfb9904',
  '62d44c97-953f-4dee-8752-9eb287afb017',
  '67170960-eef3-4ead-b88c-f6ebed45be0f',
  '2474f359-cf06-494a-887d-60cd534e95be',
  '47080cad-079c-450a-a8e4-544a58e57010',
  '4ff13258-7338-4de2-8ed9-7c9b8ff85368',
  'a1178be8-e547-4a28-8677-07404bcc5f67',
  '9c165271-a61d-4ff2-aba5-061289cdff3c',
  'a76da968-bc21-4122-ba61-f11e69f1af78',
  '22c306ec-1546-4a72-96c1-52bca32d29fe',
  '78f05eef-ae13-479a-944c-88928052bfab',
  'a7848dff-911e-41e8-beb2-559aaf5d7263',
  '1584153b-0144-484b-91a9-6abf00d53e35'
);

INSERT INTO public.news (id, slug, title, title_i18n, excerpt, excerpt_i18n, content, content_i18n, image, published_at, author_id, topic_id)
VALUES

-- Article 1 : BPC-157 (très recherché)
('9d4a3f43-40b4-47a2-863b-9c6dd5c6af43', 'bpc-157-etudes-scientifiques',
 'BPC-157 : ce que disent vraiment les études scientifiques',
 '{"en": "BPC-157: what the scientific studies really say"}',
 'Le BPC-157 intrigue la communauté scientifique depuis plus de 30 ans. Retour sur les travaux du Pr Sikiric et l''état actuel de la recherche.',
 '{"en": "BPC-157 has intrigued the scientific community for over 30 years. A look back at Prof. Sikiric''s work and the current state of research."}',
 'Découvert dans les années 1990 par une équipe croate dirigée par le Pr Predrag Sikiric, le BPC-157 (Body Protection Compound) est un fragment de 15 acides aminés isolé du suc gastrique humain. À ce jour, plus de 100 études sur modèles animaux ont été publiées dans des revues à comité de lecture.

Les résultats précliniques sont prometteurs. Une étude publiée dans le Journal of Orthopaedic Research (Staresinic et al., 2003) a montré une accélération significative de la cicatrisation tendineuse chez le rat. D''autres travaux suggèrent un rôle dans la protection gastrique et la cicatrisation des plaies.

Il est important de noter qu''aucun essai clinique de phase III n''a été mené chez l''humain à ce jour. Le BPC-157 reste un outil de recherche in vitro et in vivo, pas un médicament approuvé.

Pour les laboratoires de recherche, ce peptide offre un terrain d''investigation fascinant sur les mécanismes de réparation tissulaire impliquant la voie NO et l''angiogenèse.',
 '{"en": "Discovered in the 1990s by a Croatian team led by Prof. Predrag Sikiric, BPC-157 (Body Protection Compound) is a 15 amino acid fragment isolated from human gastric juice. To date, over 100 studies on animal models have been published in peer-reviewed journals.\n\nPreclinical results are promising. A study published in the Journal of Orthopaedic Research (Staresinic et al., 2003) showed significant acceleration of tendon healing in rats. Other work suggests a role in gastric protection and wound healing.\n\nIt is important to note that no Phase III clinical trials have been conducted in humans to date. BPC-157 remains an in vitro and in vivo research tool, not an approved drug.\n\nFor research laboratories, this peptide offers a fascinating field of investigation into tissue repair mechanisms involving the NO pathway and angiogenesis."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/bpc-157-recherche.png',
 '2025-01-15 10:00:00', NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),

-- Article 2 : Ozempic et GLP-1 (actualité mainstream)
('a2bab8fc-943b-4b32-acb9-044d54828014', 'glp1-ozempic-revolution-peptides',
 'D''Ozempic à Mounjaro : comment les peptides GLP-1 ont conquis la médecine',
 '{"en": "From Ozempic to Mounjaro: how GLP-1 peptides conquered medicine"}',
 'Avec plus de 20 milliards de dollars de ventes en 2024, le sémaglutide illustre le potentiel médical et commercial des peptides thérapeutiques.',
 '{"en": "With over $20 billion in sales in 2024, semaglutide illustrates the medical and commercial potential of therapeutic peptides."}',
 'Le GLP-1 (Glucagon-Like Peptide-1) est une hormone incrétine sécrétée naturellement par l''intestin. Sa découverte a ouvert la voie à l''une des révolutions thérapeutiques majeures du XXIe siècle.

Le sémaglutide, commercialisé sous les noms Ozempic et Wegovy par Novo Nordisk, a généré plus de 20 milliards de dollars de revenus en 2024. Ce peptide analogue résiste à la dégradation enzymatique et présente une demi-vie prolongée permettant une injection hebdomadaire.

Le tirzepatide (Mounjaro, Zepbound) d''Eli Lilly va encore plus loin. Ce double agoniste GIP/GLP-1 a montré des pertes de poids moyennes de 20-25% dans les essais cliniques SURMOUNT, surpassant les résultats du sémaglutide.

Ces succès cliniques valident l''approche peptidique et stimulent la recherche. Des dizaines de nouveaux analogues sont en développement, ciblant non seulement l''obésité et le diabète, mais aussi les maladies cardiovasculaires et neurodégénératives.

Pour les chercheurs, les agonistes GLP-1 démontrent qu''un peptide bien conçu peut devenir un blockbuster pharmaceutique.',
 '{"en": "GLP-1 (Glucagon-Like Peptide-1) is an incretin hormone naturally secreted by the intestine. Its discovery paved the way for one of the major therapeutic revolutions of the 21st century.\n\nSemaglutide, marketed under the names Ozempic and Wegovy by Novo Nordisk, generated over $20 billion in revenue in 2024. This analog peptide resists enzymatic degradation and has an extended half-life allowing weekly injection.\n\nEli Lilly''s tirzepatide (Mounjaro, Zepbound) goes even further. This dual GIP/GLP-1 agonist showed average weight losses of 20-25% in SURMOUNT clinical trials, surpassing semaglutide results.\n\nThese clinical successes validate the peptide approach and stimulate research. Dozens of new analogs are in development, targeting not only obesity and diabetes, but also cardiovascular and neurodegenerative diseases.\n\nFor researchers, GLP-1 agonists demonstrate that a well-designed peptide can become a pharmaceutical blockbuster."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/glp1-ozempic.png',
 '2025-02-20 14:30:00', NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),

-- Article 3 : Réglementation (important pour acheteurs)
('facb0cb2-d70d-4fcb-a0b2-04466bfb9904', 'peptides-recherche-cadre-legal-europe',
 'Peptides de recherche en Europe : comprendre le cadre légal',
 '{"en": "Research peptides in Europe: understanding the legal framework"}',
 'La vente de peptides à des fins de recherche est strictement encadrée en UE. Ce qu''il faut savoir avant de passer commande.',
 '{"en": "The sale of peptides for research purposes is strictly regulated in the EU. What you need to know before ordering."}',
 'En Union Européenne, les peptides destinés à la recherche in vitro sont légalement commercialisables sous certaines conditions strictes :

1. Ils ne doivent pas être présentés comme des médicaments
2. Ils ne sont pas destinés à la consommation humaine ou animale
3. Ils doivent être vendus exclusivement à des fins de recherche scientifique

Le règlement REACH (CE n°1907/2006) encadre les substances chimiques sur le marché européen. Les fabricants et distributeurs sérieux respectent ces obligations et peuvent fournir les documents de conformité sur demande.

Pour les acheteurs, quelques critères de qualité essentiels :
- Certificat d''analyse (CoA) fourni pour chaque lot
- Pureté vérifiée par HPLC (minimum 98%)
- Identité confirmée par spectrométrie de masse
- Conditions de stockage et transport respectées

Les peptides vendus comme "compléments alimentaires" ou avec des allégations santé sont illégaux dans la plupart des pays de l''UE s''ils ne disposent pas d''une autorisation de mise sur le marché (AMM).

Chez Fast Peptides, nous respectons scrupuleusement ce cadre réglementaire et fournissons une documentation complète pour chaque commande.',
 '{"en": "In the European Union, peptides intended for in vitro research are legally marketable under certain strict conditions:\n\n1. They must not be presented as medicines\n2. They are not intended for human or animal consumption\n3. They must be sold exclusively for scientific research purposes\n\nThe REACH regulation (EC No 1907/2006) governs chemical substances on the European market. Serious manufacturers and distributors respect these obligations and can provide compliance documents upon request.\n\nFor buyers, some essential quality criteria:\n- Certificate of analysis (CoA) provided for each batch\n- Purity verified by HPLC (minimum 98%)\n- Identity confirmed by mass spectrometry\n- Storage and transport conditions respected\n\nPeptides sold as \"dietary supplements\" or with health claims are illegal in most EU countries if they do not have a marketing authorization (MA).\n\nAt Fast Peptides, we scrupulously respect this regulatory framework and provide complete documentation for each order."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/reglementation-peptides.png',
 '2025-03-10 09:00:00', NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),

-- Article 4 : Guide pratique reconstitution
('62d44c97-953f-4dee-8752-9eb287afb017', 'guide-reconstitution-conservation-peptides',
 'Guide pratique : reconstitution et conservation des peptides',
 '{"en": "Practical guide: peptide reconstitution and storage"}',
 'La stabilité des peptides dépend de leur manipulation. Nos recommandations pour préserver l''intégrité de vos composés de recherche.',
 '{"en": "Peptide stability depends on handling. Our recommendations to preserve the integrity of your research compounds."}',
 'Les peptides lyophilisés sont stables pendant le transport à température ambiante, mais leur conservation à long terme nécessite des précautions spécifiques.

AVANT RECONSTITUTION
- Stockage optimal : -20°C (congélateur standard)
- Durée de conservation : jusqu''à 24 mois
- Éviter absolument les cycles gel/dégel répétés
- Protéger de l''humidité et de la lumière directe

RECONSTITUTION
Pour la plupart des peptides hydrosolubles :
- Utiliser de l''eau bactériostatique (0.9% alcool benzylique)
- Ajouter le solvant doucement le long de la paroi du flacon
- Laisser dissoudre naturellement - ne pas agiter vigoureusement
- Attendre 5-10 minutes que la solution soit homogène

Pour les peptides hydrophobes (contenant beaucoup de Leu, Ile, Val, Met, Phe) :
- Pré-dissoudre dans 10% d''acide acétique ou DMSO
- Diluer ensuite avec de l''eau bactériostatique

APRÈS RECONSTITUTION
- Conservation à 4°C : 2 à 4 semaines maximum
- Conservation à -20°C en aliquots : plusieurs mois
- Toujours utiliser du matériel stérile
- Noter la date de reconstitution sur le flacon

Un peptide dégradé perd progressivement son efficacité sans signe visible. En cas de doute, un nouveau lot est préférable.',
 '{"en": "Lyophilized peptides are stable during transport at room temperature, but their long-term storage requires specific precautions.\n\nBEFORE RECONSTITUTION\n- Optimal storage: -20°C (standard freezer)\n- Shelf life: up to 24 months\n- Absolutely avoid repeated freeze/thaw cycles\n- Protect from moisture and direct light\n\nRECONSTITUTION\nFor most water-soluble peptides:\n- Use bacteriostatic water (0.9% benzyl alcohol)\n- Add the solvent gently along the vial wall\n- Let dissolve naturally - do not shake vigorously\n- Wait 5-10 minutes for the solution to be homogeneous\n\nFor hydrophobic peptides (containing lots of Leu, Ile, Val, Met, Phe):\n- Pre-dissolve in 10% acetic acid or DMSO\n- Then dilute with bacteriostatic water\n\nAFTER RECONSTITUTION\n- Storage at 4°C: 2 to 4 weeks maximum\n- Storage at -20°C in aliquots: several months\n- Always use sterile equipment\n- Note the reconstitution date on the vial\n\nA degraded peptide gradually loses its effectiveness without visible signs. When in doubt, a new batch is preferable."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/guide-reconstitution.png',
 '2025-04-05 11:00:00', NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),

-- Article 5 : Marché des peptides (économie)
('67170960-eef3-4ead-b88c-f6ebed45be0f', 'marche-mondial-peptides-2025',
 'Le marché mondial des peptides dépassera 60 milliards de dollars en 2030',
 '{"en": "The global peptide market will exceed $60 billion by 2030"}',
 'Selon Grand View Research, le secteur des peptides thérapeutiques connaît une croissance annuelle de 9,8%. Les raisons de cet engouement.',
 '{"en": "According to Grand View Research, the therapeutic peptide sector is experiencing annual growth of 9.8%. The reasons for this enthusiasm."}',
 'Le marché des peptides thérapeutiques est en pleine expansion. Selon les analystes de Grand View Research, il devrait passer de 42 milliards de dollars en 2024 à plus de 60 milliards en 2030.

Plusieurs facteurs expliquent cette croissance :

AVANTAGES DES PEPTIDES
- Haute spécificité : moins d''effets secondaires que les petites molécules
- Biodégradabilité : pas d''accumulation dans l''organisme
- Synthèse modulable : personnalisation possible des séquences
- Tolérance : profil de sécurité généralement favorable

CHIFFRES CLÉS
- 80+ peptides approuvés par la FDA
- 150+ peptides en essais cliniques
- 7 des 10 médicaments les plus vendus en 2024 sont des biologiques

DOMAINES PORTEURS
- Métabolisme : GLP-1 agonistes (Ozempic, Mounjaro)
- Oncologie : peptides ciblant les récepteurs tumoraux
- Maladies rares : thérapies peptidiques orphelines
- Cosmétique : peptides anti-âge et réparation cutanée

Les grands laboratoires (Novo Nordisk, Eli Lilly, Amgen, Ipsen) investissent massivement dans la R&D peptidique. L''innovation se concentre notamment sur l''amélioration de la biodisponibilité orale, longtemps considérée comme le Saint Graal du secteur.',
 '{"en": "The therapeutic peptide market is booming. According to Grand View Research analysts, it is expected to grow from $42 billion in 2024 to over $60 billion by 2030.\n\nSeveral factors explain this growth:\n\nADVANTAGES OF PEPTIDES\n- High specificity: fewer side effects than small molecules\n- Biodegradability: no accumulation in the body\n- Modular synthesis: sequence customization possible\n- Tolerance: generally favorable safety profile\n\nKEY FIGURES\n- 80+ peptides approved by the FDA\n- 150+ peptides in clinical trials\n- 7 of the 10 best-selling drugs in 2024 are biologics\n\nGROWING AREAS\n- Metabolism: GLP-1 agonists (Ozempic, Mounjaro)\n- Oncology: peptides targeting tumor receptors\n- Rare diseases: orphan peptide therapies\n- Cosmetics: anti-aging peptides and skin repair\n\nMajor laboratories (Novo Nordisk, Eli Lilly, Amgen, Ipsen) are investing heavily in peptide R&D. Innovation is particularly focused on improving oral bioavailability, long considered the Holy Grail of the sector."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/marche-peptides-2025.png',
 '2025-05-12 16:00:00', NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),

-- Article 6 : Certificat d''analyse (qualité)
('2474f359-cf06-494a-887d-60cd534e95be', 'lire-certificat-analyse-peptide',
 'Décrypter un certificat d''analyse : les indicateurs de qualité',
 '{"en": "Decoding a certificate of analysis: quality indicators"}',
 'Pureté HPLC, masse moléculaire, teneur en peptide... Comment interpréter les données d''un CoA pour évaluer la qualité de vos peptides.',
 '{"en": "HPLC purity, molecular weight, peptide content... How to interpret CoA data to evaluate the quality of your peptides."}',
 'Le certificat d''analyse (CoA) est le document de référence pour évaluer la qualité d''un peptide. Voici comment le lire :

PURETÉ HPLC
La chromatographie liquide haute performance sépare les composants d''un échantillon. Le pourcentage indique la proportion du peptide cible par rapport aux impuretés.
- Excellent : >98%
- Acceptable : 95-98%
- À éviter : <95%

Les impuretés sont généralement des peptides tronqués (synthèse incomplète) ou des produits de dégradation.

SPECTROMÉTRIE DE MASSE (MS)
La masse moléculaire observée doit correspondre à la masse théorique calculée à partir de la séquence.
- Écart acceptable : ±0.1%
- Un écart plus important peut indiquer une modification chimique ou une erreur de synthèse

APPARENCE
La description de l''apparence (poudre blanche, lyophilisat) permet de vérifier la cohérence avec le produit reçu.

TENEUR EN PEPTIDE NET
Attention : un flacon étiqueté "5mg" contient rarement 5mg de peptide pur. La teneur nette est généralement de 70-85%, le reste étant des sels (TFA, acétate) et de l''eau résiduelle.

Le CoA doit préciser ce ratio pour permettre un calcul de dosage précis. Les fournisseurs sérieux indiquent toujours cette information.

Méfiez-vous des CoA génériques ou sans numéro de lot spécifique : ils peuvent ne pas correspondre au produit réellement livré.',
 '{"en": "The certificate of analysis (CoA) is the reference document for evaluating peptide quality. Here is how to read it:\n\nHPLC PURITY\nHigh-performance liquid chromatography separates the components of a sample. The percentage indicates the proportion of the target peptide relative to impurities.\n- Excellent: >98%\n- Acceptable: 95-98%\n- To avoid: <95%\n\nImpurities are usually truncated peptides (incomplete synthesis) or degradation products.\n\nMASS SPECTROMETRY (MS)\nThe observed molecular mass must match the theoretical mass calculated from the sequence.\n- Acceptable deviation: ±0.1%\n- A larger deviation may indicate chemical modification or synthesis error\n\nAPPEARANCE\nThe description of appearance (white powder, lyophilisate) verifies consistency with the product received.\n\nNET PEPTIDE CONTENT\nNote: a vial labeled \"5mg\" rarely contains 5mg of pure peptide. Net content is typically 70-85%, the rest being salts (TFA, acetate) and residual water.\n\nThe CoA must specify this ratio to allow accurate dosage calculation. Serious suppliers always indicate this information.\n\nBeware of generic CoAs or those without a specific batch number: they may not correspond to the product actually delivered."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/certificat-analyse.png',
 '2025-06-01 08:30:00', NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9')

ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  title_i18n = EXCLUDED.title_i18n,
  excerpt = EXCLUDED.excerpt,
  excerpt_i18n = EXCLUDED.excerpt_i18n,
  content = EXCLUDED.content,
  content_i18n = EXCLUDED.content_i18n,
  image = EXCLUDED.image,
  published_at = EXCLUDED.published_at;

-- ============================
-- 📰 SEED — NEWS COMPLÉMENTAIRES (9 articles)
-- ============================

INSERT INTO public.news (id, slug, title, title_i18n, excerpt, excerpt_i18n, content, content_i18n, image, published_at, author_id, topic_id)
VALUES

-- Article 7 : TB-500 et BPC-157 synergie (Usages & Performances)
('47080cad-079c-450a-a8e4-544a58e57010', 'tb500-bpc157-synergie-recuperation',
 'TB-500 et BPC-157 : pourquoi les chercheurs étudient leur synergie',
 '{"en": "TB-500 and BPC-157: why researchers are studying their synergy"}',
 'Ces deux peptides activent des voies biologiques complémentaires. Une revue systématique 2025 fait le point sur les études précliniques.',
 '{"en": "These two peptides activate complementary biological pathways. A 2025 systematic review summarizes preclinical studies."}',
 'Le TB-500 (fragment de la Thymosine Beta-4) et le BPC-157 (Body Protection Compound) sont deux peptides qui suscitent un intérêt croissant dans la recherche sur la réparation tissulaire.

MÉCANISMES D''ACTION COMPLÉMENTAIRES

Le BPC-157, isolé du suc gastrique humain, favoriserait :
- L''activité des fibroblastes
- La synthèse de collagène
- L''angiogenèse via la voie VEGFR2-Akt-eNOS

Le TB-500, peptide synthétique dérivé de la thymosine β4, agirait sur :
- La différenciation des cellules progénitrices
- La croissance vasculaire
- La migration cellulaire

CE QUE DIT LA RECHERCHE

Une revue systématique publiée en 2025 dans PMC a analysé 36 études (1993-2024) sur le BPC-157. Les modèles animaux montrent une amélioration de la cicatrisation des muscles, tendons, ligaments et os.

Une étude humaine préliminaire rapporte que 7 patients sur 12 souffrant de douleurs chroniques au genou ont ressenti un soulagement pendant plus de 6 mois après une injection de BPC-157.

LIMITES IMPORTANTES

Ces peptides ne sont pas approuvés par la FDA pour usage thérapeutique. En 2023, le BPC-157 a été classé "Category 2", signifiant qu''il ne peut être préparé par les pharmacies de préparation commerciales.

Les études humaines de grande envergure font encore défaut. Ces composés restent des outils de recherche, non des traitements validés.',
 '{"en": "TB-500 (a fragment of Thymosin Beta-4) and BPC-157 (Body Protection Compound) are two peptides that are generating growing interest in tissue repair research.\n\nCOMPLEMENTARY MECHANISMS OF ACTION\n\nBPC-157, isolated from human gastric juice, is thought to promote:\n- Fibroblast activity\n- Collagen synthesis\n- Angiogenesis via the VEGFR2-Akt-eNOS pathway\n\nTB-500, a synthetic peptide derived from thymosin β4, is thought to act on:\n- Progenitor cell differentiation\n- Vascular growth\n- Cell migration\n\nWHAT THE RESEARCH SAYS\n\nA systematic review published in 2025 in PMC analyzed 36 studies (1993-2024) on BPC-157. Animal models show improved healing of muscles, tendons, ligaments and bones.\n\nA preliminary human study reports that 7 out of 12 patients with chronic knee pain experienced relief for more than 6 months after a BPC-157 injection.\n\nIMPORTANT LIMITATIONS\n\nThese peptides are not FDA-approved for therapeutic use. In 2023, BPC-157 was classified as \"Category 2,\" meaning it cannot be prepared by commercial compounding pharmacies.\n\nLarge-scale human studies are still lacking. These compounds remain research tools, not validated treatments."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/tb500-bpc157-synergie.png',
 '2025-01-28 09:00:00', NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),

-- Article 8 : Collagène et récupération sportive (Usages & Performances)
('4ff13258-7338-4de2-8ed9-7c9b8ff85368', 'collagene-peptides-recuperation-sportive-2024',
 'Peptides de collagène : l''étude 2024 sur la récupération sportive',
 '{"en": "Collagen peptides: the 2024 study on sports recovery"}',
 'Une étude randomisée contrôlée montre que 15g de peptides de collagène par jour réduisent les marqueurs de stress musculaire après l''effort.',
 '{"en": "A randomized controlled study shows that 15g of collagen peptides per day reduce muscle stress markers after exercise."}',
 'Une étude publiée dans Frontiers in Nutrition en 2024 (Bischof et al.) apporte de nouvelles données sur l''intérêt des peptides de collagène dans la récupération sportive.

PROTOCOLE DE L''ÉTUDE

Les chercheurs ont suivi des athlètes pendant 12 semaines :
- Groupe supplémenté : 15g de peptides de collagène/jour
- Groupe placebo : substance inactive
- Mesure des marqueurs de stress musculaire après exercice intense

RÉSULTATS PRINCIPAUX

Le groupe supplémenté présentait des niveaux plus bas de marqueurs de stress systémique après les dommages musculaires induits par l''exercice.

Une étude antérieure sur l''hydrolysat de whey avait montré :
- Niveaux de créatine kinase (CK) plus bas à 48h
- Meilleur indice de force réactive
- Flexibilité accrue

POIDS MOLÉCULAIRE : UN FACTEUR CLÉ

Les peptides de collagène de faible poids moléculaire présentent de meilleures propriétés pharmacocinétiques. Les peptides plus petits sont absorbés plus efficacement, ce qui renforce l''importance du poids moléculaire dans la biodisponibilité.

APPLICATIONS PRATIQUES

Ces résultats suggèrent un intérêt potentiel pour :
- Les athlètes en phase de récupération intensive
- Les protocoles de rééducation
- La prévention des blessures récurrentes

La recherche continue pour déterminer les dosages optimaux et les populations qui bénéficieraient le plus de cette supplémentation.',
 '{"en": "A study published in Frontiers in Nutrition in 2024 (Bischof et al.) provides new data on the value of collagen peptides in sports recovery.\n\nSTUDY PROTOCOL\n\nResearchers followed athletes for 12 weeks:\n- Supplemented group: 15g of collagen peptides/day\n- Placebo group: inactive substance\n- Measurement of muscle stress markers after intense exercise\n\nMAIN RESULTS\n\nThe supplemented group had lower levels of systemic stress markers after exercise-induced muscle damage.\n\nA previous study on whey hydrolysate had shown:\n- Lower creatine kinase (CK) levels at 48h\n- Better reactive strength index\n- Increased flexibility\n\nMOLECULAR WEIGHT: A KEY FACTOR\n\nLow molecular weight collagen peptides have better pharmacokinetic properties. Smaller peptides are absorbed more efficiently, reinforcing the importance of molecular weight in bioavailability.\n\nPRACTICAL APPLICATIONS\n\nThese results suggest potential value for:\n- Athletes in intensive recovery phases\n- Rehabilitation protocols\n- Prevention of recurring injuries\n\nResearch continues to determine optimal dosages and populations that would benefit most from this supplementation."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/collagene-recuperation-sport.png',
 '2025-02-05 11:30:00', NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),

-- Article 9 : Revue systématique 2025 (Usages & Performances)
('a1178be8-e547-4a28-8677-07404bcc5f67', 'peptides-medecine-sport-revue-2025',
 'Peptides thérapeutiques en médecine du sport : la revue systématique 2025',
 '{"en": "Therapeutic peptides in sports medicine: the 2025 systematic review"}',
 '36 études analysées de 1993 à 2024. Les chercheurs font le point sur ce que la science sait vraiment des peptides injectables.',
 '{"en": "36 studies analyzed from 1993 to 2024. Researchers take stock of what science really knows about injectable peptides."}',
 'Une revue systématique publiée dans Arthroscopy Journal en 2025 analyse l''état des connaissances sur les peptides thérapeutiques injectables en médecine du sport.

CONTEXTE

Les athlètes de haut niveau et les bodybuilders recherchent constamment de nouvelles thérapies pour améliorer la récupération. Les peptides injectables représentent une tendance émergente dans la recherche en médecine régénérative.

MÉTHODOLOGIE

Les chercheurs ont analysé 36 études publiées entre 1993 et 2024, couvrant principalement :
- Le BPC-157
- Le TB-500
- D''autres peptides régénératifs

CONCLUSIONS PRINCIPALES

Les études précliniques (animaux) montrent que le BPC-157 :
- Favorise la cicatrisation en stimulant les facteurs de croissance
- Réduit l''inflammation
- Améliore les résultats dans les modèles de blessures musculaires, tendineuses, ligamentaires et osseuses

LIMITES MAJEURES

1. Absence d''essais cliniques de grande envergure chez l''humain
2. Profil de sécurité à long terme inconnu
3. Aucun événement indésirable aigu (<6 semaines) rapporté dans les modèles animaux

RECOMMANDATIONS DES AUTEURS

"En raison des preuves cliniques de haute qualité limitées, les cliniciens et les athlètes doivent faire preuve de prudence lorsqu''ils envisagent l''utilisation du BPC-157."

L''industrie des peptides représente plusieurs milliards de dollars, mais la littérature orthopédique clinique reste rare sur ces composés.',
 '{"en": "A systematic review published in Arthroscopy Journal in 2025 analyzes the state of knowledge on injectable therapeutic peptides in sports medicine.\n\nBACKGROUND\n\nHigh-level athletes and bodybuilders are constantly seeking new therapies to improve recovery. Injectable peptides represent an emerging trend in regenerative medicine research.\n\nMETHODOLOGY\n\nResearchers analyzed 36 studies published between 1993 and 2024, mainly covering:\n- BPC-157\n- TB-500\n- Other regenerative peptides\n\nMAIN CONCLUSIONS\n\nPreclinical studies (animals) show that BPC-157:\n- Promotes healing by stimulating growth factors\n- Reduces inflammation\n- Improves outcomes in muscle, tendon, ligament and bone injury models\n\nMAJOR LIMITATIONS\n\n1. Lack of large-scale human clinical trials\n2. Unknown long-term safety profile\n3. No acute adverse events (<6 weeks) reported in animal models\n\nAUTHORS'' RECOMMENDATIONS\n\n\"Due to limited high-quality clinical evidence, clinicians and athletes should exercise caution when considering BPC-157 use.\"\n\nThe peptide industry represents billions of dollars, but clinical orthopedic literature on these compounds remains scarce."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-medecine-sport.png',
 '2025-02-18 14:00:00', NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),

-- Article 10 : GHK-Cu anti-âge (Bien-être & Cosmétiques)
('9c165271-a61d-4ff2-aba5-061289cdff3c', 'ghk-cu-peptide-cuivre-anti-age',
 'GHK-Cu : le peptide de cuivre star des sérums anti-âge',
 '{"en": "GHK-Cu: the copper peptide star of anti-aging serums"}',
 'Stimulation du collagène, cicatrisation, antioxydant : pourquoi ce peptide est devenu incontournable dans les formulations cosmétiques premium.',
 '{"en": "Collagen stimulation, healing, antioxidant: why this peptide has become essential in premium cosmetic formulations."}',
 'Le GHK-Cu (glycyl-L-histidyl-L-lysine-cuivre) est l''un des peptides les plus étudiés et les plus utilisés en cosmétique anti-âge.

QU''EST-CE QUE LE GHK-Cu ?

Découvert dans les années 1970, ce tripeptide naturellement présent dans le plasma humain possède une forte affinité pour le cuivre. Sa concentration diminue avec l''âge : de 200 ng/mL à 20 ans à 80 ng/mL à 60 ans.

MÉCANISMES D''ACTION DOCUMENTÉS

Les études montrent que le GHK-Cu :
- Stimule la production de collagène et d''élastine
- Favorise la cicatrisation et le renouvellement cutané
- Offre une protection antioxydante
- Améliore la fermeté et la clarté de la peau
- Réduit les ridules et les dommages photo-induits

TENDANCES 2024

Selon une revue publiée dans PMC en 2025, les peptides ont pris une place centrale dans les formulations skincare. Le GHK-Cu se retrouve désormais dans :
- Les sérums anti-âge premium
- Les crèmes réparatrices post-acte
- Les soins contour des yeux

CONSEILS D''UTILISATION

Les peptides ne sont pas compatibles avec tous les ingrédients. Les acides (AHA, BHA) peuvent briser les liaisons peptidiques. Recommandation : utiliser les acides le matin, les peptides le soir, ou attendre 30 minutes entre les applications.

Les technologies avancées comme la nanotechnologie améliorent désormais la stabilité et l''efficacité des formulations peptidiques.',
 '{"en": "GHK-Cu (glycyl-L-histidyl-L-lysine-copper) is one of the most studied and widely used peptides in anti-aging cosmetics.\n\nWHAT IS GHK-Cu?\n\nDiscovered in the 1970s, this tripeptide naturally present in human plasma has a strong affinity for copper. Its concentration decreases with age: from 200 ng/mL at age 20 to 80 ng/mL at age 60.\n\nDOCUMENTED MECHANISMS OF ACTION\n\nStudies show that GHK-Cu:\n- Stimulates collagen and elastin production\n- Promotes healing and skin renewal\n- Offers antioxidant protection\n- Improves skin firmness and clarity\n- Reduces fine lines and photo-induced damage\n\n2024 TRENDS\n\nAccording to a review published in PMC in 2025, peptides have taken center stage in skincare formulations. GHK-Cu is now found in:\n- Premium anti-aging serums\n- Post-procedure repair creams\n- Eye contour treatments\n\nUSAGE TIPS\n\nPeptides are not compatible with all ingredients. Acids (AHA, BHA) can break peptide bonds. Recommendation: use acids in the morning, peptides in the evening, or wait 30 minutes between applications.\n\nAdvanced technologies like nanotechnology are now improving the stability and efficacy of peptide formulations."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/ghk-cu-peptide-cuivre.png',
 '2025-03-05 10:00:00', NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91'),

-- Article 11 : Collagène oral (Bien-être & Cosmétiques)
('a76da968-bc21-4122-ba61-f11e69f1af78', 'collagene-oral-efficacite-rides-etude',
 'Collagène oral : efficacité prouvée sur les rides en 6 semaines',
 '{"en": "Oral collagen: proven effectiveness on wrinkles in 6 weeks"}',
 'Un essai clinique randomisé en double aveugle confirme l''amélioration de l''hydratation cutanée et la réduction des rides avec les peptides de collagène.',
 '{"en": "A randomized double-blind clinical trial confirms improved skin hydration and wrinkle reduction with collagen peptides."}',
 'Une étude publiée dans MDPI Cosmetics en 2024 apporte des preuves cliniques solides sur l''efficacité des peptides de collagène par voie orale.

DESIGN DE L''ÉTUDE

- Type : essai randomisé, double aveugle, contrôlé par placebo
- Durée : 6 semaines
- Substance testée : peptides de collagène de faible poids moléculaire
- Paramètres mesurés : rides faciales, hydratation cutanée

RÉSULTATS

Les participants du groupe collagène ont montré :
- Une réduction significative des rides faciales
- Une amélioration mesurable de l''hydratation de la peau
- Des effets visibles dès 6 semaines de supplémentation

POURQUOI LE POIDS MOLÉCULAIRE COMPTE

Les peptides de collagène de faible poids moléculaire (<3000 Da) sont mieux absorbés par l''intestin et atteignent plus efficacement les couches profondes de la peau.

CONTEXTE DU MARCHÉ

Les suppléments de collagène représentent un marché en pleine expansion. On les trouve sous forme de :
- Poudres à diluer
- Boissons "beauty drinks"
- Gélules et comprimés

Avec l''âge, les niveaux de collagène chutent drastiquement : à 70 ans, ils ne représentent plus que 40% des niveaux initiaux. Cette baisse explique l''intérêt croissant pour la supplémentation.

LIMITES À NOTER

Tous les produits ne se valent pas. La qualité, la source (marin, bovin, porcin) et le poids moléculaire influencent directement l''efficacité.',
 '{"en": "A study published in MDPI Cosmetics in 2024 provides solid clinical evidence on the effectiveness of oral collagen peptides.\n\nSTUDY DESIGN\n\n- Type: randomized, double-blind, placebo-controlled trial\n- Duration: 6 weeks\n- Substance tested: low molecular weight collagen peptides\n- Parameters measured: facial wrinkles, skin hydration\n\nRESULTS\n\nParticipants in the collagen group showed:\n- Significant reduction in facial wrinkles\n- Measurable improvement in skin hydration\n- Visible effects from 6 weeks of supplementation\n\nWHY MOLECULAR WEIGHT MATTERS\n\nLow molecular weight collagen peptides (<3000 Da) are better absorbed by the intestine and more effectively reach the deep layers of the skin.\n\nMARKET CONTEXT\n\nCollagen supplements represent a rapidly expanding market. They are available as:\n- Powder to dilute\n- Beauty drinks\n- Capsules and tablets\n\nWith age, collagen levels drop drastically: at 70, they represent only 40% of initial levels. This decline explains the growing interest in supplementation.\n\nLIMITATIONS TO NOTE\n\nNot all products are equal. Quality, source (marine, bovine, porcine) and molecular weight directly influence effectiveness."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/collagene-oral-rides.png',
 '2025-03-20 09:30:00', NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91'),

-- Article 12 : FDA Category 2 (Réglementation)
('22c306ec-1546-4a72-96c1-52bca32d29fe', 'fda-bpc157-category-2-reglementation',
 'FDA et BPC-157 : comprendre la classification "Category 2"',
 '{"en": "FDA and BPC-157: understanding the \"Category 2\" classification"}',
 'En 2023, la FDA a classé le BPC-157 en catégorie 2. Ce que cette décision signifie pour les chercheurs, les fournisseurs et les utilisateurs.',
 '{"en": "In 2023, the FDA classified BPC-157 as Category 2. What this decision means for researchers, suppliers, and users."}',
 'En 2023, la Food and Drug Administration (FDA) américaine a pris une décision importante concernant le BPC-157 en le classant comme "Category 2 bulk drug substance".

QUE SIGNIFIE "CATEGORY 2" ?

Cette classification indique que :
1. Le BPC-157 ne peut PAS être préparé par les pharmacies de préparation commerciales (compounding pharmacies)
2. Il n''existe pas suffisamment de preuves pour déterminer s''il pourrait causer des dommages chez l''humain
3. Le peptide n''est pas approuvé comme médicament

CE QUI RESTE LÉGAL

Malgré cette classification, de nombreux produits BPC-157 sont légalement vendus comme :
- "Produits chimiques de recherche" (research chemicals)
- "Compléments alimentaires" (dietary supplements)

Ces catégories ne sont pas soumises aux mêmes réglementations que les médicaments.

SITUATION AU ROYAUME-UNI

Au Royaume-Uni, la MHRA (Medicines and Healthcare products Regulatory Agency) maintient une position stricte : ces peptides ne sont autorisés qu''à des fins de recherche, dans le cadre d''études approuvées.

IMPLICATIONS PRATIQUES

Pour les chercheurs : le BPC-157 reste accessible pour la recherche in vitro et préclinique.

Pour les fournisseurs : la vente est possible sous réserve d''un étiquetage clair "à des fins de recherche uniquement".

Pour les consommateurs : la prudence est de mise. L''absence d''approbation signifie l''absence de garanties sur la sécurité et l''efficacité.',
 '{"en": "In 2023, the U.S. Food and Drug Administration (FDA) made an important decision regarding BPC-157 by classifying it as a \"Category 2 bulk drug substance.\"\n\nWHAT DOES \"CATEGORY 2\" MEAN?\n\nThis classification indicates that:\n1. BPC-157 CANNOT be prepared by commercial compounding pharmacies\n2. There is insufficient evidence to determine whether it could cause harm in humans\n3. The peptide is not approved as a drug\n\nWHAT REMAINS LEGAL\n\nDespite this classification, many BPC-157 products are legally sold as:\n- \"Research chemicals\"\n- \"Dietary supplements\"\n\nThese categories are not subject to the same regulations as drugs.\n\nSITUATION IN THE UK\n\nIn the UK, the MHRA (Medicines and Healthcare products Regulatory Agency) maintains a strict position: these peptides are only authorized for research purposes, within approved studies.\n\nPRACTICAL IMPLICATIONS\n\nFor researchers: BPC-157 remains accessible for in vitro and preclinical research.\n\nFor suppliers: sale is possible subject to clear labeling \"for research purposes only.\"\n\nFor consumers: caution is advised. Lack of approval means lack of guarantees on safety and efficacy."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/fda-bpc157-category2.png',
 '2025-04-01 08:00:00', NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),

-- Article 13 : Règles AMA antidopage (Réglementation)
('78f05eef-ae13-479a-944c-88928052bfab', 'peptides-sport-regles-ama-antidopage',
 'Peptides et sport professionnel : les règles antidopage de l''AMA',
 '{"en": "Peptides and professional sports: WADA anti-doping rules"}',
 'Certains peptides sont interdits en compétition par l''Agence Mondiale Antidopage. Le point sur la réglementation 2024 et les substances concernées.',
 '{"en": "Certain peptides are banned in competition by the World Anti-Doping Agency. An overview of 2024 regulations and substances involved."}',
 'L''Agence Mondiale Antidopage (AMA/WADA) maintient une liste stricte des substances interdites en compétition sportive. Plusieurs peptides y figurent.

PEPTIDES INTERDITS PAR L''AMA

La liste des substances interdites inclut notamment :
- Les hormones de croissance et leurs facteurs de libération
- Les peptides mimétiques de l''EPO
- Certains facteurs de croissance (IGF-1, MGF, etc.)
- Les modulateurs métaboliques

STATUT DU BPC-157

Le BPC-157 n''est pas explicitement nommé sur la liste de l''AMA. Cependant, son utilisation pose des questions :
- Il pourrait être considéré comme "méthode interdite" s''il améliore la récupération
- Son statut reste ambigu selon les fédérations

RISQUES POUR LES ATHLÈTES

1. Détection : les méthodes de détection évoluent constamment
2. Contamination : les produits non réglementés peuvent contenir des substances interdites
3. Sanctions : les violations peuvent entraîner des suspensions de 2 à 4 ans

RECOMMANDATIONS

Pour les athlètes professionnels :
- Vérifier systématiquement le statut de toute substance sur le site de l''AMA
- Consulter les autorités antidopage nationales
- Privilégier les produits certifiés et testés
- En cas de doute, s''abstenir

Les sportifs amateurs ne sont généralement pas soumis aux mêmes contrôles, mais les compétitions officielles peuvent imposer des tests.',
 '{"en": "The World Anti-Doping Agency (WADA) maintains a strict list of substances prohibited in sports competition. Several peptides are included.\n\nPEPTIDES BANNED BY WADA\n\nThe list of prohibited substances notably includes:\n- Growth hormones and their releasing factors\n- EPO mimetic peptides\n- Certain growth factors (IGF-1, MGF, etc.)\n- Metabolic modulators\n\nBPC-157 STATUS\n\nBPC-157 is not explicitly named on the WADA list. However, its use raises questions:\n- It could be considered a \"prohibited method\" if it enhances recovery\n- Its status remains ambiguous depending on federations\n\nRISKS FOR ATHLETES\n\n1. Detection: detection methods are constantly evolving\n2. Contamination: unregulated products may contain prohibited substances\n3. Sanctions: violations can result in 2 to 4 year suspensions\n\nRECOMMENDATIONS\n\nFor professional athletes:\n- Systematically check the status of any substance on the WADA website\n- Consult national anti-doping authorities\n- Favor certified and tested products\n- When in doubt, abstain\n\nAmateur athletes are generally not subject to the same controls, but official competitions may impose tests."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-sport-ama.png',
 '2025-04-15 15:00:00', NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),

-- Article 14 : GLP-1 et cerveau (Recherche & Innovation)
('a7848dff-911e-41e8-beb2-559aaf5d7263', 'glp1-cerveau-decouverte-2024-ut-southwestern',
 'Découverte 2024 : comment le GLP-1 agit dans le cerveau',
 '{"en": "2024 Discovery: how GLP-1 acts in the brain"}',
 'Des chercheurs de UT Southwestern ont identifié les neurones ciblés par le sémaglutide. Une avancée majeure pour comprendre ces médicaments.',
 '{"en": "UT Southwestern researchers have identified the neurons targeted by semaglutide. A major advance in understanding these drugs."}',
 'Une équipe de chercheurs du UT Southwestern Medical Center a publié en août 2024 dans la revue Science une découverte majeure sur le mécanisme d''action des médicaments GLP-1.

LA DÉCOUVERTE

Les scientifiques ont identifié un sous-ensemble spécifique de cellules cérébrales dont l''activation serait partiellement responsable des effets des médicaments de perte de poids comme le sémaglutide (Ozempic, Wegovy).

POURQUOI C''EST IMPORTANT

Jusqu''à présent, le mécanisme précis par lequel les agonistes GLP-1 induisent la perte de poids n''était pas entièrement compris. On savait qu''ils :
- Ralentissent la vidange gastrique
- Réduisent l''appétit
- Agissent sur le pancréas

Cette découverte révèle un mécanisme central (cérébral) qui explique l''efficacité remarquable de ces traitements.

IMPLICATIONS POUR LA RECHERCHE

Ces résultats pourraient permettre :
- D''optimiser l''efficacité des médicaments existants
- De développer des molécules plus ciblées
- De réduire potentiellement les effets secondaires
- De mieux comprendre les mécanismes de la satiété

CONTEXTE

Les médicaments GLP-1 représentent une révolution thérapeutique. Le sémaglutide a généré plus de 20 milliards de dollars de ventes en 2024. Comprendre précisément leur fonctionnement est crucial pour améliorer les traitements futurs.

Cette recherche illustre l''importance de la science fondamentale dans le développement de thérapies peptidiques.',
 '{"en": "A team of researchers from UT Southwestern Medical Center published a major discovery in August 2024 in the journal Science on the mechanism of action of GLP-1 drugs.\n\nTHE DISCOVERY\n\nScientists identified a specific subset of brain cells whose activation would be partially responsible for the effects of weight loss drugs like semaglutide (Ozempic, Wegovy).\n\nWHY IT MATTERS\n\nUntil now, the precise mechanism by which GLP-1 agonists induce weight loss was not fully understood. It was known that they:\n- Slow gastric emptying\n- Reduce appetite\n- Act on the pancreas\n\nThis discovery reveals a central (brain) mechanism that explains the remarkable effectiveness of these treatments.\n\nIMPLICATIONS FOR RESEARCH\n\nThese results could allow:\n- Optimization of existing drug efficacy\n- Development of more targeted molecules\n- Potential reduction of side effects\n- Better understanding of satiety mechanisms\n\nCONTEXT\n\nGLP-1 drugs represent a therapeutic revolution. Semaglutide generated over $20 billion in sales in 2024. Understanding precisely how they work is crucial for improving future treatments.\n\nThis research illustrates the importance of fundamental science in the development of peptide therapies."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/glp1-cerveau-decouverte.png',
 '2025-04-28 12:00:00', NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),

-- Article 15 : Retatrutide (Marché & Économie)
('1584153b-0144-484b-91a9-6abf00d53e35', 'retatrutide-triple-agoniste-eli-lilly-2025',
 'Retatrutide : le triple agoniste qui surpasse Ozempic et Mounjaro',
 '{"en": "Retatrutide: the triple agonist that outperforms Ozempic and Mounjaro"}',
 'Eli Lilly annonce des résultats précoces pour 2025. Ce nouveau peptide a montré jusqu''à 24% de perte de poids en phase 2, dépassant tous les traitements existants.',
 '{"en": "Eli Lilly announces early results for 2025. This new peptide showed up to 24% weight loss in phase 2, surpassing all existing treatments."}',
 'Eli Lilly développe un nouveau peptide qui pourrait redéfinir le traitement de l''obésité : le retatrutide (LY3437943).

UN TRIPLE AGONISTE INÉDIT

Contrairement au sémaglutide (GLP-1 seul) et au tirzepatide (GLP-1 + GIP), le retatrutide cible TROIS récepteurs :
- GLP-1 (comme Ozempic)
- GIP (comme Mounjaro)
- Glucagon

Cette triple action lui confère une efficacité supérieure dans les essais cliniques.

RÉSULTATS DE PHASE 2 (NEJM)

Publiés dans le New England Journal of Medicine :
- Perte de poids moyenne à 48 semaines : -24,2% (58 livres / 26 kg)
- Groupe placebo : -2,1%
- Certains participants : jusqu''à -31% en 8 mois

À titre de comparaison, le tirzepatide (Mounjaro) atteint -22,5% dans les études de phase 3.

CALENDRIER ACCÉLÉRÉ

En février 2025, Eli Lilly a annoncé que les données de phase 3 seraient publiées plus tôt que prévu :
- Initialement attendues : février 2026
- Nouvelle projection : courant 2025

L''étude de 68 semaines concerne des patients obèses souffrant d''arthrose du genou.

EFFETS SECONDAIRES À SURVEILLER

Les effets indésirables rapportés incluent :
- Nausées (fréquentes pendant la titration)
- Troubles gastro-intestinaux
- Cas de calculs rénaux signalés

L''approbation FDA est attendue dans plusieurs années, le temps de compléter les essais de phase 3.

Ce peptide illustre l''innovation continue dans le domaine des agonistes incrétines.',
 '{"en": "Eli Lilly is developing a new peptide that could redefine obesity treatment: retatrutide (LY3437943).\n\nAN UNPRECEDENTED TRIPLE AGONIST\n\nUnlike semaglutide (GLP-1 alone) and tirzepatide (GLP-1 + GIP), retatrutide targets THREE receptors:\n- GLP-1 (like Ozempic)\n- GIP (like Mounjaro)\n- Glucagon\n\nThis triple action gives it superior efficacy in clinical trials.\n\nPHASE 2 RESULTS (NEJM)\n\nPublished in the New England Journal of Medicine:\n- Average weight loss at 48 weeks: -24.2% (58 lbs / 26 kg)\n- Placebo group: -2.1%\n- Some participants: up to -31% in 8 months\n\nFor comparison, tirzepatide (Mounjaro) achieves -22.5% in phase 3 studies.\n\nACCELERATED TIMELINE\n\nIn February 2025, Eli Lilly announced that phase 3 data would be released earlier than expected:\n- Originally expected: February 2026\n- New projection: during 2025\n\nThe 68-week study involves obese patients with knee osteoarthritis.\n\nSIDE EFFECTS TO WATCH\n\nReported adverse effects include:\n- Nausea (common during titration)\n- Gastrointestinal disorders\n- Kidney stone cases reported\n\nFDA approval is expected in several years, pending completion of phase 3 trials.\n\nThis peptide illustrates ongoing innovation in the field of incretin agonists."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/retatrutide-eli-lilly.png',
 '2025-05-25 10:30:00', NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a')

ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  title_i18n = EXCLUDED.title_i18n,
  excerpt = EXCLUDED.excerpt,
  excerpt_i18n = EXCLUDED.excerpt_i18n,
  content = EXCLUDED.content,
  content_i18n = EXCLUDED.content_i18n,
  image = EXCLUDED.image,
  published_at = EXCLUDED.published_at;

-- ============================
-- 🎫 SEED — PROMO CODES (V5.3)
-- ============================

-- Configuration des codes automatiques (si pas déjà insérée par le backup)
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
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  is_enabled = EXCLUDED.is_enabled;

-- Codes promo de test
INSERT INTO public.promo_codes (id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount, max_uses, max_uses_per_user, valid_from, valid_until, active)
VALUES
  -- Code newsletter -10% (WELCOME10)
  ('00000000-0000-0000-0000-000000000010', 'WELCOME10', 'Code newsletter -10% première commande', 'percentage', 10, 0, NULL, NULL, 1, now(), NULL, true),
  -- Code pourcentage sans limite
  ('11111111-1111-1111-1111-111111111111', 'TEST10', 'Code de test -10%', 'percentage', 10, 0, NULL, NULL, NULL, now(), NULL, true),
  -- Code pourcentage avec plafond
  ('22222222-2222-2222-2222-222222222222', 'SUMMER20', 'Promo été -20% (max 50€)', 'percentage', 20, 50, 50, 100, 1, now(), '2025-09-30', true),
  -- Code montant fixe
  ('33333333-3333-3333-3333-333333333333', 'FLAT5', 'Remise fixe 5€', 'fixed', 5, 20, NULL, NULL, 2, now(), NULL, true),
  -- Code expiré (pour tester la validation)
  ('44444444-4444-4444-4444-444444444444', 'EXPIRE', 'Code expiré pour test', 'percentage', 15, 0, NULL, NULL, NULL, '2024-01-01', '2024-12-31', true),
  -- Code désactivé
  ('55555555-5555-5555-5555-555555555555', 'INACTIVE', 'Code désactivé', 'percentage', 50, 0, NULL, NULL, NULL, now(), NULL, false)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  description = EXCLUDED.description,
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  min_order_amount = EXCLUDED.min_order_amount,
  max_discount_amount = EXCLUDED.max_discount_amount,
  max_uses = EXCLUDED.max_uses,
  max_uses_per_user = EXCLUDED.max_uses_per_user,
  valid_from = EXCLUDED.valid_from,
  valid_until = EXCLUDED.valid_until,
  active = EXCLUDED.active;

-- ============================
-- ⭐ MIGRATION — REVIEWS
-- ============================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name VARCHAR(100) NOT NULL,
  author_type VARCHAR(20) DEFAULT 'standard' CHECK (author_type IN ('standard', 'premium', 'pro', 'verified')),
  author_title VARCHAR(100),
  author_institution VARCHAR(200),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,
  rating_quality INTEGER CHECK (rating_quality >= 1 AND rating_quality <= 5),
  rating_purity INTEGER CHECK (rating_purity >= 1 AND rating_purity <= 5),
  rating_shipping INTEGER CHECK (rating_shipping >= 1 AND rating_shipping <= 5),
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;

CREATE OR REPLACE VIEW product_reviews_summary AS
SELECT
  product_id,
  COUNT(*) as review_count,
  ROUND(AVG(rating)::numeric, 1) as average_rating,
  ROUND(AVG(rating_quality)::numeric, 1) as avg_quality,
  ROUND(AVG(rating_purity)::numeric, 1) as avg_purity,
  ROUND(AVG(rating_shipping)::numeric, 1) as avg_shipping,
  ROUND(AVG(rating_value)::numeric, 1) as avg_value,
  COUNT(*) FILTER (WHERE rating = 5) as five_star_count,
  COUNT(*) FILTER (WHERE rating = 4) as four_star_count,
  COUNT(*) FILTER (WHERE rating = 3) as three_star_count,
  COUNT(*) FILTER (WHERE rating = 2) as two_star_count,
  COUNT(*) FILTER (WHERE rating = 1) as one_star_count
FROM reviews
WHERE is_approved = true
GROUP BY product_id;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (is_approved = true);

DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own pending reviews" ON reviews;
CREATE POLICY "Users can update own pending reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_approved = false);

DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_reviews_updated_at ON reviews;
CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_reviews_updated_at();

-- ============================
-- ⭐ SEED — SAMPLE REVIEWS
-- ============================
-- Avis de démonstration pour le SEO (aggregateRating)

DO $$
DECLARE
  v_product_id uuid;
BEGIN
  -- Récupérer l'ID du premier produit (BPC-157)
  SELECT id INTO v_product_id FROM products WHERE name = 'BPC-157' LIMIT 1;

  IF v_product_id IS NOT NULL THEN
    INSERT INTO reviews (product_id, author_name, author_type, author_title, author_institution, rating, title, content, rating_quality, rating_purity, rating_shipping, rating_value, is_verified_purchase, is_approved, is_featured, created_at)
    VALUES
      (v_product_id, 'Dr. Marie Laurent', 'pro', 'PhD Researcher', 'CNRS Lyon', 5, 'Excellent peptide pour nos recherches', 'Nous utilisons ce BPC-157 pour nos études sur la régénération tissulaire. La pureté est excellente et les résultats sont très reproductibles. Livraison rapide et COA conforme.', 5, 5, 5, 5, true, true, true, NOW() - INTERVAL '45 days'),
      (v_product_id, 'Thomas B.', 'verified', NULL, NULL, 5, 'Qualité conforme aux attentes', 'Produit reçu rapidement, bien emballé. Le certificat d''analyse confirme la pureté annoncée. Je recommande.', 5, 5, 4, 4, true, true, false, NOW() - INTERVAL '30 days'),
      (v_product_id, 'Sophie M.', 'premium', 'Lab Technician', 'Université Paris-Saclay', 4, 'Bon produit, service client réactif', 'Bonne qualité globale. J''ai eu une question sur la reconstitution et le support a répondu très rapidement.', 4, 5, 5, 4, true, true, false, NOW() - INTERVAL '20 days'),
      (v_product_id, 'Jean-Pierre D.', 'standard', NULL, NULL, 5, 'Parfait', 'Exactement ce qu''il me fallait pour mes travaux de recherche. Livraison express impeccable.', 5, 5, 5, 5, false, true, false, NOW() - INTERVAL '10 days')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Récupérer l'ID du TB-500
  SELECT id INTO v_product_id FROM products WHERE name = 'TB-500' LIMIT 1;

  IF v_product_id IS NOT NULL THEN
    INSERT INTO reviews (product_id, author_name, author_type, author_title, rating, title, content, rating_quality, rating_purity, rating_shipping, is_verified_purchase, is_approved, is_featured, created_at)
    VALUES
      (v_product_id, 'Prof. Alain Dubois', 'pro', 'Director of Research', 5, 'Qualité pharmaceutique', 'Nous avons testé plusieurs fournisseurs et Atlas Lab Solutions offre la meilleure qualité/prix. Le TB-500 est parfaitement lyophilisé.', 5, 5, 5, true, true, true, NOW() - INTERVAL '25 days'),
      (v_product_id, 'Claire R.', 'verified', NULL, 4, 'Très satisfaite', 'Premier achat sur ce site, je suis agréablement surprise par la qualité et la rapidité.', 4, 4, 5, true, true, false, NOW() - INTERVAL '15 days')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================
-- 📧 WELCOME EMAIL TRIGGER
-- ============================
-- Déclenché automatiquement quand un utilisateur confirme son email

CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, extensions, pg_net
LANGUAGE plpgsql
AS $$
BEGIN
  -- Vérifie que email_confirmed_at vient d'être défini (première confirmation)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- Appel asynchrone à l'Edge Function welcome-email via pg_net
    PERFORM net.http_post(
      url := 'https://dwomsbawthlktapmtmqu.supabase.co/functions/v1/welcome-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
        'user_id', NEW.id::text,
        'email', NEW.email,
        'full_name', COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'locale', COALESCE(NEW.raw_user_meta_data->>'locale', 'fr')
      )
    );

    RAISE LOG 'Welcome email triggered for user: %', NEW.email;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;

CREATE TRIGGER on_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_email();

COMMENT ON FUNCTION public.trigger_welcome_email() IS
'Envoie un email de bienvenue lorsque l''utilisateur confirme son adresse email pour la première fois.';

-- ============================
-- 📚 SEED — RESOURCE CATEGORIES
-- ============================
INSERT INTO public.resource_categories (slug, label, description, icon, color, sort_order)
VALUES
  ('lab-protocols', 'Protocoles Laboratoire', 'Guides techniques pour la manipulation aseptique, reconstitution et protocoles de laboratoire.', 'FlaskConical', 'primary', 1),
  ('hplc-analysis', 'Analyse HPLC', 'Comprendre les rapports HPLC, la chromatographie et les certificats d''analyse.', 'LineChart', 'info', 2),
  ('storage-handling', 'Stockage & Conservation', 'Bonnes pratiques de stockage des peptides lyophilisés et reconstitués.', 'Thermometer', 'warning', 3),
  ('molecular-science', 'Science Moléculaire', 'Structure moléculaire, séquences d''acides aminés et chimie des peptides.', 'Atom', 'secondary', 4),
  ('quality-standards', 'Standards Qualité', 'Normes de qualité, certifications et traçabilité en recherche peptidique.', 'ShieldCheck', 'success', 5)
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- ============================
-- 📚 SEED — LAB NOTES RESOURCES
-- ============================

-- Article 1: Protocoles de Reconstitution
INSERT INTO public.resources (
  slug, title, excerpt, content, image, category_id,
  difficulty_level, reading_time_minutes, equipment_needed,
  status, published_at, featured
) VALUES (
  'guide-reconstitution-peptides-lyophilises',
  'Guide Complet : Reconstitution des Peptides Lyophilisés',
  'Protocole détaillé pour la reconstitution aseptique des peptides lyophilisés en environnement de laboratoire.',
  '<h2>Introduction</h2><p>La reconstitution des peptides lyophilisés est une étape critique qui détermine la stabilité et l''intégrité du composé pour la recherche.</p><h2>Matériel Requis</h2><ul><li>Hotte à flux laminaire</li><li>Eau bactériostatique</li><li>Seringues stériles</li><li>Tampons alcoolisés 70%</li></ul><h2>Protocole Standard</h2><p>Injecter le solvant lentement le long de la paroi du flacon, jamais directement sur la poudre.</p>',
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/lab-reconstitution.jpg',
  (SELECT id FROM public.resource_categories WHERE slug = 'lab-protocols'),
  'beginner', 8,
  ARRAY['Hotte à flux laminaire', 'Eau bactériostatique', 'Seringues stériles', 'Alcool 70%'],
  'published', NOW(), true
) ON CONFLICT (slug) DO NOTHING;

-- Article 2: Analyse HPLC
INSERT INTO public.resources (
  slug, title, excerpt, content, image, category_id,
  difficulty_level, reading_time_minutes, equipment_needed,
  status, published_at, featured
) VALUES (
  'comprendre-rapports-hplc-peptides',
  'Comprendre les Rapports HPLC : Guide d''Interprétation',
  'Comment lire et interpréter un certificat d''analyse HPLC pour les peptides de recherche.',
  '<h2>Qu''est-ce que l''HPLC ?</h2><p>La Chromatographie Liquide Haute Performance est la méthode de référence pour analyser la pureté des peptides.</p><h2>Lecture d''un Chromatogramme</h2><ul><li>Temps de rétention</li><li>Aire du pic</li><li>Pics secondaires</li></ul><h2>Calcul de la Pureté</h2><p>Pureté (%) = (Aire pic principal / Aire totale) × 100</p>',
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/hplc-analysis.jpg',
  (SELECT id FROM public.resource_categories WHERE slug = 'hplc-analysis'),
  'intermediate', 10,
  ARRAY['Rapport HPLC', 'Certificat d''analyse'],
  'published', NOW() - INTERVAL '2 days', true
) ON CONFLICT (slug) DO NOTHING;

-- Article 3: Stockage et Conservation
INSERT INTO public.resources (
  slug, title, excerpt, content, image, category_id,
  difficulty_level, reading_time_minutes, equipment_needed,
  status, published_at, featured
) VALUES (
  'stockage-optimal-peptides-recherche',
  'Stockage Optimal des Peptides : Températures et Durées',
  'Guide complet sur les conditions de stockage des peptides lyophilisés et reconstitués.',
  '<h2>Principes de Base</h2><p>Les peptides sont sensibles à l''hydrolyse, l''oxydation et l''agrégation.</p><h2>Peptides Lyophilisés</h2><ul><li>Température : -20°C</li><li>Humidité : < 30%</li><li>Durée : 2-3 ans</li></ul><h2>Peptides Reconstitués</h2><p>Stockage à +2-8°C, durée variable selon le peptide (7-30 jours).</p>',
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/storage-peptides.jpg',
  (SELECT id FROM public.resource_categories WHERE slug = 'storage-handling'),
  'beginner', 7,
  ARRAY['Congélateur -20°C', 'Réfrigérateur +4°C', 'Dessiccant'],
  'published', NOW() - INTERVAL '5 days', false
) ON CONFLICT (slug) DO NOTHING;

-- Article 4: Science Moléculaire
INSERT INTO public.resources (
  slug, title, excerpt, content, image, category_id,
  difficulty_level, reading_time_minutes, equipment_needed,
  status, published_at, featured
) VALUES (
  'structure-moleculaire-peptides-synthese',
  'Structure Moléculaire des Peptides : De la Séquence à la Fonction',
  'Comprendre la relation entre séquence d''acides aminés et propriétés des peptides.',
  '<h2>Niveaux de Structure</h2><ul><li>Structure primaire : séquence linéaire</li><li>Structure secondaire : hélice α, feuillet β</li><li>Structure tertiaire : repliement 3D</li></ul><h2>Propriétés Clés</h2><p>Poids moléculaire, point isoélectrique, hydrophobicité.</p>',
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/molecular-structure.jpg',
  (SELECT id FROM public.resource_categories WHERE slug = 'molecular-science'),
  'advanced', 12,
  ARRAY['Documentation produit', 'Base de données UniProt'],
  'published', NOW() - INTERVAL '7 days', false
) ON CONFLICT (slug) DO NOTHING;

-- Article 5: Standards Qualité
INSERT INTO public.resources (
  slug, title, excerpt, content, image, category_id,
  difficulty_level, reading_time_minutes, equipment_needed,
  status, published_at, featured
) VALUES (
  'standards-qualite-peptides-recherche',
  'Standards de Qualité : Certificats et Traçabilité',
  'Guide sur les normes de qualité pour les peptides de recherche.',
  '<h2>Le Certificat d''Analyse (COA)</h2><ul><li>Identité du produit</li><li>Pureté HPLC ≥ 98%</li><li>Confirmation MS</li><li>Contenu peptidique</li></ul><h2>Tests Analytiques</h2><p>HPLC, Spectrométrie de masse, Analyse des acides aminés.</p><h2>Traçabilité</h2><p>Chaque lot doit avoir un identifiant unique avec documentation complète.</p>',
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/quality-standards.jpg',
  (SELECT id FROM public.resource_categories WHERE slug = 'quality-standards'),
  'intermediate', 9,
  ARRAY['Certificat d''analyse (COA)', 'Documentation lot'],
  'published', NOW() - INTERVAL '10 days', true
) ON CONFLICT (slug) DO NOTHING;

-- =========================================
-- ✅ FIN DU SEED V6.4
-- =========================================
