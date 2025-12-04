/**
 * Validateurs professionnels pour formulaires
 * Inspiré des standards grands retailers (Amazon, Zalando, etc.)
 */

import type { SupportedCountry, PasswordStrength, ValidatorFn } from './types'

// ============================================
// CONFIGURATION PAR PAYS
// ============================================
export const COUNTRY_CONFIGS: Record<SupportedCountry, {
  phonePrefix: string
  phoneRegex: RegExp
  postalCodeRegex: RegExp
  postalCodeExample: string
}> = {
  FR: {
    phonePrefix: '+33',
    phoneRegex: /^(?:\+33|0033|0)[1-9](?:[0-9]{8})$/,
    postalCodeRegex: /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/,
    postalCodeExample: '75001',
  },
  BE: {
    phonePrefix: '+32',
    phoneRegex: /^(?:\+32|0032|0)[1-9](?:[0-9]{7,8})$/,
    postalCodeRegex: /^[1-9]\d{3}$/,
    postalCodeExample: '1000',
  },
  CH: {
    phonePrefix: '+41',
    phoneRegex: /^(?:\+41|0041|0)[1-9](?:[0-9]{8})$/,
    postalCodeRegex: /^[1-9]\d{3}$/,
    postalCodeExample: '8000',
  },
  LU: {
    phonePrefix: '+352',
    phoneRegex: /^(?:\+352|00352)[1-9](?:[0-9]{5,8})$/,
    postalCodeRegex: /^[1-9]\d{3}$/,
    postalCodeExample: '1234',
  },
  CA: {
    phonePrefix: '+1',
    phoneRegex: /^(?:\+1|001)?[2-9]\d{2}[2-9]\d{6}$/,
    postalCodeRegex: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    postalCodeExample: 'H2X 1Y4',
  },
  DE: {
    phonePrefix: '+49',
    phoneRegex: /^(?:\+49|0049|0)[1-9](?:[0-9]{9,10})$/,
    postalCodeRegex: /^\d{5}$/,
    postalCodeExample: '10115',
  },
  ES: {
    phonePrefix: '+34',
    phoneRegex: /^(?:\+34|0034)?[6-9]\d{8}$/,
    postalCodeRegex: /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/,
    postalCodeExample: '28001',
  },
  IT: {
    phonePrefix: '+39',
    phoneRegex: /^(?:\+39|0039)?3\d{9}$/,
    postalCodeRegex: /^\d{5}$/,
    postalCodeExample: '00100',
  },
  NL: {
    phonePrefix: '+31',
    phoneRegex: /^(?:\+31|0031|0)[1-9](?:[0-9]{8})$/,
    postalCodeRegex: /^[1-9]\d{3}\s?[A-Za-z]{2}$/,
    postalCodeExample: '1012 AB',
  },
  PT: {
    phonePrefix: '+351',
    phoneRegex: /^(?:\+351|00351)?[2-9]\d{8}$/,
    postalCodeRegex: /^\d{4}-\d{3}$/,
    postalCodeExample: '1000-001',
  },
}

// ============================================
// VALIDATEURS DE BASE
// ============================================

/**
 * Champ requis
 */
export const required = (message?: string): ValidatorFn => {
  return (value: string) => {
    if (!value || value.trim() === '') {
      return message ?? 'validation.required'
    }
    return null
  }
}

/**
 * Longueur minimale
 */
export const minLength = (min: number, message?: string): ValidatorFn => {
  return (value: string) => {
    if (value && value.length < min) {
      return message ?? `validation.minLength:${min}`
    }
    return null
  }
}

/**
 * Longueur maximale
 */
export const maxLength = (max: number, message?: string): ValidatorFn => {
  return (value: string) => {
    if (value && value.length > max) {
      return message ?? `validation.maxLength:${max}`
    }
    return null
  }
}

// ============================================
// VALIDATEUR EMAIL
// ============================================

/**
 * Validation email RFC 5322 (simplifiée mais robuste)
 * Gère les cas courants + domaines internationaux
 */
export const email = (message?: string): ValidatorFn => {
  // Regex email robuste (couvre 99.9% des cas réels)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

  return (value: string) => {
    if (!value) return null // Le champ requis est géré séparément

    const trimmed = value.trim().toLowerCase()

    // Vérifications de base
    if (trimmed.length > 254) {
      return message ?? 'validation.email.tooLong'
    }

    if (!emailRegex.test(trimmed)) {
      return message ?? 'validation.email.invalid'
    }

    // Vérifier le domaine (partie après @)
    const [, domain] = trimmed.split('@')
    if (domain) {
      // Bloquer les domaines jetables courants (sauf en développement)
      const isDev = import.meta.env.DEV
      if (!isDev) {
        const disposableDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com', 'yopmail.com']
        if (disposableDomains.some(d => domain.endsWith(d))) {
          return 'validation.email.disposable'
        }
      }
    }

    return null
  }
}

// ============================================
// VALIDATEUR MOT DE PASSE
// ============================================

/**
 * Calcul de la force du mot de passe
 * Score 0-4 avec feedback détaillé
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  if (!password) {
    return {
      score: 0,
      label: 'very_weak',
      feedback: ['validation.password.enterPassword'],
      color: 'var(--color-danger-500)',
    }
  }

  // Longueur
  if (password.length >= 8) score++
  else feedback.push('validation.password.minLength')

  if (password.length >= 12) score++

  // Minuscules
  if (/[a-z]/.test(password)) score += 0.5
  else feedback.push('validation.password.lowercase')

  // Majuscules
  if (/[A-Z]/.test(password)) score += 0.5
  else feedback.push('validation.password.uppercase')

  // Chiffres
  if (/\d/.test(password)) score += 0.5
  else feedback.push('validation.password.number')

  // Caractères spéciaux
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 0.5
  else feedback.push('validation.password.special')

  // Pénalités
  // Séquences répétitives
  if (/(.)\1{2,}/.test(password)) {
    score -= 0.5
    feedback.push('validation.password.noRepeat')
  }

  // Séquences numériques (123, 321)
  if (/(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(password)) {
    score -= 0.5
    feedback.push('validation.password.noSequence')
  }

  // Mots de passe courants
  const commonPasswords = ['password', 'azerty', 'qwerty', '123456', 'motdepasse', 'admin']
  if (commonPasswords.some(p => password.toLowerCase().includes(p))) {
    score = 0
    feedback.push('validation.password.tooCommon')
  }

  // Normaliser le score
  const normalizedScore = Math.max(0, Math.min(4, Math.round(score)))

  const labels: Record<number, PasswordStrength['label']> = {
    0: 'very_weak',
    1: 'weak',
    2: 'fair',
    3: 'strong',
    4: 'very_strong',
  }

  const colors: Record<number, string> = {
    0: 'var(--color-danger-500)',
    1: 'var(--color-warning-500)',
    2: 'var(--color-warning-400)',
    3: 'var(--color-success-400)',
    4: 'var(--color-success-500)',
  }

  return {
    score: normalizedScore,
    label: labels[normalizedScore] ?? 'very_weak',
    feedback: feedback.length > 0 ? feedback : ['validation.password.strong'],
    color: colors[normalizedScore] ?? 'var(--color-danger-500)',
  }
}

/**
 * Validateur mot de passe avec niveau requis
 */
export const password = (minStrength: 0 | 1 | 2 | 3 | 4 = 2): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    const strength = calculatePasswordStrength(value)

    if (strength.score < minStrength) {
      return `validation.password.strength:${minStrength}`
    }

    return null
  }
}

/**
 * Confirmation de mot de passe
 */
export const passwordConfirm = (passwordGetter: () => string): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    const pwd = passwordGetter()
    if (value !== pwd) {
      return 'validation.password.mismatch'
    }

    return null
  }
}

// ============================================
// VALIDATEUR TÉLÉPHONE
// ============================================

/**
 * Validation téléphone avec support multi-pays
 */
export const phone = (country: SupportedCountry = 'FR', message?: string): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    // Nettoyer le numéro (garder + et chiffres uniquement)
    const cleaned = value.replace(/[^\d+]/g, '')

    const config = COUNTRY_CONFIGS[country]
    if (!config) {
      return 'validation.phone.unsupportedCountry'
    }

    if (!config.phoneRegex.test(cleaned)) {
      return message ?? 'validation.phone.invalid'
    }

    return null
  }
}

/**
 * Validation téléphone international (détecte automatiquement le pays)
 */
export const phoneInternational = (): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    const cleaned = value.replace(/[^\d+]/g, '')

    // Détecter le pays par le préfixe
    for (const [, config] of Object.entries(COUNTRY_CONFIGS)) {
      if (cleaned.startsWith(config.phonePrefix.replace('+', ''))) {
        if (config.phoneRegex.test(cleaned)) {
          return null
        }
      }
    }

    // Si pas de préfixe international, essayer France par défaut
    if (!cleaned.startsWith('+') && !cleaned.startsWith('00')) {
      if (COUNTRY_CONFIGS.FR.phoneRegex.test(cleaned)) {
        return null
      }
    }

    return 'validation.phone.invalid'
  }
}

// ============================================
// VALIDATEUR CODE POSTAL
// ============================================

/**
 * Validation code postal avec support multi-pays
 */
export const postalCode = (country: SupportedCountry = 'FR', message?: string): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    const config = COUNTRY_CONFIGS[country]
    if (!config) {
      return 'validation.postalCode.unsupportedCountry'
    }

    const cleaned = value.trim().toUpperCase()

    if (!config.postalCodeRegex.test(cleaned)) {
      return message ?? `validation.postalCode.invalid:${config.postalCodeExample}`
    }

    return null
  }
}

// ============================================
// VALIDATEURS NUMÉRIQUES
// ============================================

/**
 * Valeur numérique minimale
 */
export const min = (minValue: number, message?: string): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    const num = parseFloat(value)
    if (isNaN(num) || num < minValue) {
      return message ?? `validation.number.min:${minValue}`
    }

    return null
  }
}

/**
 * Valeur numérique maximale
 */
export const max = (maxValue: number, message?: string): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    const num = parseFloat(value)
    if (isNaN(num) || num > maxValue) {
      return message ?? `validation.number.max:${maxValue}`
    }

    return null
  }
}

/**
 * Nombre entier uniquement
 */
export const integer = (message?: string): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    if (!/^-?\d+$/.test(value)) {
      return message ?? 'validation.number.integer'
    }

    return null
  }
}

/**
 * Prix valide (2 décimales max, positif)
 */
export const price = (message?: string): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    const num = parseFloat(value)
    if (isNaN(num) || num < 0) {
      return message ?? 'validation.price.positive'
    }

    // Vérifier 2 décimales max
    if (!/^\d+(\.\d{1,2})?$/.test(value) && !/^\d+(,\d{1,2})?$/.test(value)) {
      return message ?? 'validation.price.format'
    }

    return null
  }
}

// ============================================
// VALIDATEURS TEXTE
// ============================================

/**
 * Nom valide (lettres, espaces, tirets, apostrophes)
 */
export const name = (message?: string): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    // Accepte les lettres (y compris accents), espaces, tirets, apostrophes
    if (!/^[\p{L}\s'-]+$/u.test(value.trim())) {
      return message ?? 'validation.name.invalid'
    }

    // Au moins 2 caractères
    if (value.trim().length < 2) {
      return message ?? 'validation.name.tooShort'
    }

    return null
  }
}

/**
 * URL valide
 */
export const url = (message?: string): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    try {
      new URL(value)
      return null
    } catch {
      return message ?? 'validation.url.invalid'
    }
  }
}

/**
 * Slug valide (URL-friendly)
 */
export const slug = (message?: string): ValidatorFn => {
  return (value: string) => {
    if (!value) return null

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return message ?? 'validation.slug.invalid'
    }

    return null
  }
}

// ============================================
// VALIDATEURS ASYNC
// ============================================

/**
 * Vérifier si un email existe déjà (à connecter avec l'API)
 */
export const emailUnique = (checkFn: (email: string) => Promise<boolean>): ValidatorFn => {
  return async (value: string) => {
    if (!value) return null

    try {
      const exists = await checkFn(value)
      if (exists) {
        return 'validation.email.alreadyUsed'
      }
    } catch {
      // En cas d'erreur, on laisse passer (validation côté serveur)
      return null
    }

    return null
  }
}

// ============================================
// COMBINATEURS
// ============================================

/**
 * Combine plusieurs validateurs
 */
export const compose = (...validators: ValidatorFn[]): ValidatorFn => {
  return async (value: string) => {
    for (const validator of validators) {
      const result = await validator(value)
      if (result) return result
    }
    return null
  }
}

/**
 * Validation conditionnelle
 */
export const when = (condition: () => boolean, validator: ValidatorFn): ValidatorFn => {
  return (value: string) => {
    if (!condition()) return null
    return validator(value)
  }
}
