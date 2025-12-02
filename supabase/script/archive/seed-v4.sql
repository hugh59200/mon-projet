-- =========================================
-- 🚀 SEED DATA V2.3 (CORRIGÉ & ALIGNÉ)
-- =========================================

-- ============================
-- 👤 SEED — PROFILES
-- ============================
INSERT INTO public.profiles (id, email, full_name, role)
VALUES
((SELECT id FROM auth.users WHERE email = 'lucas.martin@example.com'), 'lucas.martin@example.com', 'Lucas Martin', 'user'),
((SELECT id FROM auth.users WHERE email = 'maxime.riviere@example.com'), 'maxime.riviere@example.com', 'Maxime Rivière', 'user'),
((SELECT id FROM auth.users WHERE email = 'h.bogrand@gmail.com'), 'h.bogrand@gmail.com', 'Hugo Bogrand', 'admin'),
((SELECT id FROM auth.users WHERE email = 'emma.dupont@example.com'), 'emma.dupont@example.com', 'Emma Dupont', 'user')
ON CONFLICT (id) DO NOTHING;

-- ============================
-- 📦 SEED — PRODUCTS (DESCRIPTIONS DETAILLÉES V3)
-- ============================
-- Note: Les descriptions contiennent du HTML pour le formatage (puces, gras)
-- ============================

INSERT INTO public.products (name, dosage, category, price, sale_price, is_on_sale, stock, purity, image, tags, description)
VALUES
-- 1. BPC-157
('BPC-157', '10mg', 'Récupération', 40.00, 36.00, true, 10, 99.00,
 '/src/assets/products/bpc-157/10mg/bpc-157-10mg.png',
 '{"recuperation", "articulations", "99%"}',
 '<p><strong>Le BPC-157 (Body Protection Compound-157)</strong> est un pentadécapeptide composé de 15 acides aminés, dérivé d''une protéine protectrice présente naturellement dans l''estomac humain.</p><p>Dans le cadre de la recherche, ce peptide est largement étudié pour ses propriétés potentielles de cytoprotection et d''angiogenèse (formation de nouveaux vaisseaux sanguins).</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Accélération de la cicatrisation des tendons et ligaments.</li><li>Réduction de l''inflammation intestinale.</li><li>Protection cellulaire contre les toxines.</li></ul>'),

-- 2. TB-500
('TB-500', '5mg', 'Récupération', 45.00, 40.50, true, 10, 99.00,
 '/src/assets/products/tb-500/5mg/tb-500-5mg.png',
 '{"recuperation", "souplesse", "99%"}',
 '<p><strong>Le TB-500</strong> est une version synthétique de la Thymosin Beta-4, une protéine présente dans presque toutes les cellules humaines et animales. Elle joue un rôle clé dans la régulation de l''actine cellulaire.</p><p>Les chercheurs s''intéressent à sa capacité à favoriser la migration cellulaire vers les zones lésées, facilitant ainsi la régénération tissulaire.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Réduction de l''inflammation tissulaire.</li><li>Amélioration de la flexibilité et réduction des adhérences.</li><li>Récupération musculaire post-traumatique.</li></ul>'),

-- 3. Semaglutide
('Semaglutide', '10mg', 'Perte de poids', 75.00, 67.50, true, 10, 99.00,
 '/src/assets/products/semaglutide/10mg/semaglutide-10mg.png',
 '{"minceur", "metabolisme", "99%"}',
 '<p><strong>Le Semaglutide</strong> est un agoniste des récepteurs du GLP-1 (Glucagon-Like Peptide-1). Il imite l''action de l''hormone incrétine naturelle qui régule la glycémie.</p><p>En laboratoire, il est étudié pour sa capacité à ralentir la vidange gastrique et à influencer les signaux de satiété au niveau de l''hypothalamus.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Régulation de l''insuline et de la glycémie.</li><li>Études sur la réduction de la masse adipeuse.</li><li>Contrôle de l''appétit dans les modèles animaux.</li></ul>'),

-- 4. Tirzepatide
('Tirzepatide', '10mg', 'Perte de poids', 85.00, 76.50, true, 10, 99.00,
 '/src/assets/products/tirzepatide/10mg/tirzepatide-10mg.png',
 '{"minceur", "avancé", "99%"}',
 '<p><strong>Le Tirzepatide</strong> est un peptide innovant à double action : il agit comme agoniste des récepteurs GIP (polypeptide insulinotrope dépendant du glucose) et GLP-1.</p><p>Cette synergie unique en fait un sujet d''étude privilégié pour le traitement des désordres métaboliques sévères, offrant une efficacité potentiellement supérieure aux agonistes GLP-1 seuls.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Synergie GIP/GLP-1 pour le métabolisme.</li><li>Amélioration de la sensibilité à l''insuline.</li><li>Impact significatif sur la composition corporelle.</li></ul>'),

-- 5. Retatrutide
('Retatrutide', '10mg', 'Perte de poids', 60.00, 54.00, true, 10, 99.00,
 '/src/assets/products/retatrutide/10mg/retatrutide-10mg.png',
 '{"metabolisme", "perte-de-poids", "99%"}',
 '<p><strong>Le Retatrutide</strong> est un candidat de nouvelle génération qualifié de "triple agoniste" (GLP-1, GIP et Glucagon). C''est actuellement l''un des peptides les plus prometteurs en recherche métabolique.</p><p>L''ajout de l''agonisme du récepteur au glucagon vise à augmenter la dépense énergétique basale, en plus des effets sur la satiété.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Stimulation de la dépense énergétique.</li><li>Régulation hépatique des lipides.</li><li>Gestion avancée de l''obésité.</li></ul>'),

-- 6. CJC-1295 DAC
('CJC-1295 DAC', '5mg', 'Croissance', 42.00, 37.80, true, 10, 98.50,
 '/src/assets/products/cjc-1295-dac/5mg/cjc-1295-dac-5mg.png',
 '{"croissance", "masse", "98.5%"}',
 '<p><strong>Le CJC-1295 avec DAC</strong> (Drug Affinity Complex) est un analogue synthétique de la GHRH (Growth Hormone Releasing Hormone). La modification DAC permet de se lier à l''albumine sérique, prolongeant considérablement sa demi-vie.</p><p>Contrairement au CJC sans DAC, cette version permet de maintenir des niveaux physiologiques élevés d''hormone de croissance de manière continue sur plusieurs jours.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Stimulation continue de la sécrétion de GH et d''IGF-1.</li><li>Études sur l''anabolisme musculaire à long terme.</li><li>Amélioration de la synthèse protéique.</li></ul>'),

-- 7. GHRP-6
('GHRP-6', '10mg', 'Croissance', 32.00, 28.80, true, 10, 99.00,
 '/src/assets/products/ghrp-6/10mg/ghrp-6-10mg.png',
 '{"croissance", "appetit", "99%"}',
 '<p><strong>Le GHRP-6</strong> (Growth Hormone Releasing Peptide-6) est un hexapeptide sécrétagogue qui stimule la libération d''hormone de croissance par l''hypophyse.</p><p>Il est également connu pour son interaction avec les récepteurs de la ghréline, ce qui peut induire une augmentation significative de l''appétit, un effet recherché dans certains contextes de prise de masse.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Pics rapides de sécrétion de GH.</li><li>Stimulation de l''appétit et prise de masse.</li><li>Effets anti-inflammatoires systémiques.</li></ul>'),

-- 8. Hexarelin
('Hexarelin', '5mg', 'Croissance', 38.00, 34.20, true, 10, 99.00,
 '/src/assets/products/hexarelin/5mg/hexarelin-5mg.png',
 '{"croissance", "force", "99%"}',
 '<p><strong>L''Hexarelin</strong> est considéré comme l''un des sécrétagogues de GH les plus puissants disponibles, structurellement similaire au GHRP-6 mais avec un profil d''efficacité plus élevé.</p><p>Il a la particularité de ne pas augmenter l''appétit de manière aussi marquée que le GHRP-6, tout en offrant une libération massive de GH.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Augmentation maximale des niveaux plasmatiques de GH.</li><li>Propriétés cardioprotectrices potentielles.</li><li>Récupération neurale.</li></ul>'),

-- 9. Sermorelin
('Sermorelin', '5mg', 'Anti-âge', 35.00, 31.50, true, 10, 99.00,
 '/src/assets/products/sermorelin/5mg/sermorelin-5mg.png',
 '{"anti-age", "sommeil", "99%"}',
 '<p><strong>La Sermorelin</strong> est un analogue biologique de la GHRH (correspondant aux 29 premiers acides aminés). C''est l''un des peptides les plus prescrits en clinique anti-âge aux États-Unis.</p><p>Il stimule l''hypophyse de manière naturelle pour produire de la GH par vagues (pulsatile), respectant ainsi le rythme circadien du corps.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Amélioration de la qualité du sommeil profond.</li><li>Effets anti-âge et vitalité générale.</li><li>Optimisation de la composition corporelle.</li></ul>'),

-- 10. PEG-MGF
('PEG-MGF', '2mg', 'Performance', 40.00, 36.00, true, 10, 98.00,
 '/src/assets/products/peg-mgf/2mg/peg-mgf-2mg.png',
 '{"muscle", "récupération", "98%"}',
 '<p><strong>Le PEG-MGF</strong> (Pegylated Mechano Growth Factor) est une variante épissée de l''IGF-1. L''ajout de polyéthylène glycol (PEG) protège le peptide de la dégradation rapide.</p><p>Il est spécifiquement étudié pour son rôle dans l''activation des cellules satellites musculaires suite à un stress mécanique (entraînement), favorisant l''hypertrophie locale.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Réparation musculaire localisée.</li><li>Activation des cellules souches musculaires.</li><li>Neuroprotection.</li></ul>'),

-- 11. Melanotan 2
('Melanotan 2', '10mg', 'Bien-être', 35.00, 31.50, true, 10, 99.00,
 '/src/assets/products/melanothan-2/10mg/Melanotan 2-10mg.png',
 '{"bronzage", "libido", "99%"}',
 '<p><strong>Le Melanotan 2</strong> est un analogue synthétique de l''hormone alpha-mélanocytaire (α-MSH). Il agit principalement sur les récepteurs de la mélanocortine.</p><p>Il est célèbre pour sa capacité à stimuler la mélanogenèse (production de mélanine) sans exposition excessive aux UV, mais possède également des effets marqués sur la libido.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Stimulation de la pigmentation de la peau.</li><li>Amélioration de la fonction érectile et de la libido.</li><li>Réduction de l''appétit.</li></ul>'),

-- 12. PT-141
('PT-141', '10mg', 'Bien-être', 45.00, 40.50, true, 10, 99.00,
 '/src/assets/products/pt-141/10mg/pt-141-10mg.png',
 '{"libido", "sexualité", "99%"}',
 '<p><strong>Le PT-141 (Bremelanotide)</strong> est un dérivé du Melanotan 2, spécifiquement affiné pour cibler les récepteurs responsables de l''excitation sexuelle, en minimisant l''effet sur la pigmentation.</p><p>Contrairement aux traitements classiques (type Viagra) qui agissent sur le système vasculaire, le PT-141 agit directement sur le système nerveux central.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Traitement des troubles du désir hypoactif.</li><li>Efficacité chez l''homme et la femme.</li><li>Action via le système nerveux central.</li></ul>'),

-- 13. Kisspeptine-10
('Kisspeptine-10', '10mg', 'Hormonal', 38.00, 34.20, true, 10, 99.00,
 '/src/assets/products/kisspeptine/10mg/kisspeptine-10-10mg.png',
 '{"hormonal", "equilibre", "99%"}',
 '<p><strong>La Kisspeptine-10</strong> est un peptide puissant qui initie la sécrétion de GnRH (Gonadotropin-releasing hormone). C''est un régulateur clé de l''axe reproducteur.</p><p>En recherche, elle est étudiée pour sa capacité à relancer la production naturelle de testostérone sans inhiber la spermatogenèse.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Stimulation de la LH et de la FSH.</li><li>Restauration de l''axe HPTA.</li><li>Recherche sur la fertilité.</li></ul>'),

-- 14. Selank
('Selank', '5mg', 'Nootropique', 30.00, 27.00, true, 10, 99.00,
 '/src/assets/products/selank/5mg/selank-5mg.png',
 '{"anti-stress", "nootropique", "99%"}',
 '<p><strong>Le Selank</strong> est un peptide synthétique dérivé de la tuftsin, naturellement produite par le corps. Il est classé comme anxiolytique et nootropique.</p><p>Il module l''expression du facteur neurotrophique BDNF et influence l''équilibre des neurotransmetteurs (sérotonine, dopamine) pour stabiliser l''humeur.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Réduction de l''anxiété généralisée sans sédation.</li><li>Amélioration de la clarté mentale.</li><li>Renforcement du système immunitaire.</li></ul>'),

-- 15. Semax
('Semax', '5mg', 'Nootropique', 30.00, 27.00, true, 10, 99.00,
 '/src/assets/products/semax/5mg/semax-5mg.png',
 '{"focus", "memoire", "99%"}',
 '<p><strong>Le Semax</strong> est un heptapeptide développé initialement en Russie pour traiter les accidents vasculaires cérébraux. C''est un puissant modulateur cognitif.</p><p>Il augmente significativement les niveaux de BDNF (Brain-Derived Neurotrophic Factor), favorisant la survie des neurones et la plasticité synaptique.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Amélioration de la concentration et de la mémoire.</li><li>Neuroprotection en cas d''hypoxie.</li><li>Réduction de la fatigue mentale.</li></ul>'),

-- 16. GHK-Cu
('GHK-Cu', '100mg', 'Cosmétique', 55.00, 49.50, true, 10, 99.00,
 '/src/assets/products/ghk-cu/100mg/ghk-cu-100mg.png',
 '{"peau", "cheveux", "anti-age", "99%"}',
 '<p><strong>Le GHK-Cu</strong> est un complexe peptide-cuivre naturel présent dans le plasma humain. Sa concentration diminue drastiquement avec l''âge.</p><p>Il est célèbre pour ses propriétés régénératrices exceptionnelles sur la peau (synthèse de collagène) et les follicules pileux.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Raffermissement de la peau et réduction des rides.</li><li>Stimulation de la pousse des cheveux.</li><li>Cicatrisation avancée des plaies.</li></ul>'),

-- 17. NAD+
('NAD+', '500mg', 'Anti-âge', 48.00, 43.20, true, 10, 98.00,
 '/src/assets/products/nad+/500mg/nad+-500mg.png',
 '{"energie", "longevite", "98%"}',
 '<p><strong>Le NAD+ (Nicotinamide Adénine Dinucléotide)</strong> est une coenzyme présente dans toutes les cellules vivantes, essentielle à la production d''énergie (ATP) dans les mitochondries.</p><p>Les niveaux de NAD+ chutent avec l''âge, ce qui est lié au vieillissement cellulaire et métabolique. La supplémentation est une voie majeure de la recherche anti-âge.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Restauration de la fonction mitochondriale.</li><li>Réparation de l''ADN (activation des sirtuines).</li><li>Amélioration de l''énergie cellulaire et cognitive.</li></ul>'),

-- 18. Thymosin Alpha-1
('Thymosin Alpha-1', '5mg', 'Santé', 52.00, 46.80, true, 10, 99.00,
 '/src/assets/products/thymosin-alpha/5mg/thymosin Alpha-1-5mg.png',
 '{"immunite", "sante", "99%"}',
 '<p><strong>La Thymosin Alpha-1</strong> est un peptide thymique naturel qui joue un rôle crucial dans la modulation du système immunitaire.</p><p>Il aide à la maturation des lymphocytes T. Il est étudié pour sa capacité à renforcer la réponse immunitaire face aux infections virales et au vieillissement du système immunitaire (immunosénescence).</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Renforcement des défenses immunitaires.</li><li>Propriétés antivirales et antifongiques.</li><li>Amélioration de l''efficacité des vaccins.</li></ul>'),
 -- ========================================
-- NOUVEAUX PRODUITS À AJOUTER AU CATALOGUE
-- ========================================
-- Ajouter ces entrées à la suite de votre fichier seed existant

-- 19. DSIP (Delta Sleep Inducing Peptide)
('DSIP', '5mg', 'Anti-âge', 38.00, 34.20, true, 10, 99.00,
 '/src/assets/products/dsip/5mg/dsip-5mg.png',
 '{"sommeil", "stress", "neuroprotection", "99%"}',
 '<p><strong>Le DSIP (Delta Sleep-Inducing Peptide)</strong> est un nonapeptide neuromodulateur découvert pour sa capacité à induire le sommeil à ondes lentes (delta). Il est naturellement présent dans l''hypothalamus et le système limbique.</p><p>Ce peptide régule le cycle veille-sommeil, module la réponse au stress via l''axe HPA et possède des propriétés antioxydantes au niveau mitochondrial.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Amélioration de la qualité du sommeil profond.</li><li>Réduction du cortisol et modulation du stress.</li><li>Propriétés neuroprotectrices et antioxydantes.</li></ul>'),

-- 20. Ipamorelin
('Ipamorelin', '5mg', 'Croissance', 40.00, 36.00, true, 10, 99.00,
 '/src/assets/products/ipamorelin/5mg/ipamorelin-5mg.png',
 '{"croissance", "selectif", "99%"}',
 '<p><strong>L''Ipamorelin</strong> est un pentapeptide sécrétagogue de GH de 3ème génération, reconnu comme le premier agoniste du récepteur GHRP avec une sélectivité comparable à la GHRH.</p><p>Contrairement au GHRP-6 et GHRP-2, l''Ipamorelin ne stimule pas la libération d''ACTH ni de cortisol, même à des doses 200 fois supérieures à l''ED50 pour la GH.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Libération sélective de GH sans effets sur le cortisol.</li><li>Pas d''augmentation significative de l''appétit.</li><li>Amélioration de la densité osseuse et récupération musculaire.</li></ul>'),

-- 21. Klow Blend
('Klow', '80mg', 'Récupération', 95.00, 85.50, true, 10, 99.00,
 '/src/assets/products/klow/80mg/klow-80mg.png',
 '{"regeneration", "anti-inflammatoire", "blend", "99%"}',
 '<p><strong>Le Klow Blend</strong> est une formulation synergique combinant quatre peptides régénératifs : GHK-Cu (50mg), BPC-157 (10mg), TB-500 (10mg) et KPV (10mg).</p><p>Cette combinaison cible des voies complémentaires : réparation tissulaire, modulation de l''inflammation, angiogenèse et remodelage de la matrice extracellulaire.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Régénération tissulaire et cicatrisation accélérée.</li><li>Modulation anti-inflammatoire via inhibition NF-κB.</li><li>Stimulation de la production de collagène et élastine.</li></ul>'),

-- 22. SLU-PP-332
('SLU-PP-332', '10mg', 'Performance', 65.00, 58.50, true, 10, 99.00,
 '/src/assets/products/slu-pp-332/10mg/slu-pp-332-10mg.png',
 '{"metabolisme", "exercice-mimetique", "mitochondrie", "99%"}',
 '<p><strong>Le SLU-PP-332</strong> est un agoniste pan-ERR (Estrogen-Related Receptor) qualifié de "mimétique de l''exercice". Il cible les trois isoformes ERRα, ERRβ et ERRγ avec une préférence pour ERRα.</p><p>Ce composé active un programme génétique d''exercice aérobie aigu, augmentant la fonction mitochondriale et la respiration cellulaire dans le muscle squelettique.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Augmentation de l''endurance et des fibres musculaires oxydatives.</li><li>Amélioration de l''oxydation des acides gras.</li><li>Réduction de la masse adipeuse viscérale.</li></ul>'),

-- 23. SS-31 (Elamipretide)
('SS-31', '10mg', 'Anti-âge', 70.00, 63.00, true, 10, 99.00,
 '/src/assets/products/ss-31/10mg/ss-31-10mg.png',
 '{"mitochondrie", "energie", "cardioprotection", "99%"}',
 '<p><strong>Le SS-31 (Elamipretide)</strong> est un tétrapeptide synthétique ciblant spécifiquement les mitochondries. Il interagit avec la cardiolipine de la membrane mitochondriale interne pour stabiliser la chaîne de transport d''électrons.</p><p>Ce peptide améliore la production d''ATP tout en réduisant le stress oxydatif à la source, dans les mitochondries elles-mêmes.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Restauration de la bioénergétique mitochondriale.</li><li>Protection contre le stress oxydatif cellulaire.</li><li>Amélioration de la fonction cardiaque et musculaire liée à l''âge.</li></ul>'),

-- 24. Tesamorelin
('Tesamorelin', '10mg', 'Perte de poids', 80.00, 72.00, true, 10, 99.00,
 '/src/assets/products/tesamorelin/10mg/tesamorelin-10mg.png',
 '{"ghrh", "adiposite", "cognition", "99%"}',
 '<p><strong>Le Tesamorelin</strong> est un analogue synthétique de 44 acides aminés de la GHRH, modifié par l''ajout d''un groupe trans-3-hexanoïque qui le protège de la dégradation par la DPP-4.</p><p>C''est le seul peptide GHRH approuvé par la FDA pour le traitement de la lipodystrophie associée au VIH, avec une réduction de la graisse viscérale d''environ 18%.</p><p><strong>Axes de recherche principaux :</strong></p><ul><li>Réduction significative du tissu adipeux viscéral.</li><li>Amélioration du profil lipidique et de la stéatose hépatique.</li><li>Effets nootropiques et amélioration cognitive.</li></ul>')

ON CONFLICT (name, dosage) DO UPDATE SET
 stock = EXCLUDED.stock,
 price = EXCLUDED.price,
 sale_price = EXCLUDED.sale_price,
 is_on_sale = EXCLUDED.is_on_sale,
 image = EXCLUDED.image,
 description = EXCLUDED.description;
-- ============================
-- 📰 SEED — NEWS TOPICS
-- ============================
INSERT INTO public.news_topics (id, slug, label, description, image)
VALUES 
('76bb3e2d-d0c7-41aa-a59c-32f4c77379e9', 'recherche', 'Recherche & Innovation', 'Les dernières avancées sur les peptides.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/recherche-innovation/topic-recherche-innovation-de988705-a90a-4fd8-bf3a-5a09091b5c5b.png'),
('82334ce4-0fcd-4947-9aa8-1bb16da64d91', 'bien-etre', 'Bien-être & Cosmétiques', 'Les peptides dans les soins, la beauté et le bien-être.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/bien-etre-cosmetiques/topic-bien-etre-cosmetiques-1761754899574.png?v=1761754899574'),
('ac5e9b57-ff9b-43d6-a69d-498a136c799a', 'marche', 'Marché & Économie', 'Les tendances et la croissance du marché des peptides.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/marche-economie/topic-marche-economie-1761754697638.png?v=1761754697638'),
('b24c81ab-d24d-4860-91f7-faabad0892f7', 'usages', 'Usages & Performances', 'Les applications sportives et les bénéfices sur la santé.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/usages-performances/topic-usages-performances-1761754829727.png?v=1761754829727'),
('f5401164-9929-413d-8a7b-6f1bfdabf9dc', 'reglementation', 'Réglementation & Conformité', 'Les évolutions légales et politiques du marché.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/topic-images/topics/reglementation-conformite/topic-reglementation-conformite-1761754763294.png?v=1761754763294')
ON CONFLICT (id) DO NOTHING;

-- ============================
-- 📰 SEED — NEWS
-- ============================
INSERT INTO public.news (id, slug, title, excerpt, content, image, published_at, author_id, topic_id)
VALUES
('9d4a3f43-40b4-47a2-863b-9c6dd5c6af43', 'peptides-regeneration-cellulaire', 'Des peptides capables de stimuler la régénération cellulaire', 'De nouveaux peptides bioactifs montrent un fort potentiel pour la réparation des tissus endommagés.', 'Ces peptides biomimétiques pourraient transformer la médecine régénérative et favoriser la cicatrisation avancée.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/des-peptides-capables-de-stimuler-la-regeneration-cellulaire-1761755829537/news-des-peptides-capables-de-stimuler-la-regeneration-cellulaire-1761755829537.png', NOW(), NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),
('a2bab8fc-943b-4b32-acb9-044d54828014', 'ia-decouverte-peptides-therapeutiques', 'L’intelligence artificielle accélère la découverte de peptides thérapeutiques', 'L’IA révolutionne la recherche en identifiant des séquences peptidiques prometteuses en un temps record.', 'En combinant modélisation moléculaire et machine learning, les chercheurs découvrent plus rapidement de nouveaux candidats thérapeutiques.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/l-intelligence-artificielle-accelere-la-decouverte-de-peptides-therapeutiques-1761755758519/news-l-intelligence-artificielle-accelere-la-decouverte-de-peptides-therapeutiques-1761755758519.png', NOW(), NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),
('facb0cb2-d70d-4fcb-a0b2-04466bfb9904', 'avancee-peptides-synthetiques', 'Une avancée majeure dans la conception de peptides synthétiques', 'Des chercheurs développent de nouveaux peptides plus stables et efficaces pour la recherche biomédicale.', 'Cette innovation ouvre la voie à des peptides de nouvelle génération capables de résister à la dégradation et d’améliorer la précision thérapeutique.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/une-avancee-majeure-dans-la-conception-de-peptides-synthetiques-1761755661276/news-une-avancee-majeure-dans-la-conception-de-peptides-synthetiques-1761755661276.png', NOW(), NULL, '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'),
('62d44c97-953f-4dee-8752-9eb287afb017', 'marche-peptides-2025', 'Le marché mondial des peptides atteint un nouveau record en 2025', 'Le secteur des peptides connaît une croissance sans précédent, portée par la demande pharmaceutique et cosmétique.', 'L’essor de la biotechnologie et des traitements personnalisés stimule fortement le marché international des peptides.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/le-marche-mondial-des-peptides-atteint-un-nouveau-record-en-2025-1761755894429/news-le-marche-mondial-des-peptides-atteint-un-nouveau-record-en-2025-1761755894429.png', NOW(), NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),
('67170960-eef3-4ead-b88c-f6ebed45be0f', 'startups-biotech-peptides', 'Les startups biotechs se tournent vers les peptides de nouvelle génération', 'Un nombre croissant de jeunes entreprises investissent dans la recherche et la production de peptides innovants.', 'Ces nouvelles sociétés combinent IA, automatisation et biologie synthétique pour créer des peptides plus performants.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/les-startups-biotechs-se-tournent-vers-les-peptides-de-nouvelle-generation-1761755973847/news-les-startups-biotechs-se-tournent-vers-les-peptides-de-nouvelle-generation-1761755973847.png', NOW(), NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),
('2474f359-cf06-494a-887d-60cd534e95be', 'economie-des-peptides', 'L’économie des peptides : un pilier de la biotechnologie moderne', 'Les peptides deviennent un acteur économique clé dans le développement pharmaceutique et nutritionnel.', 'Entre investissement public et privé, le marché des peptides se positionne comme une source d’innovation durable.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/l-economie-des-peptides-un-pilier-de-la-biotechnologie-moderne-1761756061388/news-l-economie-des-peptides-un-pilier-de-la-biotechnologie-moderne-1761756061388.png', NOW(), NULL, 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'),
('47080cad-079c-450a-a8e4-544a58e57010', 'harmonisation-normes-peptides', 'Vers une harmonisation mondiale des normes sur les peptides', 'Les agences de régulation cherchent à unifier les standards internationaux pour les peptides.', 'Une meilleure coopération entre autorités permettra de faciliter les essais cliniques et la commercialisation globale.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/vers-une-harmonisation-mondiale-des-normes-sur-les-peptides-1761756968952/news-vers-une-harmonisation-mondiale-des-normes-sur-les-peptides-1761756968952.png', NOW(), NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),
('4ff13258-7338-4de2-8ed9-7c9b8ff85368', 'directives-europeennes-peptides', 'Nouvelles directives européennes sur les peptides en recherche', 'L’Union européenne renforce la réglementation sur la production et l’utilisation des peptides.', 'Ces nouvelles règles visent à assurer la traçabilité et la sécurité dans la recherche scientifique et médicale.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/nouvelles-directives-europeennes-sur-les-peptides-en-recherche-1761756981526/news-nouvelles-directives-europeennes-sur-les-peptides-en-recherche-1761756981526.png', NOW(), NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),
('a1178be8-e547-4a28-8677-07404bcc5f67', 'controle-peptides-recherche', 'Contrôle renforcé sur les peptides destinés à la recherche', 'Les autorités mettent en place de nouveaux protocoles de contrôle pour les peptides de laboratoire.', 'L’objectif est de prévenir les abus et d’assurer la conformité aux bonnes pratiques scientifiques.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/controle-renforce-sur-les-peptides-destines-a-la-recherche-1761757065279/news-controle-renforce-sur-les-peptides-destines-a-la-recherche-1761757065279.png', NOW(), NULL, 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'),
('9c165271-a61d-4ff2-aba5-061289cdff3c', 'peptides-recuperation-musculaire', 'Les peptides révolutionnent la récupération musculaire', 'De nouvelles études montrent que certains peptides favorisent la réparation rapide des fibres musculaires après l’effort.', 'Ces composés naturels stimulent la régénération tissulaire et optimisent la récupération sportive.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/les-peptides-revolutionnent-la-recuperation-musculaire-1761757146896/news-les-peptides-revolutionnent-la-recuperation-musculaire-1761757146896.png', NOW(), NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),
('a76da968-bc21-4122-ba61-f11e69f1af78', 'peptides-performance-physique', 'Le rôle des peptides dans la performance physique', 'Les peptides bioactifs améliorent la force, l’endurance et la récupération musculaire.', 'Une nouvelle génération de peptides naturels offre un soutien métabolique inédit pour les athlètes.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/le-role-des-peptides-dans-la-performance-physique-1761757260028/news-le-role-des-peptides-dans-la-performance-physique-1761757260028.png', NOW(), NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),
('22c306ec-1546-4a72-96c1-52bca32d29fe', 'peptides-metabolisme-performance', 'Peptides et métabolisme : une approche biochimique de la performance', 'Les recherches explorent comment les peptides régulent l’énergie et le métabolisme musculaire.', 'Ces découvertes pourraient transformer les approches nutritionnelles du sport de haut niveau.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-et-metabolisme-une-approche-biochimique-de-la-performance-1761757342295/news-peptides-et-metabolisme-une-approche-biochimique-de-la-performance-1761757342295.png', NOW(), NULL, 'b24c81ab-d24d-4860-91f7-faabad0892f7'),
('78f05eef-ae13-479a-944c-88928052bfab', 'peptides-cosmetique-regeneratrice', 'Les peptides au cœur de la nouvelle cosmétique régénératrice', 'Les laboratoires misent sur les peptides pour stimuler la production naturelle de collagène.', 'Ces formules peptidiques promettent une peau plus ferme, plus lisse et visiblement rajeunie.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/les-peptides-au-c-ur-de-la-nouvelle-cosmetique-regeneratrice-1761757413848/news-les-peptides-au-c-ur-de-la-nouvelle-cosmetique-regeneratrice-1761757413848.png', NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91'),
('a7848dff-911e-41e8-beb2-559aaf5d7263', 'peptides-soins-peau', 'Peptides et soins de la peau : la science du rajeunissement', 'Les peptides deviennent un ingrédient clé dans les crèmes anti-âge de nouvelle génération.', 'En agissant directement sur les cellules cutanées, ils restaurent l’élasticité et l’éclat du visage.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-et-soins-de-la-peau-la-science-du-rajeunissement-1761757489202/news-peptides-et-soins-de-la-peau-la-science-du-rajeunissement-1761757489202.png', NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91'),
('1584153b-0144-484b-91a9-6abf00d53e35', 'biotechnologie-bien-etre-cutane', 'La biotechnologie au service du bien-être cutané', 'Les innovations en biotechnologie cosmétique exploitent les peptides pour une peau plus saine.', 'Ces avancées associent nature et science pour une approche durable et efficace du soin de la peau.', 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/la-biotechnologie-au-service-du-bien-etre-cutane-1761757555625/news-la-biotechnologie-au-service-du-bien-etre-cutane-1761757555625.png', NOW(), NULL, '82334ce4-0fcd-4947-9aa8-1bb16da64d91')
ON CONFLICT (id) DO NOTHING;