/**
 * Configuration SEO centralisée
 */

export const SEO_CONFIG = {
  /**
   * URL de base de l'application
   * Utilisée pour les canonical URLs et Open Graph
   */
  APP_URL: import.meta.env.VITE_APP_URL || 'https://fast-peptides.com',

  /**
   * Nom du site
   */
  SITE_NAME: 'Atlas Lab Solutions',

  /**
   * Auteur (OPSEC compliant)
   */
  AUTHOR: 'Atlas Lab Solutions LLC',

  /**
   * Langue du site
   */
  LANG: 'fr',

  /**
   * Image par défaut pour Open Graph
   */
  DEFAULT_OG_IMAGE: `${import.meta.env.VITE_APP_URL || 'https://fast-peptides.com'}/og-image.jpg`,
} as const

/**
 * Génère une URL canonique
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SEO_CONFIG.APP_URL}${cleanPath}`
}

/**
 * Génère une URL pour Open Graph
 */
export function getOgUrl(path: string): string {
  return getCanonicalUrl(path)
}
