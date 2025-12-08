/**
 * ══════════════════════════════════════════════════════════════
 * BACKGROUNDS CONFIGURATION
 * ══════════════════════════════════════════════════════════════
 *
 * Configuration centralisée pour les images de fond des sections.
 * Chaque section a une image et une opacité recommandée selon le thème.
 *
 * Usage:
 * ```ts
 * import { SECTION_BACKGROUNDS } from '@/config/backgrounds'
 * const { image, opacity } = SECTION_BACKGROUNDS.podium
 * ```
 */

// ══════════════════════════════════════════════════════════════
// IMPORTS — Background Images
// ══════════════════════════════════════════════════════════════

import bgCtaImage from '@/assets/bg-cta.png'
import bgNewsletterImage from '@/assets/bg-newsletter.png'
import bgPodiumImage from '@/assets/bg-podium.png'
import bgQualityImage from '@/assets/bg-quality.png'

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

export interface BackgroundConfig {
  /** Image source */
  image: string
  /** Opacité pour le thème sombre (0-1) */
  opacityDark: number
  /** Opacité pour le thème clair (0-1) */
  opacityLight: number
  /** Description de l'usage */
  description: string
}

export type SectionKey = 'podium' | 'quality' | 'newsletter' | 'cta'

// ══════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════

/**
 * Configuration des backgrounds par section
 *
 * Opacités recommandées :
 * - Dark theme : 0.3-0.5 (images visibles, texte lisible)
 * - Light theme : 0.1-0.2 (subtil, ne pas dominer)
 */
export const SECTION_BACKGROUNDS: Record<SectionKey, BackgroundConfig> = {
  podium: {
    image: bgPodiumImage,
    opacityDark: 0.4,
    opacityLight: 0.15,
    description: 'Section Best-Sellers avec podium métallique or/argent/bronze',
  },

  quality: {
    image: bgQualityImage,
    opacityDark: 0.35,
    opacityLight: 0.12,
    description: 'Section Qualité/Réassurance avec visuel laboratoire',
  },

  newsletter: {
    image: bgNewsletterImage,
    opacityDark: 0.4,
    opacityLight: 0.15,
    description: 'Section Newsletter avec ambiance premium',
  },

  cta: {
    image: bgCtaImage,
    opacityDark: 0.5,
    opacityLight: 0.2,
    description: 'Section CTA finale avec visuel impactant',
  },
}

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Retourne l'opacité appropriée selon le thème actuel
 */
export function getBackgroundOpacity(
  section: SectionKey,
  isDarkTheme: boolean = true
): number {
  const config = SECTION_BACKGROUNDS[section]
  return isDarkTheme ? config.opacityDark : config.opacityLight
}

/**
 * Retourne la config complète d'une section
 */
export function getBackgroundConfig(section: SectionKey): BackgroundConfig {
  return SECTION_BACKGROUNDS[section]
}

// ══════════════════════════════════════════════════════════════
// EXPORTS DIRECTS — Pour import simplifié
// ══════════════════════════════════════════════════════════════

export { bgCtaImage, bgNewsletterImage, bgPodiumImage, bgQualityImage }
