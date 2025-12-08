/**
 * ══════════════════════════════════════════════════════════════
 * TRENDING PEPTIDES CONFIGURATION — 2025
 * ══════════════════════════════════════════════════════════════
 *
 * Classement basé sur les tendances mondiales de la recherche
 * scientifique sur les peptides en 2025.
 *
 * Sources:
 * - Publications PubMed/PMC
 * - Études cliniques FDA
 * - Tendances communauté scientifique
 *
 * Mise à jour: Décembre 2025
 *
 * ══════════════════════════════════════════════════════════════
 */

/**
 * Liste ordonnée des peptides par popularité mondiale (recherche scientifique)
 *
 * Le classement est basé sur :
 * - Nombre de publications scientifiques
 * - Intérêt des laboratoires de recherche
 * - Avancées cliniques récentes
 *
 * Format: nom du peptide en minuscules (pour matching flexible)
 */
export const TRENDING_PEPTIDES_2025: string[] = [
  // ══════════════════════════════════════════════════════════════
  // TOP 3 — Podium (GLP-1 / Métabolisme)
  // ══════════════════════════════════════════════════════════════

  // #1 — Retatrutide (Triple agoniste GIP/GLP-1/Glucagon)
  // Leader 2025 : résultats exceptionnels (-24% poids en 24 semaines)
  // Phase 3 en cours, potentiel révolutionnaire
  'retatrutide',

  // #2 — Tirzepatide (Dual agoniste GIP/GLP-1)
  // FDA approved (Mounjaro/Zepbound), très étudié
  'tirzepatide',

  // #3 — Semaglutide (GLP-1 agoniste)
  // Référence du marché (Ozempic/Wegovy), millions de patients
  'semaglutide',

  // ══════════════════════════════════════════════════════════════
  // MENTIONS HONORABLES — Healing & Recovery
  // ══════════════════════════════════════════════════════════════

  // #4 — BPC-157 (Body Protection Compound)
  // Star de la régénération tissulaire, très recherché
  'bpc-157',
  'bpc157',

  // #5 — TB-500 (Thymosin Beta-4)
  // Réparation musculaire et tendons
  'tb-500',
  'tb500',

  // ══════════════════════════════════════════════════════════════
  // AUTRES POPULAIRES — Anti-aging & Performance
  // ══════════════════════════════════════════════════════════════

  // #6 — GHK-Cu (Copper Peptide)
  // Anti-aging, régénération cutanée
  'ghk-cu',

  // #7 — CJC-1295 (Growth Hormone Releasing Hormone)
  // Stimulation GH, recherche longevity
  'cjc-1295',
  'cjc1295',

  // #8 — Ipamorelin
  // GHRP sélectif, profil de sécurité favorable
  'ipamorelin',

  // #9 — PT-141 (Bremelanotide)
  // Recherche fonction sexuelle
  'pt-141',
  'pt141',

  // #10 — Epithalon (Epitalon)
  // Recherche télomérase / longevity
  'epithalon',
  'epitalon',

  // ══════════════════════════════════════════════════════════════
  // AUTRES PEPTIDES RECHERCHÉS
  // ══════════════════════════════════════════════════════════════

  'selank',
  'semax',
  'melanotan',
  'aod-9604',
  'ghrp-6',
  'ghrp-2',
  'hexarelin',
  'igf-1',
  'mgf',
  'follistatin',
]

/**
 * Retourne le rang de popularité d'un produit basé sur son nom
 * Plus le rang est bas, plus le peptide est populaire
 *
 * @param productName - Nom du produit
 * @returns Rang (1 = plus populaire) ou Infinity si non classé
 */
export function getPeptideRank(productName: string): number {
  const normalizedName = productName.toLowerCase().trim()
  const firstWord = normalizedName.split(' ')[0] ?? ''

  for (let i = 0; i < TRENDING_PEPTIDES_2025.length; i++) {
    const trendingPeptide = TRENDING_PEPTIDES_2025[i]
    if (!trendingPeptide) continue

    // Match exact ou contient le nom du peptide
    if (
      normalizedName.includes(trendingPeptide) ||
      trendingPeptide.includes(firstWord)
    ) {
      // Grouper les variantes (bpc-157 et bpc157 = même rang)
      if (trendingPeptide === 'bpc157') return 4
      if (trendingPeptide === 'tb500') return 5
      if (trendingPeptide === 'cjc1295') return 7
      if (trendingPeptide === 'pt141') return 9
      if (trendingPeptide === 'epitalon') return 10

      return i + 1
    }
  }

  return Infinity // Non classé = en dernier
}

/**
 * Trie une liste de produits par popularité mondiale
 *
 * @param products - Liste de produits avec un champ 'name'
 * @returns Liste triée par popularité décroissante
 */
export function sortByTrendingRank<T extends { name: string }>(products: T[]): T[] {
  return [...products].sort((a, b) => {
    const rankA = getPeptideRank(a.name)
    const rankB = getPeptideRank(b.name)
    return rankA - rankB
  })
}
