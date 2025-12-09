-- ============================================================
-- SEED LAB NOTES — RESSOURCES TECHNIQUES
-- ============================================================
-- 5 articles techniques complets pour la section Lab Notes
-- Contenu orienté recherche scientifique (façade laboratoire)
-- ============================================================

-- ============================================================
-- PARTIE 0 : Catégories de ressources
-- ============================================================
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

-- Article 1: Protocoles de Reconstitution (Lab Protocols)
INSERT INTO public.resources (
  slug,
  title,
  excerpt,
  content,
  image,
  category_id,
  difficulty_level,
  reading_time_minutes,
  equipment_needed,
  status,
  published_at,
  featured
) VALUES (
  'guide-reconstitution-peptides-lyophilises',
  'Guide Complet : Reconstitution des Peptides Lyophilisés',
  'Protocole détaillé pour la reconstitution aseptique des peptides lyophilisés en environnement de laboratoire. Techniques, solvants et bonnes pratiques.',
  '<h2>Introduction</h2>
<p>La reconstitution des peptides lyophilisés est une étape critique qui détermine la stabilité et l''intégrité du composé pour la recherche. Ce guide présente les protocoles standards utilisés en laboratoire.</p>

<h2>Matériel Requis</h2>
<ul>
<li>Hotte à flux laminaire (classe II recommandée)</li>
<li>Eau bactériostatique (0.9% benzyl alcohol)</li>
<li>Seringues stériles (1mL, 3mL)</li>
<li>Aiguilles stériles (18G pour prélèvement, 25-27G pour injection)</li>
<li>Tampons alcoolisés 70%</li>
<li>Gants nitrile sans poudre</li>
</ul>

<h2>Protocole Standard</h2>
<h3>Étape 1 : Préparation de l''Environnement</h3>
<p>Nettoyer la surface de travail avec de l''éthanol 70%. Laisser le flacon de peptide atteindre la température ambiante (15-20 minutes) pour éviter la condensation.</p>

<h3>Étape 2 : Calcul du Volume</h3>
<p>Déterminer la concentration souhaitée :</p>
<blockquote>
<strong>Formule :</strong> Volume (mL) = Masse peptide (mg) / Concentration souhaitée (mg/mL)
</blockquote>
<p>Exemple : Pour 5mg de BPC-157 à 2.5mg/mL → 5/2.5 = 2mL d''eau bactériostatique</p>

<h3>Étape 3 : Injection du Solvant</h3>
<p>Injecter le solvant <strong>lentement</strong> le long de la paroi du flacon, jamais directement sur la poudre. Cela évite la formation de mousse et préserve la structure peptidique.</p>

<h3>Étape 4 : Dissolution</h3>
<p>Faire rouler doucement le flacon entre les paumes. <strong>Ne jamais agiter vigoureusement</strong> - cela peut dénaturer les peptides et créer des agrégats.</p>

<h2>Solvants Compatibles par Type</h2>
<table>
<tr><th>Type de Peptide</th><th>Solvant Primaire</th><th>Alternative</th></tr>
<tr><td>Peptides hydrophiles</td><td>Eau bactériostatique</td><td>NaCl 0.9%</td></tr>
<tr><td>Peptides hydrophobes</td><td>Acide acétique 0.1%</td><td>DMSO puis dilution</td></tr>
<tr><td>Peptides basiques</td><td>Eau + acide acétique</td><td>PBS pH 7.4</td></tr>
</table>

<h2>Erreurs Courantes à Éviter</h2>
<ul>
<li><strong>Agitation excessive</strong> : Cause la dénaturation et la formation de mousse</li>
<li><strong>Injection directe sur la poudre</strong> : Crée des agrégats insolubles</li>
<li><strong>Utilisation d''eau non stérile</strong> : Risque de contamination bactérienne</li>
<li><strong>Reconstitution à froid</strong> : La condensation introduit de l''humidité</li>
</ul>

<h2>Conservation Post-Reconstitution</h2>
<p>Une fois reconstitué, le peptide doit être conservé à <strong>+2-8°C</strong> et utilisé dans les délais spécifiés par le fabricant (généralement 14-30 jours selon le composé).</p>

<div class="callout-success">
<p><strong>Outil Pratique</strong></p>
<p>Utilisez notre <a href="/guide-reconstitution">Calculateur de Dilution</a> pour calculer automatiquement les volumes de solvant et visualiser le prélèvement sur seringue.</p>
</div>',
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/lab-reconstitution.jpg',
  (SELECT id FROM public.resource_categories WHERE slug = 'lab-protocols'),
  'beginner',
  8,
  ARRAY['Hotte à flux laminaire', 'Eau bactériostatique', 'Seringues stériles', 'Alcool 70%'],
  'published',
  NOW(),
  true
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Article 2: Analyse HPLC
INSERT INTO public.resources (
  slug,
  title,
  excerpt,
  content,
  image,
  category_id,
  difficulty_level,
  reading_time_minutes,
  equipment_needed,
  status,
  published_at,
  featured
) VALUES (
  'comprendre-rapports-hplc-peptides',
  'Comprendre les Rapports HPLC : Guide d''Interprétation',
  'Comment lire et interpréter un certificat d''analyse HPLC pour les peptides de recherche. Pureté, temps de rétention et critères qualité.',
  '<h2>Qu''est-ce que l''HPLC ?</h2>
<p>La <strong>Chromatographie Liquide Haute Performance</strong> (HPLC) est la méthode de référence pour analyser la pureté des peptides synthétiques. Elle sépare les composés selon leur affinité avec la phase stationnaire et mobile.</p>

<h2>Lecture d''un Chromatogramme</h2>
<h3>Les Éléments Clés</h3>
<ul>
<li><strong>Temps de rétention (tR)</strong> : Position du pic principal, caractéristique du composé</li>
<li><strong>Aire du pic</strong> : Proportionnelle à la quantité de composé</li>
<li><strong>Largeur à mi-hauteur</strong> : Indicateur de la qualité de séparation</li>
<li><strong>Pics secondaires</strong> : Impuretés ou produits de dégradation</li>
</ul>

<h2>Calcul de la Pureté</h2>
<blockquote>
<strong>Pureté (%) = (Aire pic principal / Aire totale) × 100</strong>
</blockquote>
<p>Un peptide de recherche de qualité présente généralement une pureté ≥ 98%.</p>

<h2>Paramètres Standards</h2>
<table>
<tr><th>Paramètre</th><th>Valeur Typique</th><th>Commentaire</th></tr>
<tr><td>Colonne</td><td>C18, 5μm, 250×4.6mm</td><td>Phase inverse standard</td></tr>
<tr><td>Débit</td><td>1.0 mL/min</td><td>Compromis résolution/temps</td></tr>
<tr><td>Détection</td><td>UV 220nm</td><td>Absorption liaison peptidique</td></tr>
<tr><td>Gradient</td><td>Acétonitrile/Eau + TFA</td><td>Élution progressive</td></tr>
</table>

<h2>Interprétation des Résultats</h2>
<h3>Pic Principal</h3>
<p>Un pic symétrique et étroit indique un composé pur et stable. Un pic asymétrique (traînée) peut indiquer une dégradation ou une interaction avec la colonne.</p>

<h3>Pics Secondaires</h3>
<ul>
<li><strong>Avant le pic principal</strong> : Souvent des impuretés plus polaires ou des fragments</li>
<li><strong>Après le pic principal</strong> : Peuvent être des isomères ou des formes oxydées</li>
</ul>

<h2>Critères d''Acceptation</h2>
<ul>
<li>Pureté ≥ 98% pour la recherche standard</li>
<li>Pureté ≥ 99% pour les études sensibles</li>
<li>Absence de pic > 1% (hors pic principal)</li>
<li>Temps de rétention conforme à la référence (±5%)</li>
</ul>

<h2>Limites de l''HPLC</h2>
<p>L''HPLC ne détecte que les composés absorbant à la longueur d''onde utilisée. Pour une caractérisation complète, elle est souvent couplée à la spectrométrie de masse (LC-MS).</p>',
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/hplc-analysis.jpg',
  (SELECT id FROM public.resource_categories WHERE slug = 'hplc-analysis'),
  'intermediate',
  10,
  ARRAY['Rapport HPLC', 'Certificat d''analyse'],
  'published',
  NOW() - INTERVAL '2 days',
  true
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Article 3: Stockage et Conservation
INSERT INTO public.resources (
  slug,
  title,
  excerpt,
  content,
  image,
  category_id,
  difficulty_level,
  reading_time_minutes,
  equipment_needed,
  status,
  published_at,
  featured
) VALUES (
  'stockage-optimal-peptides-recherche',
  'Stockage Optimal des Peptides : Températures et Durées',
  'Guide complet sur les conditions de stockage des peptides lyophilisés et reconstitués. Températures, durées de conservation et facteurs de dégradation.',
  '<h2>Principes de Base</h2>
<p>Les peptides sont des molécules sensibles qui peuvent se dégrader par hydrolyse, oxydation ou agrégation. Un stockage approprié est essentiel pour maintenir leur intégrité structurale.</p>

<h2>Peptides Lyophilisés (Poudre)</h2>
<h3>Conditions Optimales</h3>
<ul>
<li><strong>Température</strong> : -20°C (congélateur standard)</li>
<li><strong>Humidité</strong> : < 30% HR (utiliser dessiccant)</li>
<li><strong>Lumière</strong> : Protéger de la lumière UV</li>
<li><strong>Atmosphère</strong> : Sous azote si possible</li>
</ul>

<h3>Durée de Conservation</h3>
<table>
<tr><th>Température</th><th>Durée Typique</th><th>Remarques</th></tr>
<tr><td>-80°C</td><td>5+ ans</td><td>Optimal pour stockage long terme</td></tr>
<tr><td>-20°C</td><td>2-3 ans</td><td>Standard laboratoire</td></tr>
<tr><td>+4°C</td><td>6-12 mois</td><td>Court terme uniquement</td></tr>
<tr><td>Ambiante</td><td>< 1 mois</td><td>À éviter</td></tr>
</table>

<h2>Peptides Reconstitués (Solution)</h2>
<h3>Recommandations Générales</h3>
<p>Une fois reconstitué, le peptide est plus vulnérable à la dégradation. Suivre ces directives :</p>
<ul>
<li><strong>Stockage</strong> : +2-8°C (réfrigérateur)</li>
<li><strong>Durée</strong> : Variable selon le peptide (7-30 jours)</li>
<li><strong>Aliquotage</strong> : Diviser en portions pour éviter les cycles gel/dégel</li>
</ul>

<h3>Durées par Type de Peptide</h3>
<table>
<tr><th>Peptide</th><th>Durée à +4°C</th><th>Notes</th></tr>
<tr><td>BPC-157</td><td>14 jours</td><td>Relativement stable</td></tr>
<tr><td>DSIP</td><td>10 jours</td><td>Hygroscopique</td></tr>
<tr><td>GHK-Cu</td><td>30 jours</td><td>Stabilisé par le cuivre</td></tr>
<tr><td>Semaglutide</td><td>56 jours</td><td>Très stable</td></tr>
<tr><td>NAD+</td><td>7 jours</td><td>Sensible à la lumière</td></tr>
</table>

<h2>Facteurs de Dégradation</h2>
<h3>Hydrolyse</h3>
<p>Clivage des liaisons peptidiques par l''eau. Minimisée par le stockage à sec ou dans un tampon approprié.</p>

<h3>Oxydation</h3>
<p>Affecte particulièrement les résidus méthionine et cystéine. Utiliser des antioxydants ou purger à l''azote.</p>

<h3>Agrégation</h3>
<p>Formation d''agrégats insolubles. Éviter les concentrations trop élevées et les cycles thermiques.</p>

<h2>Bonnes Pratiques</h2>
<ul>
<li>Ne jamais recongeler un peptide reconstitué</li>
<li>Utiliser des flacons en verre borosilicaté</li>
<li>Étiqueter clairement avec date de reconstitution</li>
<li>Inspecter visuellement avant utilisation (précipité, turbidité)</li>
</ul>',
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/storage-peptides.jpg',
  (SELECT id FROM public.resource_categories WHERE slug = 'storage-handling'),
  'beginner',
  7,
  ARRAY['Congélateur -20°C', 'Réfrigérateur +4°C', 'Dessiccant', 'Flacons verre'],
  'published',
  NOW() - INTERVAL '5 days',
  false
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Article 4: Science Moléculaire
INSERT INTO public.resources (
  slug,
  title,
  excerpt,
  content,
  image,
  category_id,
  difficulty_level,
  reading_time_minutes,
  equipment_needed,
  status,
  published_at,
  featured
) VALUES (
  'structure-moleculaire-peptides-synthese',
  'Structure Moléculaire des Peptides : De la Séquence à la Fonction',
  'Comprendre la relation entre séquence d''acides aminés, structure tridimensionnelle et propriétés des peptides de synthèse.',
  '<h2>Les Bases de la Structure Peptidique</h2>
<p>Un peptide est une chaîne d''acides aminés liés par des liaisons peptidiques (amide). La séquence spécifique détermine les propriétés physico-chimiques et biologiques du composé.</p>

<h2>Niveaux de Structure</h2>
<h3>Structure Primaire</h3>
<p>La séquence linéaire des acides aminés, notée du N-terminal au C-terminal. Exemple pour BPC-157 :</p>
<blockquote>
Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val
</blockquote>

<h3>Structure Secondaire</h3>
<ul>
<li><strong>Hélice α</strong> : Enroulement stabilisé par liaisons H (i → i+4)</li>
<li><strong>Feuillet β</strong> : Brins parallèles ou antiparallèles</li>
<li><strong>Coudes</strong> : Inversions de direction (souvent Pro, Gly)</li>
</ul>

<h3>Structure Tertiaire</h3>
<p>Repliement 3D global, stabilisé par :</p>
<ul>
<li>Ponts disulfure (Cys-Cys)</li>
<li>Interactions hydrophobes</li>
<li>Liaisons ioniques (Asp/Glu avec Lys/Arg)</li>
</ul>

<h2>Propriétés Clés</h2>
<h3>Poids Moléculaire</h3>
<p>Somme des masses des acides aminés moins (n-1) molécules d''eau. Exprimé en Daltons (Da) ou g/mol.</p>
<table>
<tr><th>Peptide</th><th>Poids Moléculaire</th><th>Nombre d''AA</th></tr>
<tr><td>BPC-157</td><td>1419.53 Da</td><td>15</td></tr>
<tr><td>DSIP</td><td>848.81 Da</td><td>9</td></tr>
<tr><td>Semaglutide</td><td>4113.58 Da</td><td>31</td></tr>
<tr><td>TB-500</td><td>4963.44 Da</td><td>43</td></tr>
</table>

<h3>Point Isoélectrique (pI)</h3>
<p>pH auquel le peptide a une charge nette nulle. Détermine la solubilité et le comportement en électrophorèse.</p>

<h3>Hydrophobicité</h3>
<p>Influence la solubilité et la perméabilité membranaire. Les peptides hydrophobes nécessitent souvent des co-solvants (DMSO, acide acétique).</p>

<h2>Modifications Courantes</h2>
<ul>
<li><strong>Acétylation N-terminale</strong> : Protège contre les aminopeptidases</li>
<li><strong>Amidation C-terminale</strong> : Augmente la stabilité et l''activité</li>
<li><strong>Cyclisation</strong> : Améliore la résistance à la protéolyse</li>
<li><strong>PEGylation</strong> : Augmente la demi-vie circulante</li>
</ul>

<h2>Impact sur la Recherche</h2>
<p>La connaissance de la structure permet de :</p>
<ul>
<li>Prédire la stabilité et les conditions de stockage</li>
<li>Choisir le solvant de reconstitution approprié</li>
<li>Comprendre les mécanismes d''interaction</li>
<li>Interpréter les données analytiques (HPLC, MS)</li>
</ul>',
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/molecular-structure.jpg',
  (SELECT id FROM public.resource_categories WHERE slug = 'molecular-science'),
  'advanced',
  12,
  ARRAY['Documentation produit', 'Base de données UniProt'],
  'published',
  NOW() - INTERVAL '7 days',
  false
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Article 5: Standards Qualité
INSERT INTO public.resources (
  slug,
  title,
  excerpt,
  content,
  image,
  category_id,
  difficulty_level,
  reading_time_minutes,
  equipment_needed,
  status,
  published_at,
  featured
) VALUES (
  'standards-qualite-peptides-recherche',
  'Standards de Qualité : Certificats et Traçabilité',
  'Guide sur les normes de qualité pour les peptides de recherche. COA, tests de pureté, stérilité et bonnes pratiques de fabrication.',
  '<h2>Importance de la Qualité</h2>
<p>En recherche peptidique, la qualité du matériel détermine la reproductibilité des résultats. Un peptide de mauvaise qualité peut contenir des impuretés qui faussent les données expérimentales.</p>

<h2>Le Certificat d''Analyse (COA)</h2>
<h3>Éléments Essentiels</h3>
<ul>
<li><strong>Identité du produit</strong> : Nom, numéro de lot, séquence</li>
<li><strong>Pureté HPLC</strong> : Pourcentage et chromatogramme</li>
<li><strong>Confirmation MS</strong> : Masse mesurée vs théorique</li>
<li><strong>Contenu peptidique</strong> : % de peptide actif (vs sels/eau)</li>
<li><strong>Aspect</strong> : Description visuelle (poudre blanche, etc.)</li>
</ul>

<h3>Critères d''Acceptation</h3>
<table>
<tr><th>Paramètre</th><th>Spécification</th><th>Méthode</th></tr>
<tr><td>Pureté</td><td>≥ 98%</td><td>HPLC-UV</td></tr>
<tr><td>Identité</td><td>M ± 0.1%</td><td>ESI-MS ou MALDI</td></tr>
<tr><td>Contenu peptidique</td><td>≥ 80%</td><td>AAA ou gravimétrie</td></tr>
<tr><td>Endotoxines</td><td>< 1 EU/mg</td><td>LAL (si applicable)</td></tr>
</table>

<h2>Tests Analytiques</h2>
<h3>HPLC (Chromatographie)</h3>
<p>Sépare les composés par affinité chimique. Permet de quantifier la pureté et détecter les impuretés.</p>

<h3>Spectrométrie de Masse</h3>
<p>Confirme l''identité par mesure précise de la masse moléculaire. Détecte les modifications inattendues.</p>

<h3>Analyse des Acides Aminés (AAA)</h3>
<p>Hydrolyse complète puis quantification. Vérifie la composition et détermine le contenu peptidique réel.</p>

<h2>Traçabilité</h2>
<h3>Numéro de Lot</h3>
<p>Chaque lot doit avoir un identifiant unique permettant de tracer :</p>
<ul>
<li>Date de synthèse</li>
<li>Matières premières utilisées</li>
<li>Opérateurs impliqués</li>
<li>Résultats des tests QC</li>
</ul>

<h3>Documentation</h3>
<p>Conserver les COA pendant au moins 5 ans. Les données brutes (chromatogrammes, spectres) doivent être archivées.</p>

<h2>Red Flags Qualité</h2>
<ul>
<li>Absence de COA ou COA générique</li>
<li>Pureté non vérifiable (pas de chromatogramme)</li>
<li>Masse mesurée très différente de la théorique</li>
<li>Aspect anormal (coloration, humidité)</li>
<li>Prix anormalement bas</li>
</ul>

<h2>Bonnes Pratiques</h2>
<ul>
<li>Toujours demander le COA avant achat</li>
<li>Vérifier la cohérence des données</li>
<li>Conserver les échantillons de référence</li>
<li>Documenter tout écart observé</li>
</ul>',
  'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/news-images/quality-standards.jpg',
  (SELECT id FROM public.resource_categories WHERE slug = 'quality-standards'),
  'intermediate',
  9,
  ARRAY['Certificat d''analyse (COA)', 'Documentation lot'],
  'published',
  NOW() - INTERVAL '10 days',
  true
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- ============================================================
-- VÉRIFICATION
-- ============================================================
DO $$
DECLARE
  res_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO res_count FROM public.resources WHERE status = 'published';
  RAISE NOTICE 'Lab Notes resources created: % articles', res_count;
END $$;
