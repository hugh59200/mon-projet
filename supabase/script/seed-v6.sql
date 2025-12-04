-- =========================================
-- 🚀 SEED DATA V6 - AVEC SUPPORT I18N + SEO/GEO
-- =========================================
-- Ce script inclut :
-- 1. Migration pour les colonnes i18n (JSONB)
-- 2. Migration SEO/GEO (cas_number, sequence)
-- 3. Données produits avec traductions EN + données scientifiques
-- 4. Données news et topics
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
-- 👤 SEED — AUTH USERS
-- ============================
-- Création de l'utilisateur admin avec mot de passe: 162497

-- Utiliser un UUID fixe pour pouvoir référencer l'utilisateur
DO $$
DECLARE
  v_user_id uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
BEGIN
  -- Supprimer les identities et l'utilisateur existants (par UUID pour éviter les conflits)
  DELETE FROM auth.identities WHERE user_id = v_user_id;
  DELETE FROM auth.users WHERE id = v_user_id;

  -- Créer l'utilisateur avec le mot de passe
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

  -- Créer l'identity pour l'authentification email
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
    'contact@fast-peptides.com',
    'email',
    jsonb_build_object(
      'sub', v_user_id::text,
      'email', 'contact@fast-peptides.com',
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
INSERT INTO public.profiles (id, email, full_name, role, address, zip, city)
VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'contact@fast-peptides.com', 'Hugo Bogrand', 'admin', '11 rue du Général Leclerc', '59126', 'Linselles')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  address = EXCLUDED.address,
  zip = EXCLUDED.zip,
  city = EXCLUDED.city;

-- ============================
-- 📦 SEED — PRODUCTS AVEC I18N + SEO
-- ============================

INSERT INTO public.products (name, name_i18n, dosage, category, category_i18n, price, sale_price, is_on_sale, stock, image, tags, description, description_i18n, cas_number, sequence)
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
 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val'),

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
 'Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Gly-Glu-Ser'),

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
 'His-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys-Glu-Phe-Ile-Ala-Trp-Leu-Val-Arg-Gly-Arg-Gly'),

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
 'Tyr-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Tyr-Ser-Ile-Aib-Leu-Asp-Lys-Ile-Ala-Gln-Lys-Ala-Phe-Val-Gln-Trp-Leu-Ile-Ala-Gly-Gly-Pro-Ser-Ser-Gly-Ala-Pro-Pro-Pro-Ser'),

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
 'Tyr-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Tyr-Ser-Ile-Aib-Leu-Asp-Lys-Ile-Ala-Gln-Glu-Ala-Phe-Ile-Glu-Trp-Leu-Leu-Ala-Gly-Gly-Pro-Ser-Ser-Gly-Ala-Pro-Pro-Pro-Ser'),

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
 'Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg'),

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
 'His-D-Trp-Ala-Trp-D-Phe-Lys'),

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
 'His-D-2MeTrp-Ala-Trp-D-Phe-Lys'),

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
 'Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg'),

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
 'PEG-Tyr-Gly-Pro-Lys-Gly-Thr-Met-Asp-Leu-Glu-Cys-Val-Leu-Ser-Leu-Ala-Arg-Gln-Pro-His-Gln-Gly'),

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
 'Ac-Nle-cyclo(Asp-His-D-Phe-Arg-Trp-Lys)'),

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
 'Ac-Nle-cyclo(Asp-His-D-Phe-Arg-Trp-Lys)'),

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
 'Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe'),

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
 'Thr-Lys-Pro-Arg-Pro-Gly-Pro'),

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
 'Met-Glu-His-Phe-Pro-Gly-Pro'),

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
 'Gly-His-Lys-Cu'),

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
 NULL),

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
 'Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn'),

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
 'Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu'),

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
 'Aib-His-D-2Nal-D-Phe-Lys'),

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
 NULL),

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
 NULL),

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
 'D-Arg-Dmt-Lys-Phe'),

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
 'Trans-3-hexenoic acid-Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg')

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
  sequence = EXCLUDED.sequence;

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
-- 📰 SEED — NEWS
-- ============================
INSERT INTO public.news (id, slug, title, title_i18n, excerpt, excerpt_i18n, content, content_i18n, image, published_at, author_id, topic_id)
VALUES
('9d4a3f43-40b4-47a2-863b-9c6dd5c6af43', 'peptides-regeneration-cellulaire',
 'Des peptides capables de stimuler la régénération cellulaire',
 '{"en": "Peptides capable of stimulating cellular regeneration"}',
 'De nouveaux peptides bioactifs montrent un fort potentiel pour la réparation des tissus endommagés.',
 '{"en": "New bioactive peptides show strong potential for repairing damaged tissues."}',
 'Ces peptides biomimétiques pourraient transformer la médecine régénérative et favoriser la cicatrisation avancée.',
 '{"en": "These biomimetic peptides could transform regenerative medicine and promote advanced healing."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/des-peptides-capables-de-stimuler-la-regeneration-cellulaire-1761755829537/news-des-peptides-capables-de-stimuler-la-regeneration-cellulaire-1761755829537.png',
 NOW(), NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),

('a2bab8fc-943b-4b32-acb9-044d54828014', 'ia-decouverte-peptides-therapeutiques',
 'L''intelligence artificielle accélère la découverte de peptides thérapeutiques',
 '{"en": "Artificial intelligence accelerates the discovery of therapeutic peptides"}',
 'L''IA révolutionne la recherche en identifiant des séquences peptidiques prometteuses en un temps record.',
 '{"en": "AI is revolutionizing research by identifying promising peptide sequences in record time."}',
 'En combinant modélisation moléculaire et machine learning, les chercheurs découvrent plus rapidement de nouveaux candidats thérapeutiques.',
 '{"en": "By combining molecular modeling and machine learning, researchers are discovering new therapeutic candidates faster."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/l-intelligence-artificielle-accelere-la-decouverte-de-peptides-therapeutiques-1761755758519/news-l-intelligence-artificielle-accelere-la-decouverte-de-peptides-therapeutiques-1761755758519.png',
 NOW(), NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),

('facb0cb2-d70d-4fcb-a0b2-04466bfb9904', 'avancee-peptides-synthetiques',
 'Une avancée majeure dans la conception de peptides synthétiques',
 '{"en": "A major breakthrough in synthetic peptide design"}',
 'Des chercheurs développent de nouveaux peptides plus stables et efficaces pour la recherche biomédicale.',
 '{"en": "Researchers are developing new, more stable and effective peptides for biomedical research."}',
 'Cette innovation ouvre la voie à des peptides de nouvelle génération capables de résister à la dégradation et d''améliorer la précision thérapeutique.',
 '{"en": "This innovation paves the way for next-generation peptides capable of resisting degradation and improving therapeutic precision."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/une-avancee-majeure-dans-la-conception-de-peptides-synthetiques-1761755661276/news-une-avancee-majeure-dans-la-conception-de-peptides-synthetiques-1761755661276.png',
 NOW(), NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),

('62d44c97-953f-4dee-8752-9eb287afb017', 'marche-peptides-2025',
 'Le marché mondial des peptides atteint un nouveau record en 2025',
 '{"en": "The global peptide market reaches a new record in 2025"}',
 'Le secteur des peptides connaît une croissance sans précédent, portée par la demande pharmaceutique et cosmétique.',
 '{"en": "The peptide sector is experiencing unprecedented growth, driven by pharmaceutical and cosmetic demand."}',
 'L''essor de la biotechnologie et des traitements personnalisés stimule fortement le marché international des peptides.',
 '{"en": "The rise of biotechnology and personalized treatments is strongly stimulating the international peptide market."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/le-marche-mondial-des-peptides-atteint-un-nouveau-record-en-2025-1761755894429/news-le-marche-mondial-des-peptides-atteint-un-nouveau-record-en-2025-1761755894429.png',
 NOW(), NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),

('67170960-eef3-4ead-b88c-f6ebed45be0f', 'startups-biotech-peptides',
 'Les startups biotechs se tournent vers les peptides de nouvelle génération',
 '{"en": "Biotech startups turn to next-generation peptides"}',
 'Un nombre croissant de jeunes entreprises investissent dans la recherche et la production de peptides innovants.',
 '{"en": "A growing number of young companies are investing in the research and production of innovative peptides."}',
 'Ces nouvelles sociétés combinent IA, automatisation et biologie synthétique pour créer des peptides plus performants.',
 '{"en": "These new companies combine AI, automation and synthetic biology to create more efficient peptides."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/les-startups-biotechs-se-tournent-vers-les-peptides-de-nouvelle-generation-1761755973847/news-les-startups-biotechs-se-tournent-vers-les-peptides-de-nouvelle-generation-1761755973847.png',
 NOW(), NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),

('2474f359-cf06-494a-887d-60cd534e95be', 'economie-des-peptides',
 'L''économie des peptides : un pilier de la biotechnologie moderne',
 '{"en": "The peptide economy: a pillar of modern biotechnology"}',
 'Les peptides deviennent un acteur économique clé dans le développement pharmaceutique et nutritionnel.',
 '{"en": "Peptides are becoming a key economic player in pharmaceutical and nutritional development."}',
 'Entre investissement public et privé, le marché des peptides se positionne comme une source d''innovation durable.',
 '{"en": "Between public and private investment, the peptide market is positioning itself as a source of sustainable innovation."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/l-economie-des-peptides-un-pilier-de-la-biotechnologie-moderne-1761756061388/news-l-economie-des-peptides-un-pilier-de-la-biotechnologie-moderne-1761756061388.png',
 NOW(), NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),

('47080cad-079c-450a-a8e4-544a58e57010', 'harmonisation-normes-peptides',
 'Vers une harmonisation mondiale des normes sur les peptides',
 '{"en": "Towards global harmonization of peptide standards"}',
 'Les agences de régulation cherchent à unifier les standards internationaux pour les peptides.',
 '{"en": "Regulatory agencies are seeking to unify international standards for peptides."}',
 'Une meilleure coopération entre autorités permettra de faciliter les essais cliniques et la commercialisation globale.',
 '{"en": "Better cooperation between authorities will facilitate clinical trials and global commercialization."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/vers-une-harmonisation-mondiale-des-normes-sur-les-peptides-1761756968952/news-vers-une-harmonisation-mondiale-des-normes-sur-les-peptides-1761756968952.png',
 NOW(), NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),

('4ff13258-7338-4de2-8ed9-7c9b8ff85368', 'directives-europeennes-peptides',
 'Nouvelles directives européennes sur les peptides en recherche',
 '{"en": "New European guidelines on peptides in research"}',
 'L''Union européenne renforce la réglementation sur la production et l''utilisation des peptides.',
 '{"en": "The European Union is strengthening regulations on the production and use of peptides."}',
 'Ces nouvelles règles visent à assurer la traçabilité et la sécurité dans la recherche scientifique et médicale.',
 '{"en": "These new rules aim to ensure traceability and safety in scientific and medical research."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/nouvelles-directives-europeennes-sur-les-peptides-en-recherche-1761756981526/news-nouvelles-directives-europeennes-sur-les-peptides-en-recherche-1761756981526.png',
 NOW(), NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),

('a1178be8-e547-4a28-8677-07404bcc5f67', 'controle-peptides-recherche',
 'Contrôle renforcé sur les peptides destinés à la recherche',
 '{"en": "Enhanced control on peptides for research"}',
 'Les autorités mettent en place de nouveaux protocoles de contrôle pour les peptides de laboratoire.',
 '{"en": "Authorities are implementing new control protocols for laboratory peptides."}',
 'L''objectif est de prévenir les abus et d''assurer la conformité aux bonnes pratiques scientifiques.',
 '{"en": "The goal is to prevent abuse and ensure compliance with good scientific practices."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/controle-renforce-sur-les-peptides-destines-a-la-recherche-1761757065279/news-controle-renforce-sur-les-peptides-destines-a-la-recherche-1761757065279.png',
 NOW(), NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),

('9c165271-a61d-4ff2-aba5-061289cdff3c', 'peptides-recuperation-musculaire',
 'Les peptides révolutionnent la récupération musculaire',
 '{"en": "Peptides revolutionize muscle recovery"}',
 'De nouvelles études montrent que certains peptides favorisent la réparation rapide des fibres musculaires après l''effort.',
 '{"en": "New studies show that certain peptides promote rapid repair of muscle fibers after exercise."}',
 'Ces composés naturels stimulent la régénération tissulaire et optimisent la récupération sportive.',
 '{"en": "These natural compounds stimulate tissue regeneration and optimize sports recovery."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/les-peptides-revolutionnent-la-recuperation-musculaire-1761757146896/news-les-peptides-revolutionnent-la-recuperation-musculaire-1761757146896.png',
 NOW(), NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),

('a76da968-bc21-4122-ba61-f11e69f1af78', 'peptides-performance-physique',
 'Le rôle des peptides dans la performance physique',
 '{"en": "The role of peptides in physical performance"}',
 'Les peptides bioactifs améliorent la force, l''endurance et la récupération musculaire.',
 '{"en": "Bioactive peptides improve strength, endurance and muscle recovery."}',
 'Une nouvelle génération de peptides naturels offre un soutien métabolique inédit pour les athlètes.',
 '{"en": "A new generation of natural peptides offers unprecedented metabolic support for athletes."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/le-role-des-peptides-dans-la-performance-physique-1761757260028/news-le-role-des-peptides-dans-la-performance-physique-1761757260028.png',
 NOW(), NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),

('22c306ec-1546-4a72-96c1-52bca32d29fe', 'peptides-metabolisme-performance',
 'Peptides et métabolisme : une approche biochimique de la performance',
 '{"en": "Peptides and metabolism: a biochemical approach to performance"}',
 'Les recherches explorent comment les peptides régulent l''énergie et le métabolisme musculaire.',
 '{"en": "Research explores how peptides regulate energy and muscle metabolism."}',
 'Ces découvertes pourraient transformer les approches nutritionnelles du sport de haut niveau.',
 '{"en": "These discoveries could transform nutritional approaches in high-level sports."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-et-metabolisme-une-approche-biochimique-de-la-performance-1761757342295/news-peptides-et-metabolisme-une-approche-biochimique-de-la-performance-1761757342295.png',
 NOW(), NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),

('78f05eef-ae13-479a-944c-88928052bfab', 'peptides-cosmetique-regeneratrice',
 'Les peptides au cœur de la nouvelle cosmétique régénératrice',
 '{"en": "Peptides at the heart of new regenerative cosmetics"}',
 'Les laboratoires misent sur les peptides pour stimuler la production naturelle de collagène.',
 '{"en": "Laboratories are betting on peptides to stimulate natural collagen production."}',
 'Ces formules peptidiques promettent une peau plus ferme, plus lisse et visiblement rajeunie.',
 '{"en": "These peptide formulas promise firmer, smoother and visibly rejuvenated skin."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/les-peptides-au-c-ur-de-la-nouvelle-cosmetique-regeneratrice-1761757413848/news-les-peptides-au-c-ur-de-la-nouvelle-cosmetique-regeneratrice-1761757413848.png',
 NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91'),

('a7848dff-911e-41e8-beb2-559aaf5d7263', 'peptides-soins-peau',
 'Peptides et soins de la peau : la science du rajeunissement',
 '{"en": "Peptides and skincare: the science of rejuvenation"}',
 'Les peptides deviennent un ingrédient clé dans les crèmes anti-âge de nouvelle génération.',
 '{"en": "Peptides are becoming a key ingredient in next-generation anti-aging creams."}',
 'En agissant directement sur les cellules cutanées, ils restaurent l''élasticité et l''éclat du visage.',
 '{"en": "By acting directly on skin cells, they restore elasticity and radiance to the face."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-et-soins-de-la-peau-la-science-du-rajeunissement-1761757489202/news-peptides-et-soins-de-la-peau-la-science-du-rajeunissement-1761757489202.png',
 NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91'),

('1584153b-0144-484b-91a9-6abf00d53e35', 'biotechnologie-bien-etre-cutane',
 'La biotechnologie au service du bien-être cutané',
 '{"en": "Biotechnology serving skin wellness"}',
 'Les innovations en biotechnologie cosmétique exploitent les peptides pour une peau plus saine.',
 '{"en": "Innovations in cosmetic biotechnology exploit peptides for healthier skin."}',
 'Ces avancées associent nature et science pour une approche durable et efficace du soin de la peau.',
 '{"en": "These advances combine nature and science for a sustainable and effective approach to skincare."}',
 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/la-biotechnologie-au-service-du-bien-etre-cutane-1761757555625/news-la-biotechnologie-au-service-du-bien-etre-cutane-1761757555625.png',
 NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91')

ON CONFLICT (id) DO UPDATE SET
  title_i18n = EXCLUDED.title_i18n,
  excerpt_i18n = EXCLUDED.excerpt_i18n,
  content_i18n = EXCLUDED.content_i18n;

-- =========================================
-- ✅ FIN DU SEED V6
-- =========================================
