/**
 * Configuration des guidelines de contenu SEO
 *
 * IMPORTANT: Ce fichier définit les règles de contenu pour éviter
 * les filtres médicaux/pharmaceutiques de Google.
 *
 * Positionnement : "Fournisseur de matériel scientifique B2B"
 */

export const CONTENT_GUIDELINES = {
  /**
   * Topics ACCEPTABLES pour le blog/actualités
   * Ces sujets renforcent le positionnement "laboratoire scientifique"
   */
  ALLOWED_TOPICS: [
    // Protocoles de laboratoire
    'Comment lire un rapport HPLC',
    'Protocoles de stockage de la poudre lyophilisée',
    'Guide de reconstitution des peptides lyophilisés',
    'Manipulation aseptique en laboratoire',
    'Calcul des concentrations molaires',

    // Chimie et structure
    'Structure moléculaire des peptides de synthèse',
    'Comprendre les séquences d\'acides aminés',
    'Introduction à la spectrométrie de masse',
    'Analyse chromatographique HPLC : principes',

    // Qualité et certification
    'Comment interpréter un certificat d\'analyse (COA)',
    'Standards de pureté en recherche peptidique',
    'Traçabilité des lots en laboratoire',
    'Normes GMP et contrôle qualité',

    // Logistique scientifique
    'Transport et chaîne du froid des réactifs',
    'Conditions de stockage optimales',
    'Durée de vie des peptides reconstitués',

    // Histoire et contexte scientifique
    'Histoire de la synthèse peptidique',
    'Évolution des techniques HPLC',
    'Applications de recherche des peptides',
  ],

  /**
   * Topics INTERDITS - Déclenchent les filtres médicaux de Google
   * NE JAMAIS publier de contenu sur ces sujets
   */
  FORBIDDEN_TOPICS: [
    // Médical / Thérapeutique
    'Dosage pour soigner',
    'Traitement de',
    'Guérir',
    'Soigner',
    'Effets thérapeutiques',
    'Posologie',
    'Administration',
    'Injection',

    // Fitness / Bodybuilding
    'Musculation',
    'Prise de masse',
    'Perte de poids',
    'Définition musculaire',
    'Performance sportive',
    'Avant/Après',
    'Résultats physiques',
    'Gains musculaires',

    // Promesses de résultats
    'Effets sur le corps',
    'Bénéfices physiologiques',
    'Amélioration de',
    'Régénération',
    'Anti-âge',
    'Rajeunissement',

    // Termes suspects
    'Acheter pour usage personnel',
    'Auto-médication',
    'Sans ordonnance',
  ],

  /**
   * Mots-clés SEO "Safe" à privilégier
   */
  SAFE_KEYWORDS: [
    'peptides synthèse France',
    'research chemicals Europe',
    'fourniture laboratoire peptides',
    'pureté HPLC',
    'réactifs recherche scientifique',
    'RUO peptides',
    'laboratoire peptides synthétiques',
    'fournisseur réactifs chimiques',
    'analyse spectrométrie masse',
    'certificat analyse COA',
    'peptide lyophilisé',
    'stockage peptides',
    'numéro CAS peptide',
    'séquence acides aminés',
    'poids moléculaire peptide',
  ],

  /**
   * Mots-clés à ÉVITER dans le contenu
   */
  AVOID_KEYWORDS: [
    'acheter muscle',
    'perte de poids',
    'anti-aging',
    'performance',
    'bodybuilding',
    'fitness',
    'musculation',
    'dosage humain',
    'injection',
    'cure',
    'cycle',
    'stack',
    'PCT',
  ],

  /**
   * Template de description produit "clinique"
   * Format froid et technique, sans promesses
   */
  PRODUCT_DESCRIPTION_TEMPLATE: `
{NOM_PRODUIT} - Peptide de Synthèse pour Recherche

SPÉCIFICATIONS TECHNIQUES :
• Numéro CAS : {CAS_NUMBER}
• Poids moléculaire : {MOLECULAR_WEIGHT} Da
• Formule moléculaire : {MOLECULAR_FORMULA}
• Séquence : {SEQUENCE}
• Pureté HPLC : ≥{PURITY}%

FORME ET CONDITIONNEMENT :
• Forme : Poudre lyophilisée blanche
• Conditionnement : Flacon verre sous vide
• Quantité : {DOSAGE}

STOCKAGE ET MANIPULATION :
• Conservation : -20°C (lyophilisé)
• Après reconstitution : +4°C, 7-14 jours
• Solvants compatibles : Eau bactériostatique, NaCl 0.9%

DOCUMENTATION INCLUSE :
• Certificat d'analyse (COA)
• Rapport HPLC
• Spectre de masse

⚠️ USAGE EXCLUSIVEMENT RÉSERVÉ À LA RECHERCHE SCIENTIFIQUE
Ce produit est destiné uniquement aux laboratoires et chercheurs qualifiés.
Non destiné à l'usage humain ou vétérinaire.
`,

  /**
   * Mentions légales obligatoires pour chaque produit
   */
  LEGAL_DISCLAIMERS: {
    short: 'Research Use Only (RUO) - Non destiné à l\'usage humain ou vétérinaire.',
    medium: 'Ce produit est strictement réservé à la recherche scientifique en laboratoire. Non destiné à un usage diagnostique, thérapeutique, humain ou vétérinaire.',
    full: `AVERTISSEMENT LÉGAL : Ce produit est exclusivement destiné à la recherche scientifique in vitro et aux applications de laboratoire. Il n'est pas destiné à un usage diagnostique, thérapeutique, humain ou vétérinaire. L'acheteur assume l'entière responsabilité de l'utilisation conforme de ce produit aux réglementations locales en vigueur. La vente est réservée aux professionnels de la recherche et institutions scientifiques qualifiées.`,
  },

  /**
   * Catégories de topics acceptables pour le blog
   */
  BLOG_CATEGORIES: [
    {
      id: 'lab-protocols',
      label: 'Protocoles Laboratoire',
      description: 'Guides techniques pour la manipulation des réactifs',
      icon: 'FlaskConical',
    },
    {
      id: 'hplc-analysis',
      label: 'Analyse HPLC',
      description: 'Comprendre les rapports et certificats d\'analyse',
      icon: 'Activity',
    },
    {
      id: 'storage-handling',
      label: 'Stockage & Conservation',
      description: 'Bonnes pratiques de conservation des peptides',
      icon: 'Thermometer',
    },
    {
      id: 'molecular-science',
      label: 'Science Moléculaire',
      description: 'Structure et propriétés des peptides de synthèse',
      icon: 'Atom',
    },
    {
      id: 'quality-standards',
      label: 'Standards Qualité',
      description: 'Normes et certifications en recherche',
      icon: 'ShieldCheck',
    },
  ],
} as const

/**
 * Vérifie si un texte contient des termes interdits
 */
export function containsForbiddenTerms(text: string): boolean {
  const lowerText = text.toLowerCase()
  return CONTENT_GUIDELINES.FORBIDDEN_TOPICS.some(
    (term) => lowerText.includes(term.toLowerCase())
  )
}

/**
 * Suggère des mots-clés safe pour un texte donné
 */
export function getSafeKeywordsForContent(category: string): string[] {
  const baseKeywords = CONTENT_GUIDELINES.SAFE_KEYWORDS.slice(0, 5)

  // Ajouter des keywords spécifiques selon la catégorie
  switch (category) {
    case 'lab-protocols':
      return [...baseKeywords, 'protocole laboratoire', 'manipulation aseptique']
    case 'hplc-analysis':
      return [...baseKeywords, 'analyse HPLC', 'chromatographie', 'spectrométrie']
    case 'storage-handling':
      return [...baseKeywords, 'stockage peptide', 'lyophilisation', 'chaîne du froid']
    case 'molecular-science':
      return [...baseKeywords, 'structure moléculaire', 'séquence peptidique']
    case 'quality-standards':
      return [...baseKeywords, 'certificat analyse', 'norme qualité', 'COA']
    default:
      return baseKeywords
  }
}

export type ContentCategory = typeof CONTENT_GUIDELINES.BLOG_CATEGORIES[number]['id']
