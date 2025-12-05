const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://dwomsbawthlktapmtmqu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY non définie')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const newsArticles9 = [
  // Article 7 : TB-500 et BPC-157 synergie
  {
    id: '47080cad-079c-450a-a8e4-544a58e57010',
    slug: 'tb500-bpc157-synergie-recuperation',
    title: 'TB-500 et BPC-157 : pourquoi les chercheurs étudient leur synergie',
    title_i18n: { en: 'TB-500 and BPC-157: why researchers are studying their synergy' },
    excerpt: 'Ces deux peptides activent des voies biologiques complémentaires. Une revue systématique 2025 fait le point sur les études précliniques.',
    excerpt_i18n: { en: 'These two peptides activate complementary biological pathways. A 2025 systematic review summarizes preclinical studies.' },
    content: `Le TB-500 (fragment de la Thymosine Beta-4) et le BPC-157 (Body Protection Compound) sont deux peptides qui suscitent un intérêt croissant dans la recherche sur la réparation tissulaire.

MÉCANISMES D'ACTION COMPLÉMENTAIRES

Le BPC-157, isolé du suc gastrique humain, favoriserait :
- L'activité des fibroblastes
- La synthèse de collagène
- L'angiogenèse via la voie VEGFR2-Akt-eNOS

Le TB-500, peptide synthétique dérivé de la thymosine β4, agirait sur :
- La différenciation des cellules progénitrices
- La croissance vasculaire
- La migration cellulaire

CE QUE DIT LA RECHERCHE

Une revue systématique publiée en 2025 dans PMC a analysé 36 études (1993-2024) sur le BPC-157. Les modèles animaux montrent une amélioration de la cicatrisation des muscles, tendons, ligaments et os.

Une étude humaine préliminaire rapporte que 7 patients sur 12 souffrant de douleurs chroniques au genou ont ressenti un soulagement pendant plus de 6 mois après une injection de BPC-157.

LIMITES IMPORTANTES

Ces peptides ne sont pas approuvés par la FDA pour usage thérapeutique. En 2023, le BPC-157 a été classé "Category 2", signifiant qu'il ne peut être préparé par les pharmacies de préparation commerciales.

Les études humaines de grande envergure font encore défaut. Ces composés restent des outils de recherche, non des traitements validés.`,
    content_i18n: { en: `TB-500 (a fragment of Thymosin Beta-4) and BPC-157 (Body Protection Compound) are two peptides that are generating growing interest in tissue repair research.

COMPLEMENTARY MECHANISMS OF ACTION

BPC-157, isolated from human gastric juice, is thought to promote:
- Fibroblast activity
- Collagen synthesis
- Angiogenesis via the VEGFR2-Akt-eNOS pathway

TB-500, a synthetic peptide derived from thymosin β4, is thought to act on:
- Progenitor cell differentiation
- Vascular growth
- Cell migration

WHAT THE RESEARCH SAYS

A systematic review published in 2025 in PMC analyzed 36 studies (1993-2024) on BPC-157. Animal models show improved healing of muscles, tendons, ligaments and bones.

A preliminary human study reports that 7 out of 12 patients with chronic knee pain experienced relief for more than 6 months after a BPC-157 injection.

IMPORTANT LIMITATIONS

These peptides are not FDA-approved for therapeutic use. In 2023, BPC-157 was classified as "Category 2," meaning it cannot be prepared by commercial compounding pharmacies.

Large-scale human studies are still lacking. These compounds remain research tools, not validated treatments.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/tb500-bpc157-synergie.png',
    published_at: '2025-01-28T09:00:00Z',
    author_id: null,
    topic_id: 'b24c81ab-d24d-4860-91f7-faabad0892f7'
  },
  // Article 8 : Collagène récupération sportive
  {
    id: '4ff13258-7338-4de2-8ed9-7c9b8ff85368',
    slug: 'collagene-peptides-recuperation-sportive-2024',
    title: 'Peptides de collagène : l\'étude 2024 sur la récupération sportive',
    title_i18n: { en: 'Collagen peptides: the 2024 study on sports recovery' },
    excerpt: 'Une étude randomisée contrôlée montre que 15g de peptides de collagène par jour réduisent les marqueurs de stress musculaire après l\'effort.',
    excerpt_i18n: { en: 'A randomized controlled study shows that 15g of collagen peptides per day reduce muscle stress markers after exercise.' },
    content: `Une étude publiée dans Frontiers in Nutrition en 2024 (Bischof et al.) apporte de nouvelles données sur l'intérêt des peptides de collagène dans la récupération sportive.

PROTOCOLE DE L'ÉTUDE

Les chercheurs ont suivi des athlètes pendant 12 semaines :
- Groupe supplémenté : 15g de peptides de collagène/jour
- Groupe placebo : substance inactive
- Mesure des marqueurs de stress musculaire après exercice intense

RÉSULTATS PRINCIPAUX

Le groupe supplémenté présentait des niveaux plus bas de marqueurs de stress systémique après les dommages musculaires induits par l'exercice.

Une étude antérieure sur l'hydrolysat de whey avait montré :
- Niveaux de créatine kinase (CK) plus bas à 48h
- Meilleur indice de force réactive
- Flexibilité accrue

POIDS MOLÉCULAIRE : UN FACTEUR CLÉ

Les peptides de collagène de faible poids moléculaire présentent de meilleures propriétés pharmacocinétiques. Les peptides plus petits sont absorbés plus efficacement.

APPLICATIONS PRATIQUES

Ces résultats suggèrent un intérêt potentiel pour :
- Les athlètes en phase de récupération intensive
- Les protocoles de rééducation
- La prévention des blessures récurrentes`,
    content_i18n: { en: `A study published in Frontiers in Nutrition in 2024 (Bischof et al.) provides new data on the value of collagen peptides in sports recovery.

STUDY PROTOCOL

Researchers followed athletes for 12 weeks:
- Supplemented group: 15g of collagen peptides/day
- Placebo group: inactive substance
- Measurement of muscle stress markers after intense exercise

MAIN RESULTS

The supplemented group had lower levels of systemic stress markers after exercise-induced muscle damage.

A previous study on whey hydrolysate had shown:
- Lower creatine kinase (CK) levels at 48h
- Better reactive strength index
- Increased flexibility

MOLECULAR WEIGHT: A KEY FACTOR

Low molecular weight collagen peptides have better pharmacokinetic properties. Smaller peptides are absorbed more efficiently.

PRACTICAL APPLICATIONS

These results suggest potential value for:
- Athletes in intensive recovery phases
- Rehabilitation protocols
- Prevention of recurring injuries` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/collagene-recuperation-sport.png',
    published_at: '2025-02-05T11:30:00Z',
    author_id: null,
    topic_id: 'b24c81ab-d24d-4860-91f7-faabad0892f7'
  },
  // Article 9 : Revue systématique 2025
  {
    id: 'a1178be8-e547-4a28-8677-07404bcc5f67',
    slug: 'peptides-medecine-sport-revue-2025',
    title: 'Peptides thérapeutiques en médecine du sport : la revue systématique 2025',
    title_i18n: { en: 'Therapeutic peptides in sports medicine: the 2025 systematic review' },
    excerpt: '36 études analysées de 1993 à 2024. Les chercheurs font le point sur ce que la science sait vraiment des peptides injectables.',
    excerpt_i18n: { en: '36 studies analyzed from 1993 to 2024. Researchers take stock of what science really knows about injectable peptides.' },
    content: `Une revue systématique publiée dans Arthroscopy Journal en 2025 analyse l'état des connaissances sur les peptides thérapeutiques injectables en médecine du sport.

CONTEXTE

Les athlètes de haut niveau et les bodybuilders recherchent constamment de nouvelles thérapies pour améliorer la récupération. Les peptides injectables représentent une tendance émergente dans la recherche en médecine régénérative.

MÉTHODOLOGIE

Les chercheurs ont analysé 36 études publiées entre 1993 et 2024, couvrant principalement :
- Le BPC-157
- Le TB-500
- D'autres peptides régénératifs

CONCLUSIONS PRINCIPALES

Les études précliniques (animaux) montrent que le BPC-157 :
- Favorise la cicatrisation en stimulant les facteurs de croissance
- Réduit l'inflammation
- Améliore les résultats dans les modèles de blessures musculaires, tendineuses, ligamentaires et osseuses

LIMITES MAJEURES

1. Absence d'essais cliniques de grande envergure chez l'humain
2. Profil de sécurité à long terme inconnu
3. Aucun événement indésirable aigu (<6 semaines) rapporté dans les modèles animaux

RECOMMANDATIONS DES AUTEURS

"En raison des preuves cliniques de haute qualité limitées, les cliniciens et les athlètes doivent faire preuve de prudence lorsqu'ils envisagent l'utilisation du BPC-157."`,
    content_i18n: { en: `A systematic review published in Arthroscopy Journal in 2025 analyzes the state of knowledge on injectable therapeutic peptides in sports medicine.

BACKGROUND

High-level athletes and bodybuilders are constantly seeking new therapies to improve recovery. Injectable peptides represent an emerging trend in regenerative medicine research.

METHODOLOGY

Researchers analyzed 36 studies published between 1993 and 2024, mainly covering:
- BPC-157
- TB-500
- Other regenerative peptides

MAIN CONCLUSIONS

Preclinical studies (animals) show that BPC-157:
- Promotes healing by stimulating growth factors
- Reduces inflammation
- Improves outcomes in muscle, tendon, ligament and bone injury models

MAJOR LIMITATIONS

1. Lack of large-scale human clinical trials
2. Unknown long-term safety profile
3. No acute adverse events (<6 weeks) reported in animal models

AUTHORS' RECOMMENDATIONS

"Due to limited high-quality clinical evidence, clinicians and athletes should exercise caution when considering BPC-157 use."` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-medecine-sport.png',
    published_at: '2025-02-18T14:00:00Z',
    author_id: null,
    topic_id: 'b24c81ab-d24d-4860-91f7-faabad0892f7'
  },
  // Article 10 : GHK-Cu
  {
    id: '9c165271-a61d-4ff2-aba5-061289cdff3c',
    slug: 'ghk-cu-peptide-cuivre-anti-age',
    title: 'GHK-Cu : le peptide de cuivre star des sérums anti-âge',
    title_i18n: { en: 'GHK-Cu: the copper peptide star of anti-aging serums' },
    excerpt: 'Stimulation du collagène, cicatrisation, antioxydant : pourquoi ce peptide est devenu incontournable dans les formulations cosmétiques premium.',
    excerpt_i18n: { en: 'Collagen stimulation, healing, antioxidant: why this peptide has become essential in premium cosmetic formulations.' },
    content: `Le GHK-Cu (glycyl-L-histidyl-L-lysine-cuivre) est l'un des peptides les plus étudiés et les plus utilisés en cosmétique anti-âge.

QU'EST-CE QUE LE GHK-Cu ?

Découvert dans les années 1970, ce tripeptide naturellement présent dans le plasma humain possède une forte affinité pour le cuivre. Sa concentration diminue avec l'âge : de 200 ng/mL à 20 ans à 80 ng/mL à 60 ans.

MÉCANISMES D'ACTION DOCUMENTÉS

Les études montrent que le GHK-Cu :
- Stimule la production de collagène et d'élastine
- Favorise la cicatrisation et le renouvellement cutané
- Offre une protection antioxydante
- Améliore la fermeté et la clarté de la peau
- Réduit les ridules et les dommages photo-induits

TENDANCES 2024

Selon une revue publiée dans PMC en 2025, les peptides ont pris une place centrale dans les formulations skincare. Le GHK-Cu se retrouve désormais dans :
- Les sérums anti-âge premium
- Les crèmes réparatrices post-acte
- Les soins contour des yeux

CONSEILS D'UTILISATION

Les peptides ne sont pas compatibles avec tous les ingrédients. Les acides (AHA, BHA) peuvent briser les liaisons peptidiques. Recommandation : utiliser les acides le matin, les peptides le soir.`,
    content_i18n: { en: `GHK-Cu (glycyl-L-histidyl-L-lysine-copper) is one of the most studied and widely used peptides in anti-aging cosmetics.

WHAT IS GHK-Cu?

Discovered in the 1970s, this tripeptide naturally present in human plasma has a strong affinity for copper. Its concentration decreases with age: from 200 ng/mL at age 20 to 80 ng/mL at age 60.

DOCUMENTED MECHANISMS OF ACTION

Studies show that GHK-Cu:
- Stimulates collagen and elastin production
- Promotes healing and skin renewal
- Offers antioxidant protection
- Improves skin firmness and clarity
- Reduces fine lines and photo-induced damage

2024 TRENDS

According to a review published in PMC in 2025, peptides have taken center stage in skincare formulations. GHK-Cu is now found in:
- Premium anti-aging serums
- Post-procedure repair creams
- Eye contour treatments

USAGE TIPS

Peptides are not compatible with all ingredients. Acids (AHA, BHA) can break peptide bonds. Recommendation: use acids in the morning, peptides in the evening.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/ghk-cu-peptide-cuivre.png',
    published_at: '2025-03-05T10:00:00Z',
    author_id: null,
    topic_id: '82334ce4-0fcd-4947-9aa8-1bb16da64d91'
  },
  // Article 11 : Collagène oral
  {
    id: 'a76da968-bc21-4122-ba61-f11e69f1af78',
    slug: 'collagene-oral-efficacite-rides-etude',
    title: 'Collagène oral : efficacité prouvée sur les rides en 6 semaines',
    title_i18n: { en: 'Oral collagen: proven effectiveness on wrinkles in 6 weeks' },
    excerpt: 'Un essai clinique randomisé en double aveugle confirme l\'amélioration de l\'hydratation cutanée et la réduction des rides avec les peptides de collagène.',
    excerpt_i18n: { en: 'A randomized double-blind clinical trial confirms improved skin hydration and wrinkle reduction with collagen peptides.' },
    content: `Une étude publiée dans MDPI Cosmetics en 2024 apporte des preuves cliniques solides sur l'efficacité des peptides de collagène par voie orale.

DESIGN DE L'ÉTUDE

- Type : essai randomisé, double aveugle, contrôlé par placebo
- Durée : 6 semaines
- Substance testée : peptides de collagène de faible poids moléculaire
- Paramètres mesurés : rides faciales, hydratation cutanée

RÉSULTATS

Les participants du groupe collagène ont montré :
- Une réduction significative des rides faciales
- Une amélioration mesurable de l'hydratation de la peau
- Des effets visibles dès 6 semaines de supplémentation

POURQUOI LE POIDS MOLÉCULAIRE COMPTE

Les peptides de collagène de faible poids moléculaire (<3000 Da) sont mieux absorbés par l'intestin et atteignent plus efficacement les couches profondes de la peau.

CONTEXTE DU MARCHÉ

Les suppléments de collagène représentent un marché en pleine expansion. On les trouve sous forme de poudres, boissons "beauty drinks", gélules et comprimés.

Avec l'âge, les niveaux de collagène chutent drastiquement : à 70 ans, ils ne représentent plus que 40% des niveaux initiaux.`,
    content_i18n: { en: `A study published in MDPI Cosmetics in 2024 provides solid clinical evidence on the effectiveness of oral collagen peptides.

STUDY DESIGN

- Type: randomized, double-blind, placebo-controlled trial
- Duration: 6 weeks
- Substance tested: low molecular weight collagen peptides
- Parameters measured: facial wrinkles, skin hydration

RESULTS

Participants in the collagen group showed:
- Significant reduction in facial wrinkles
- Measurable improvement in skin hydration
- Visible effects from 6 weeks of supplementation

WHY MOLECULAR WEIGHT MATTERS

Low molecular weight collagen peptides (<3000 Da) are better absorbed by the intestine and more effectively reach the deep layers of the skin.

MARKET CONTEXT

Collagen supplements represent a rapidly expanding market. They are available as powders, beauty drinks, capsules and tablets.

With age, collagen levels drop drastically: at 70, they represent only 40% of initial levels.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/collagene-oral-rides.png',
    published_at: '2025-03-20T09:30:00Z',
    author_id: null,
    topic_id: '82334ce4-0fcd-4947-9aa8-1bb16da64d91'
  },
  // Article 12 : FDA Category 2
  {
    id: '22c306ec-1546-4a72-96c1-52bca32d29fe',
    slug: 'fda-bpc157-category-2-reglementation',
    title: 'FDA et BPC-157 : comprendre la classification "Category 2"',
    title_i18n: { en: 'FDA and BPC-157: understanding the "Category 2" classification' },
    excerpt: 'En 2023, la FDA a classé le BPC-157 en catégorie 2. Ce que cette décision signifie pour les chercheurs, les fournisseurs et les utilisateurs.',
    excerpt_i18n: { en: 'In 2023, the FDA classified BPC-157 as Category 2. What this decision means for researchers, suppliers, and users.' },
    content: `En 2023, la Food and Drug Administration (FDA) américaine a pris une décision importante concernant le BPC-157 en le classant comme "Category 2 bulk drug substance".

QUE SIGNIFIE "CATEGORY 2" ?

Cette classification indique que :
1. Le BPC-157 ne peut PAS être préparé par les pharmacies de préparation commerciales
2. Il n'existe pas suffisamment de preuves pour déterminer s'il pourrait causer des dommages chez l'humain
3. Le peptide n'est pas approuvé comme médicament

CE QUI RESTE LÉGAL

Malgré cette classification, de nombreux produits BPC-157 sont légalement vendus comme :
- "Produits chimiques de recherche" (research chemicals)
- "Compléments alimentaires" (dietary supplements)

Ces catégories ne sont pas soumises aux mêmes réglementations que les médicaments.

IMPLICATIONS PRATIQUES

Pour les chercheurs : le BPC-157 reste accessible pour la recherche in vitro et préclinique.

Pour les fournisseurs : la vente est possible sous réserve d'un étiquetage clair "à des fins de recherche uniquement".

Pour les consommateurs : la prudence est de mise. L'absence d'approbation signifie l'absence de garanties sur la sécurité et l'efficacité.`,
    content_i18n: { en: `In 2023, the U.S. Food and Drug Administration (FDA) made an important decision regarding BPC-157 by classifying it as a "Category 2 bulk drug substance."

WHAT DOES "CATEGORY 2" MEAN?

This classification indicates that:
1. BPC-157 CANNOT be prepared by commercial compounding pharmacies
2. There is insufficient evidence to determine whether it could cause harm in humans
3. The peptide is not approved as a drug

WHAT REMAINS LEGAL

Despite this classification, many BPC-157 products are legally sold as:
- "Research chemicals"
- "Dietary supplements"

These categories are not subject to the same regulations as drugs.

PRACTICAL IMPLICATIONS

For researchers: BPC-157 remains accessible for in vitro and preclinical research.

For suppliers: sale is possible subject to clear labeling "for research purposes only."

For consumers: caution is advised. Lack of approval means lack of guarantees on safety and efficacy.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/fda-bpc157-category2.png',
    published_at: '2025-04-01T08:00:00Z',
    author_id: null,
    topic_id: 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'
  },
  // Article 13 : AMA antidopage
  {
    id: '78f05eef-ae13-479a-944c-88928052bfab',
    slug: 'peptides-sport-regles-ama-antidopage',
    title: 'Peptides et sport professionnel : les règles antidopage de l\'AMA',
    title_i18n: { en: 'Peptides and professional sports: WADA anti-doping rules' },
    excerpt: 'Certains peptides sont interdits en compétition par l\'Agence Mondiale Antidopage. Le point sur la réglementation 2024.',
    excerpt_i18n: { en: 'Certain peptides are banned in competition by the World Anti-Doping Agency. An overview of 2024 regulations.' },
    content: `L'Agence Mondiale Antidopage (AMA/WADA) maintient une liste stricte des substances interdites en compétition sportive. Plusieurs peptides y figurent.

PEPTIDES INTERDITS PAR L'AMA

La liste des substances interdites inclut notamment :
- Les hormones de croissance et leurs facteurs de libération
- Les peptides mimétiques de l'EPO
- Certains facteurs de croissance (IGF-1, MGF, etc.)
- Les modulateurs métaboliques

STATUT DU BPC-157

Le BPC-157 n'est pas explicitement nommé sur la liste de l'AMA. Cependant, son utilisation pose des questions :
- Il pourrait être considéré comme "méthode interdite" s'il améliore la récupération
- Son statut reste ambigu selon les fédérations

RISQUES POUR LES ATHLÈTES

1. Détection : les méthodes de détection évoluent constamment
2. Contamination : les produits non réglementés peuvent contenir des substances interdites
3. Sanctions : les violations peuvent entraîner des suspensions de 2 à 4 ans

RECOMMANDATIONS

Pour les athlètes professionnels :
- Vérifier systématiquement le statut de toute substance sur le site de l'AMA
- Consulter les autorités antidopage nationales
- En cas de doute, s'abstenir`,
    content_i18n: { en: `The World Anti-Doping Agency (WADA) maintains a strict list of substances prohibited in sports competition. Several peptides are included.

PEPTIDES BANNED BY WADA

The list of prohibited substances notably includes:
- Growth hormones and their releasing factors
- EPO mimetic peptides
- Certain growth factors (IGF-1, MGF, etc.)
- Metabolic modulators

BPC-157 STATUS

BPC-157 is not explicitly named on the WADA list. However, its use raises questions:
- It could be considered a "prohibited method" if it enhances recovery
- Its status remains ambiguous depending on federations

RISKS FOR ATHLETES

1. Detection: detection methods are constantly evolving
2. Contamination: unregulated products may contain prohibited substances
3. Sanctions: violations can result in 2 to 4 year suspensions

RECOMMENDATIONS

For professional athletes:
- Systematically check the status of any substance on the WADA website
- Consult national anti-doping authorities
- When in doubt, abstain` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/peptides-sport-ama.png',
    published_at: '2025-04-15T15:00:00Z',
    author_id: null,
    topic_id: 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'
  },
  // Article 14 : GLP-1 cerveau
  {
    id: 'a7848dff-911e-41e8-beb2-559aaf5d7263',
    slug: 'glp1-cerveau-decouverte-2024-ut-southwestern',
    title: 'Découverte 2024 : comment le GLP-1 agit dans le cerveau',
    title_i18n: { en: '2024 Discovery: how GLP-1 acts in the brain' },
    excerpt: 'Des chercheurs de UT Southwestern ont identifié les neurones ciblés par le sémaglutide. Une avancée majeure.',
    excerpt_i18n: { en: 'UT Southwestern researchers have identified the neurons targeted by semaglutide. A major advance.' },
    content: `Une équipe de chercheurs du UT Southwestern Medical Center a publié en août 2024 dans la revue Science une découverte majeure sur le mécanisme d'action des médicaments GLP-1.

LA DÉCOUVERTE

Les scientifiques ont identifié un sous-ensemble spécifique de cellules cérébrales dont l'activation serait partiellement responsable des effets des médicaments de perte de poids comme le sémaglutide (Ozempic, Wegovy).

POURQUOI C'EST IMPORTANT

Jusqu'à présent, le mécanisme précis par lequel les agonistes GLP-1 induisent la perte de poids n'était pas entièrement compris. On savait qu'ils :
- Ralentissent la vidange gastrique
- Réduisent l'appétit
- Agissent sur le pancréas

Cette découverte révèle un mécanisme central (cérébral) qui explique l'efficacité remarquable de ces traitements.

IMPLICATIONS POUR LA RECHERCHE

Ces résultats pourraient permettre :
- D'optimiser l'efficacité des médicaments existants
- De développer des molécules plus ciblées
- De réduire potentiellement les effets secondaires

CONTEXTE

Les médicaments GLP-1 représentent une révolution thérapeutique. Le sémaglutide a généré plus de 20 milliards de dollars de ventes en 2024.`,
    content_i18n: { en: `A team of researchers from UT Southwestern Medical Center published a major discovery in August 2024 in the journal Science on the mechanism of action of GLP-1 drugs.

THE DISCOVERY

Scientists identified a specific subset of brain cells whose activation would be partially responsible for the effects of weight loss drugs like semaglutide (Ozempic, Wegovy).

WHY IT MATTERS

Until now, the precise mechanism by which GLP-1 agonists induce weight loss was not fully understood. It was known that they:
- Slow gastric emptying
- Reduce appetite
- Act on the pancreas

This discovery reveals a central (brain) mechanism that explains the remarkable effectiveness of these treatments.

IMPLICATIONS FOR RESEARCH

These results could allow:
- Optimization of existing drug efficacy
- Development of more targeted molecules
- Potential reduction of side effects

CONTEXT

GLP-1 drugs represent a therapeutic revolution. Semaglutide generated over $20 billion in sales in 2024.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/glp1-cerveau-decouverte.png',
    published_at: '2025-04-28T12:00:00Z',
    author_id: null,
    topic_id: '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'
  },
  // Article 15 : Retatrutide
  {
    id: '1584153b-0144-484b-91a9-6abf00d53e35',
    slug: 'retatrutide-triple-agoniste-eli-lilly-2025',
    title: 'Retatrutide : le triple agoniste qui surpasse Ozempic et Mounjaro',
    title_i18n: { en: 'Retatrutide: the triple agonist that outperforms Ozempic and Mounjaro' },
    excerpt: 'Eli Lilly annonce des résultats précoces pour 2025. Ce nouveau peptide a montré jusqu\'à 24% de perte de poids en phase 2.',
    excerpt_i18n: { en: 'Eli Lilly announces early results for 2025. This new peptide showed up to 24% weight loss in phase 2.' },
    content: `Eli Lilly développe un nouveau peptide qui pourrait redéfinir le traitement de l'obésité : le retatrutide (LY3437943).

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
- Certains participants : jusqu'à -31% en 8 mois

À titre de comparaison, le tirzepatide (Mounjaro) atteint -22,5% dans les études de phase 3.

CALENDRIER ACCÉLÉRÉ

En février 2025, Eli Lilly a annoncé que les données de phase 3 seraient publiées plus tôt que prévu, courant 2025 au lieu de février 2026.

EFFETS SECONDAIRES À SURVEILLER

Les effets indésirables rapportés incluent :
- Nausées (fréquentes pendant la titration)
- Troubles gastro-intestinaux
- Cas de calculs rénaux signalés

L'approbation FDA est attendue dans plusieurs années, le temps de compléter les essais de phase 3.`,
    content_i18n: { en: `Eli Lilly is developing a new peptide that could redefine obesity treatment: retatrutide (LY3437943).

AN UNPRECEDENTED TRIPLE AGONIST

Unlike semaglutide (GLP-1 alone) and tirzepatide (GLP-1 + GIP), retatrutide targets THREE receptors:
- GLP-1 (like Ozempic)
- GIP (like Mounjaro)
- Glucagon

This triple action gives it superior efficacy in clinical trials.

PHASE 2 RESULTS (NEJM)

Published in the New England Journal of Medicine:
- Average weight loss at 48 weeks: -24.2% (58 lbs / 26 kg)
- Placebo group: -2.1%
- Some participants: up to -31% in 8 months

For comparison, tirzepatide (Mounjaro) achieves -22.5% in phase 3 studies.

ACCELERATED TIMELINE

In February 2025, Eli Lilly announced that phase 3 data would be released earlier than expected, during 2025 instead of February 2026.

SIDE EFFECTS TO WATCH

Reported adverse effects include:
- Nausea (common during titration)
- Gastrointestinal disorders
- Kidney stone cases reported

FDA approval is expected in several years, pending completion of phase 3 trials.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/retatrutide-eli-lilly.png',
    published_at: '2025-05-25T10:30:00Z',
    author_id: null,
    topic_id: 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'
  }
]

const newsArticles = [
  {
    id: '9d4a3f43-40b4-47a2-863b-9c6dd5c6af43',
    slug: 'bpc-157-etudes-scientifiques',
    title: 'BPC-157 : ce que disent vraiment les études scientifiques',
    title_i18n: { en: 'BPC-157: what the scientific studies really say' },
    excerpt: 'Le BPC-157 intrigue la communauté scientifique depuis plus de 30 ans. Retour sur les travaux du Pr Sikiric et l\'état actuel de la recherche.',
    excerpt_i18n: { en: 'BPC-157 has intrigued the scientific community for over 30 years. A look back at Prof. Sikiric\'s work and the current state of research.' },
    content: `Découvert dans les années 1990 par une équipe croate dirigée par le Pr Predrag Sikiric, le BPC-157 (Body Protection Compound) est un fragment de 15 acides aminés isolé du suc gastrique humain. À ce jour, plus de 100 études sur modèles animaux ont été publiées dans des revues à comité de lecture.

Les résultats précliniques sont prometteurs. Une étude publiée dans le Journal of Orthopaedic Research (Staresinic et al., 2003) a montré une accélération significative de la cicatrisation tendineuse chez le rat. D'autres travaux suggèrent un rôle dans la protection gastrique et la cicatrisation des plaies.

Il est important de noter qu'aucun essai clinique de phase III n'a été mené chez l'humain à ce jour. Le BPC-157 reste un outil de recherche in vitro et in vivo, pas un médicament approuvé.

Pour les laboratoires de recherche, ce peptide offre un terrain d'investigation fascinant sur les mécanismes de réparation tissulaire impliquant la voie NO et l'angiogenèse.`,
    content_i18n: { en: `Discovered in the 1990s by a Croatian team led by Prof. Predrag Sikiric, BPC-157 (Body Protection Compound) is a 15 amino acid fragment isolated from human gastric juice. To date, over 100 studies on animal models have been published in peer-reviewed journals.

Preclinical results are promising. A study published in the Journal of Orthopaedic Research (Staresinic et al., 2003) showed significant acceleration of tendon healing in rats. Other work suggests a role in gastric protection and wound healing.

It is important to note that no Phase III clinical trials have been conducted in humans to date. BPC-157 remains an in vitro and in vivo research tool, not an approved drug.

For research laboratories, this peptide offers a fascinating field of investigation into tissue repair mechanisms involving the NO pathway and angiogenesis.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/bpc-157-recherche.png',
    published_at: '2025-01-15T10:00:00Z',
    author_id: null,
    topic_id: '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'
  },
  {
    id: 'a2bab8fc-943b-4b32-acb9-044d54828014',
    slug: 'glp1-ozempic-revolution-peptides',
    title: 'D\'Ozempic à Mounjaro : comment les peptides GLP-1 ont conquis la médecine',
    title_i18n: { en: 'From Ozempic to Mounjaro: how GLP-1 peptides conquered medicine' },
    excerpt: 'Avec plus de 20 milliards de dollars de ventes en 2024, le sémaglutide illustre le potentiel médical et commercial des peptides thérapeutiques.',
    excerpt_i18n: { en: 'With over $20 billion in sales in 2024, semaglutide illustrates the medical and commercial potential of therapeutic peptides.' },
    content: `Le GLP-1 (Glucagon-Like Peptide-1) est une hormone incrétine sécrétée naturellement par l'intestin. Sa découverte a ouvert la voie à l'une des révolutions thérapeutiques majeures du XXIe siècle.

Le sémaglutide, commercialisé sous les noms Ozempic et Wegovy par Novo Nordisk, a généré plus de 20 milliards de dollars de revenus en 2024. Ce peptide analogue résiste à la dégradation enzymatique et présente une demi-vie prolongée permettant une injection hebdomadaire.

Le tirzepatide (Mounjaro, Zepbound) d'Eli Lilly va encore plus loin. Ce double agoniste GIP/GLP-1 a montré des pertes de poids moyennes de 20-25% dans les essais cliniques SURMOUNT, surpassant les résultats du sémaglutide.

Ces succès cliniques valident l'approche peptidique et stimulent la recherche. Des dizaines de nouveaux analogues sont en développement, ciblant non seulement l'obésité et le diabète, mais aussi les maladies cardiovasculaires et neurodégénératives.

Pour les chercheurs, les agonistes GLP-1 démontrent qu'un peptide bien conçu peut devenir un blockbuster pharmaceutique.`,
    content_i18n: { en: `GLP-1 (Glucagon-Like Peptide-1) is an incretin hormone naturally secreted by the intestine. Its discovery paved the way for one of the major therapeutic revolutions of the 21st century.

Semaglutide, marketed under the names Ozempic and Wegovy by Novo Nordisk, generated over $20 billion in revenue in 2024. This analog peptide resists enzymatic degradation and has an extended half-life allowing weekly injection.

Eli Lilly's tirzepatide (Mounjaro, Zepbound) goes even further. This dual GIP/GLP-1 agonist showed average weight losses of 20-25% in SURMOUNT clinical trials, surpassing semaglutide results.

These clinical successes validate the peptide approach and stimulate research. Dozens of new analogs are in development, targeting not only obesity and diabetes, but also cardiovascular and neurodegenerative diseases.

For researchers, GLP-1 agonists demonstrate that a well-designed peptide can become a pharmaceutical blockbuster.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/glp1-ozempic.png',
    published_at: '2025-02-20T14:30:00Z',
    author_id: null,
    topic_id: 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'
  },
  {
    id: 'facb0cb2-d70d-4fcb-a0b2-04466bfb9904',
    slug: 'peptides-recherche-cadre-legal-europe',
    title: 'Peptides de recherche en Europe : comprendre le cadre légal',
    title_i18n: { en: 'Research peptides in Europe: understanding the legal framework' },
    excerpt: 'La vente de peptides à des fins de recherche est strictement encadrée en UE. Ce qu\'il faut savoir avant de passer commande.',
    excerpt_i18n: { en: 'The sale of peptides for research purposes is strictly regulated in the EU. What you need to know before ordering.' },
    content: `En Union Européenne, les peptides destinés à la recherche in vitro sont légalement commercialisables sous certaines conditions strictes :

1. Ils ne doivent pas être présentés comme des médicaments
2. Ils ne sont pas destinés à la consommation humaine ou animale
3. Ils doivent être vendus exclusivement à des fins de recherche scientifique

Le règlement REACH (CE n°1907/2006) encadre les substances chimiques sur le marché européen. Les fabricants et distributeurs sérieux respectent ces obligations et peuvent fournir les documents de conformité sur demande.

Pour les acheteurs, quelques critères de qualité essentiels :
- Certificat d'analyse (CoA) fourni pour chaque lot
- Pureté vérifiée par HPLC (minimum 98%)
- Identité confirmée par spectrométrie de masse
- Conditions de stockage et transport respectées

Les peptides vendus comme "compléments alimentaires" ou avec des allégations santé sont illégaux dans la plupart des pays de l'UE s'ils ne disposent pas d'une autorisation de mise sur le marché (AMM).

Chez Fast Peptides, nous respectons scrupuleusement ce cadre réglementaire et fournissons une documentation complète pour chaque commande.`,
    content_i18n: { en: `In the European Union, peptides intended for in vitro research are legally marketable under certain strict conditions:

1. They must not be presented as medicines
2. They are not intended for human or animal consumption
3. They must be sold exclusively for scientific research purposes

The REACH regulation (EC No 1907/2006) governs chemical substances on the European market. Serious manufacturers and distributors respect these obligations and can provide compliance documents upon request.

For buyers, some essential quality criteria:
- Certificate of analysis (CoA) provided for each batch
- Purity verified by HPLC (minimum 98%)
- Identity confirmed by mass spectrometry
- Storage and transport conditions respected

Peptides sold as "dietary supplements" or with health claims are illegal in most EU countries if they do not have a marketing authorization (MA).

At Fast Peptides, we scrupulously respect this regulatory framework and provide complete documentation for each order.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/reglementation-peptides.png',
    published_at: '2025-03-10T09:00:00Z',
    author_id: null,
    topic_id: 'f5401164-9929-413d-8a7b-6f1bfdabf9dc'
  },
  {
    id: '62d44c97-953f-4dee-8752-9eb287afb017',
    slug: 'guide-reconstitution-conservation-peptides',
    title: 'Guide pratique : reconstitution et conservation des peptides',
    title_i18n: { en: 'Practical guide: peptide reconstitution and storage' },
    excerpt: 'La stabilité des peptides dépend de leur manipulation. Nos recommandations pour préserver l\'intégrité de vos composés de recherche.',
    excerpt_i18n: { en: 'Peptide stability depends on handling. Our recommendations to preserve the integrity of your research compounds.' },
    content: `Les peptides lyophilisés sont stables pendant le transport à température ambiante, mais leur conservation à long terme nécessite des précautions spécifiques.

AVANT RECONSTITUTION
- Stockage optimal : -20°C (congélateur standard)
- Durée de conservation : jusqu'à 24 mois
- Éviter absolument les cycles gel/dégel répétés
- Protéger de l'humidité et de la lumière directe

RECONSTITUTION
Pour la plupart des peptides hydrosolubles :
- Utiliser de l'eau bactériostatique (0.9% alcool benzylique)
- Ajouter le solvant doucement le long de la paroi du flacon
- Laisser dissoudre naturellement - ne pas agiter vigoureusement
- Attendre 5-10 minutes que la solution soit homogène

Pour les peptides hydrophobes (contenant beaucoup de Leu, Ile, Val, Met, Phe) :
- Pré-dissoudre dans 10% d'acide acétique ou DMSO
- Diluer ensuite avec de l'eau bactériostatique

APRÈS RECONSTITUTION
- Conservation à 4°C : 2 à 4 semaines maximum
- Conservation à -20°C en aliquots : plusieurs mois
- Toujours utiliser du matériel stérile
- Noter la date de reconstitution sur le flacon

Un peptide dégradé perd progressivement son efficacité sans signe visible. En cas de doute, un nouveau lot est préférable.`,
    content_i18n: { en: `Lyophilized peptides are stable during transport at room temperature, but their long-term storage requires specific precautions.

BEFORE RECONSTITUTION
- Optimal storage: -20°C (standard freezer)
- Shelf life: up to 24 months
- Absolutely avoid repeated freeze/thaw cycles
- Protect from moisture and direct light

RECONSTITUTION
For most water-soluble peptides:
- Use bacteriostatic water (0.9% benzyl alcohol)
- Add the solvent gently along the vial wall
- Let dissolve naturally - do not shake vigorously
- Wait 5-10 minutes for the solution to be homogeneous

For hydrophobic peptides (containing lots of Leu, Ile, Val, Met, Phe):
- Pre-dissolve in 10% acetic acid or DMSO
- Then dilute with bacteriostatic water

AFTER RECONSTITUTION
- Storage at 4°C: 2 to 4 weeks maximum
- Storage at -20°C in aliquots: several months
- Always use sterile equipment
- Note the reconstitution date on the vial

A degraded peptide gradually loses its effectiveness without visible signs. When in doubt, a new batch is preferable.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/guide-reconstitution.png',
    published_at: '2025-04-05T11:00:00Z',
    author_id: null,
    topic_id: '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'
  },
  {
    id: '67170960-eef3-4ead-b88c-f6ebed45be0f',
    slug: 'marche-mondial-peptides-2025',
    title: 'Le marché mondial des peptides dépassera 60 milliards de dollars en 2030',
    title_i18n: { en: 'The global peptide market will exceed $60 billion by 2030' },
    excerpt: 'Selon Grand View Research, le secteur des peptides thérapeutiques connaît une croissance annuelle de 9,8%. Les raisons de cet engouement.',
    excerpt_i18n: { en: 'According to Grand View Research, the therapeutic peptide sector is experiencing annual growth of 9.8%. The reasons for this enthusiasm.' },
    content: `Le marché des peptides thérapeutiques est en pleine expansion. Selon les analystes de Grand View Research, il devrait passer de 42 milliards de dollars en 2024 à plus de 60 milliards en 2030.

Plusieurs facteurs expliquent cette croissance :

AVANTAGES DES PEPTIDES
- Haute spécificité : moins d'effets secondaires que les petites molécules
- Biodégradabilité : pas d'accumulation dans l'organisme
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

Les grands laboratoires (Novo Nordisk, Eli Lilly, Amgen, Ipsen) investissent massivement dans la R&D peptidique. L'innovation se concentre notamment sur l'amélioration de la biodisponibilité orale, longtemps considérée comme le Saint Graal du secteur.`,
    content_i18n: { en: `The therapeutic peptide market is booming. According to Grand View Research analysts, it is expected to grow from $42 billion in 2024 to over $60 billion by 2030.

Several factors explain this growth:

ADVANTAGES OF PEPTIDES
- High specificity: fewer side effects than small molecules
- Biodegradability: no accumulation in the body
- Modular synthesis: sequence customization possible
- Tolerance: generally favorable safety profile

KEY FIGURES
- 80+ peptides approved by the FDA
- 150+ peptides in clinical trials
- 7 of the 10 best-selling drugs in 2024 are biologics

GROWING AREAS
- Metabolism: GLP-1 agonists (Ozempic, Mounjaro)
- Oncology: peptides targeting tumor receptors
- Rare diseases: orphan peptide therapies
- Cosmetics: anti-aging peptides and skin repair

Major laboratories (Novo Nordisk, Eli Lilly, Amgen, Ipsen) are investing heavily in peptide R&D. Innovation is particularly focused on improving oral bioavailability, long considered the Holy Grail of the sector.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/marche-peptides-2025.png',
    published_at: '2025-05-12T16:00:00Z',
    author_id: null,
    topic_id: 'ac5e9b57-ff9b-43d6-a69d-498a136c799a'
  },
  {
    id: '2474f359-cf06-494a-887d-60cd534e95be',
    slug: 'lire-certificat-analyse-peptide',
    title: 'Décrypter un certificat d\'analyse : les indicateurs de qualité',
    title_i18n: { en: 'Decoding a certificate of analysis: quality indicators' },
    excerpt: 'Pureté HPLC, masse moléculaire, teneur en peptide... Comment interpréter les données d\'un CoA pour évaluer la qualité de vos peptides.',
    excerpt_i18n: { en: 'HPLC purity, molecular weight, peptide content... How to interpret CoA data to evaluate the quality of your peptides.' },
    content: `Le certificat d'analyse (CoA) est le document de référence pour évaluer la qualité d'un peptide. Voici comment le lire :

PURETÉ HPLC
La chromatographie liquide haute performance sépare les composants d'un échantillon. Le pourcentage indique la proportion du peptide cible par rapport aux impuretés.
- Excellent : >98%
- Acceptable : 95-98%
- À éviter : <95%

Les impuretés sont généralement des peptides tronqués (synthèse incomplète) ou des produits de dégradation.

SPECTROMÉTRIE DE MASSE (MS)
La masse moléculaire observée doit correspondre à la masse théorique calculée à partir de la séquence.
- Écart acceptable : ±0.1%
- Un écart plus important peut indiquer une modification chimique ou une erreur de synthèse

APPARENCE
La description de l'apparence (poudre blanche, lyophilisat) permet de vérifier la cohérence avec le produit reçu.

TENEUR EN PEPTIDE NET
Attention : un flacon étiqueté "5mg" contient rarement 5mg de peptide pur. La teneur nette est généralement de 70-85%, le reste étant des sels (TFA, acétate) et de l'eau résiduelle.

Le CoA doit préciser ce ratio pour permettre un calcul de dosage précis. Les fournisseurs sérieux indiquent toujours cette information.

Méfiez-vous des CoA génériques ou sans numéro de lot spécifique : ils peuvent ne pas correspondre au produit réellement livré.`,
    content_i18n: { en: `The certificate of analysis (CoA) is the reference document for evaluating peptide quality. Here is how to read it:

HPLC PURITY
High-performance liquid chromatography separates the components of a sample. The percentage indicates the proportion of the target peptide relative to impurities.
- Excellent: >98%
- Acceptable: 95-98%
- To avoid: <95%

Impurities are usually truncated peptides (incomplete synthesis) or degradation products.

MASS SPECTROMETRY (MS)
The observed molecular mass must match the theoretical mass calculated from the sequence.
- Acceptable deviation: ±0.1%
- A larger deviation may indicate chemical modification or synthesis error

APPEARANCE
The description of appearance (white powder, lyophilisate) verifies consistency with the product received.

NET PEPTIDE CONTENT
Note: a vial labeled "5mg" rarely contains 5mg of pure peptide. Net content is typically 70-85%, the rest being salts (TFA, acetate) and residual water.

The CoA must specify this ratio to allow accurate dosage calculation. Serious suppliers always indicate this information.

Beware of generic CoAs or those without a specific batch number: they may not correspond to the product actually delivered.` },
    image: 'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/news/certificat-analyse.png',
    published_at: '2025-06-01T08:30:00Z',
    author_id: null,
    topic_id: '76bb3e2d-d0c7-41aa-a59c-32f4c77379e9'
  }
]

async function seedNews() {
  console.log('🚀 Mise à jour des news...\n')

  // Supprimer les anciennes news
  const idsToDelete = [
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
  ]

  const { error: deleteError } = await supabase
    .from('news')
    .delete()
    .in('id', idsToDelete)

  if (deleteError) {
    console.log('⚠️  Suppression anciennes news:', deleteError.message)
  } else {
    console.log('✅ Anciennes news supprimées')
  }

  // Insérer les 6 premiers articles
  console.log('\n📰 Articles 1-6:')
  for (const article of newsArticles) {
    const { error } = await supabase
      .from('news')
      .upsert(article, { onConflict: 'id' })

    if (error) {
      console.error(`❌ ${article.slug}: ${error.message}`)
    } else {
      console.log(`✅ ${article.title.substring(0, 50)}...`)
    }
  }

  // Insérer les 9 nouveaux articles
  console.log('\n📰 Articles 7-15:')
  for (const article of newsArticles9) {
    const { error } = await supabase
      .from('news')
      .upsert(article, { onConflict: 'id' })

    if (error) {
      console.error(`❌ ${article.slug}: ${error.message}`)
    } else {
      console.log(`✅ ${article.title.substring(0, 50)}...`)
    }
  }

  console.log('\n✨ Seed news terminé! (15 articles)')
}

seedNews()
