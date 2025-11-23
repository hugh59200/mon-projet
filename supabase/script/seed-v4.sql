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
-- 📦 SEED — PRODUCTS (CHEMINS IMAGES CORRIGÉS)
-- ============================
INSERT INTO public.products (name, dosage, category, price, sale_price, is_on_sale, stock, purity, image, description, tags)
VALUES
-- 1. BPC-157
('BPC-157', '10mg', 'Récupération', 40.00, 36.00, true, 10, 99.00,
 '/src/assets/products/bpc-157/10mg/bpc-157-10mg.png',
 'Peptide de protection corporelle, favorise la guérison des tissus mous.',
 '{"recuperation", "articulations", "99%"}'),

-- 2. TB-500
('TB-500', '5mg', 'Récupération', 45.00, 40.50, true, 10, 99.00,
 '/src/assets/products/tb-500/5mg/tb-500-5mg.png',
 'Thymosin Beta-4 synthétique pour la réparation cellulaire et la souplesse.',
 '{"recuperation", "souplesse", "99%"}'),

-- 3. Semaglutide
('Semaglutide', '10mg', 'Perte de poids', 75.00, 67.50, true, 10, 99.00,
 '/src/assets/products/semaglutide/10mg/semaglutide-10mg.png',
 'Agoniste GLP-1 puissant pour la gestion du poids et le contrôle de l’appétit.',
 '{"minceur", "metabolisme", "99%"}'),

-- 4. Tirzepatide
('Tirzepatide', '10mg', 'Perte de poids', 85.00, 76.50, true, 10, 99.00,
 '/src/assets/products/tirzepatide/10mg/tirzepatide-10mg.png',
 'Double agoniste GLP-1/GIP pour une efficacité maximale sur la perte de poids.',
 '{"minceur", "avancé", "99%"}'),

-- 5. Retatrutide
('Retatrutide', '10mg', 'Perte de poids', 60.00, 54.00, true, 10, 99.00,
 '/src/assets/products/retatrutide/10mg/retatrutide-10mg.png',
 'Agoniste multiple nouvelle génération pour le métabolisme.',
 '{"metabolisme", "perte-de-poids", "99%"}'),

-- 6. CJC-1295 DAC
('CJC-1295 DAC', '5mg', 'Croissance', 42.00, 37.80, true, 10, 98.50,
 '/src/assets/products/cjc-1295-dac/5mg/cjc-1295-dac-5mg.png',
 'Stimulant de l’hormone de croissance à longue durée d’action.',
 '{"croissance", "masse", "98.5%"}'),

-- 7. GHRP-6
('GHRP-6', '10mg', 'Croissance', 32.00, 28.80, true, 10, 99.00,
 '/src/assets/products/ghrp-6/10mg/ghrp-6-10mg.png',
 'Peptide libérant l’hormone de croissance et stimulant l’appétit.',
 '{"croissance", "appetit", "99%"}'),

-- 8. Hexarelin
('Hexarelin', '5mg', 'Croissance', 38.00, 34.20, true, 10, 99.00,
 '/src/assets/products/hexarelin/5mg/hexarelin-5mg.png',
 'Secrétagogue puissant de l’hormone de croissance.',
 '{"croissance", "force", "99%"}'),

-- 9. Sermorelin
('Sermorelin', '5mg', 'Anti-âge', 35.00, 31.50, true, 10, 99.00,
 '/src/assets/products/sermorelin/5mg/sermorelin-5mg.png',
 'Analogue de la GHRH pour le bien-être et la qualité du sommeil.',
 '{"anti-age", "sommeil", "99%"}'),

-- 10. PEG-MGF
('PEG-MGF', '2mg', 'Performance', 40.00, 36.00, true, 10, 98.00,
 '/src/assets/products/peg-mgf/2mg/peg-mgf-2mg.png',
 'Facteur de croissance mécanique pégylé pour le développement musculaire local.',
 '{"muscle", "récupération", "98%"}'),

-- 11. Melanotan 2
('Melanotan 2', '10mg', 'Bien-être', 35.00, 31.50, true, 10, 99.00,
 '/src/assets/products/melanothan-2/10mg/Melanotan 2-10mg.png',
 'Peptide stimulant le bronzage et la libido.',
 '{"bronzage", "libido", "99%"}'),

-- 12. PT-141
('PT-141', '10mg', 'Bien-être', 45.00, 40.50, true, 10, 99.00,
 '/src/assets/products/pt-141/10mg/pt-141-10mg.png',
 'Bremelanotide, efficace pour la libido masculine et féminine.',
 '{"libido", "sexualité", "99%"}'),

-- 13. Kisspeptine-10
('Kisspeptine-10', '10mg', 'Hormonal', 38.00, 34.20, true, 10, 99.00,
 '/src/assets/products/kisspeptine/10mg/kisspeptine-10-10mg.png',
 'Régulateur de la sécrétion de gonadotrophines.',
 '{"hormonal", "equilibre", "99%"}'),

-- 14. Selank
('Selank', '5mg', 'Nootropique', 30.00, 27.00, true, 10, 99.00,
 '/src/assets/products/selank/5mg/selank-5mg.png',
 'Peptide anxiolytique et nootropique pour la gestion du stress.',
 '{"anti-stress", "nootropique", "99%"}'),

-- 15. Semax
('Semax', '5mg', 'Nootropique', 30.00, 27.00, true, 10, 99.00,
 '/src/assets/products/semax/5mg/semax-5mg.png',
 'Améliore les fonctions cognitives, la concentration et la mémoire.',
 '{"focus", "memoire", "99%"}'),

-- 16. GHK-Cu
('GHK-Cu', '100mg', 'Cosmétique', 55.00, 49.50, true, 10, 99.00,
 '/src/assets/products/ghk-cu/100mg/ghk-cu-100mg.png',
 'Peptide de cuivre pour la régénération de la peau et des cheveux.',
 '{"peau", "cheveux", "anti-age", "99%"}'),

-- 17. NAD+
('NAD+', '500mg', 'Anti-âge', 48.00, 43.20, true, 10, 98.00,
 '/src/assets/products/nad+/500mg/nad+-500mg.png',
 'Coenzyme essentielle pour l’énergie cellulaire et la longévité.',
 '{"energie", "longevite", "98%"}'),

-- 18. Thymosin Alpha-1
('Thymosin Alpha-1', '5mg', 'Santé', 52.00, 46.80, true, 10, 99.00,
 '/src/assets/products/thymosin-alpha/5mg/thymosin Alpha-1-5mg.png',
 'Modulateur immunitaire pour renforcer les défenses naturelles.',
 '{"immunite", "sante", "99%"}')

ON CONFLICT (name, dosage) DO UPDATE SET
  stock = EXCLUDED.stock,
  price = EXCLUDED.price,
  sale_price = EXCLUDED.sale_price,
  is_on_sale = EXCLUDED.is_on_sale,
  image = EXCLUDED.image;

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