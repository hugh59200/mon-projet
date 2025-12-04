/**
 * Formatters pour auto-formatage des champs de saisie
 * Style grands retailers (téléphone, CB, code postal, etc.)
 */

import type { SupportedCountry } from './types'

// ============================================
// FORMATTER TÉLÉPHONE
// ============================================

/**
 * Formate un numéro de téléphone français
 * Ex: "0612345678" → "06 12 34 56 78"
 */
export function formatPhoneFR(value: string): string {
  // Nettoyer (garder uniquement + et chiffres)
  let cleaned = value.replace(/[^\d+]/g, '')

  // Si commence par +33, convertir
  if (cleaned.startsWith('+33')) {
    cleaned = '0' + cleaned.slice(3)
  } else if (cleaned.startsWith('0033')) {
    cleaned = '0' + cleaned.slice(4)
  }

  // Limiter à 10 chiffres
  cleaned = cleaned.slice(0, 10)

  // Formater par groupes de 2
  const groups: string[] = []
  for (let i = 0; i < cleaned.length; i += 2) {
    groups.push(cleaned.slice(i, i + 2))
  }

  return groups.join(' ')
}

/**
 * Formate un numéro de téléphone international
 * Détecte le pays et applique le format approprié
 */
export function formatPhoneInternational(value: string, country: SupportedCountry = 'FR'): string {
  const cleaned = value.replace(/[^\d+]/g, '')

  switch (country) {
    case 'FR':
      return formatPhoneFR(value)

    case 'BE':
      // Format belge: +32 4XX XX XX XX
      if (cleaned.startsWith('+32') || cleaned.startsWith('0032')) {
        const num = cleaned.replace(/^\+32|^0032/, '')
        return `+32 ${num.slice(0, 3)} ${num.slice(3, 5)} ${num.slice(5, 7)} ${num.slice(7, 9)}`.trim()
      }
      return formatPhoneFR(value) // Fallback format français

    case 'CH':
      // Format suisse: +41 XX XXX XX XX
      if (cleaned.startsWith('+41') || cleaned.startsWith('0041')) {
        const num = cleaned.replace(/^\+41|^0041/, '')
        return `+41 ${num.slice(0, 2)} ${num.slice(2, 5)} ${num.slice(5, 7)} ${num.slice(7, 9)}`.trim()
      }
      return value

    default:
      return formatPhoneFR(value)
  }
}

// ============================================
// FORMATTER CODE POSTAL
// ============================================

/**
 * Formate un code postal selon le pays
 */
export function formatPostalCode(value: string, country: SupportedCountry = 'FR'): string {
  const cleaned = value.replace(/[^\dA-Za-z]/g, '').toUpperCase()

  switch (country) {
    case 'FR':
    case 'DE':
    case 'ES':
    case 'IT':
      // 5 chiffres
      return cleaned.replace(/\D/g, '').slice(0, 5)

    case 'BE':
    case 'CH':
    case 'LU':
      // 4 chiffres
      return cleaned.replace(/\D/g, '').slice(0, 4)

    case 'CA':
      // Format canadien: A1A 1A1
      const ca = cleaned.slice(0, 6)
      if (ca.length > 3) {
        return `${ca.slice(0, 3)} ${ca.slice(3, 6)}`
      }
      return ca

    case 'NL':
      // Format néerlandais: 1234 AB
      const digits = cleaned.slice(0, 4).replace(/\D/g, '')
      const letters = cleaned.slice(4, 6).replace(/\d/g, '')
      if (letters) {
        return `${digits} ${letters}`
      }
      return digits

    case 'PT':
      // Format portugais: 1234-567
      const pt = cleaned.replace(/\D/g, '').slice(0, 7)
      if (pt.length > 4) {
        return `${pt.slice(0, 4)}-${pt.slice(4, 7)}`
      }
      return pt

    default:
      return cleaned.slice(0, 10)
  }
}

// ============================================
// FORMATTER CARTE BANCAIRE
// ============================================

/**
 * Formate un numéro de carte bancaire
 * Ex: "4111111111111111" → "4111 1111 1111 1111"
 */
export function formatCreditCard(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 16)

  // Détecter le type de carte pour le format approprié
  const isAmex = /^3[47]/.test(cleaned)

  if (isAmex) {
    // Format AMEX: XXXX XXXXXX XXXXX
    return [
      cleaned.slice(0, 4),
      cleaned.slice(4, 10),
      cleaned.slice(10, 15),
    ].filter(Boolean).join(' ')
  }

  // Format standard: XXXX XXXX XXXX XXXX
  const groups: string[] = []
  for (let i = 0; i < cleaned.length; i += 4) {
    groups.push(cleaned.slice(i, i + 4))
  }

  return groups.join(' ')
}

/**
 * Formate la date d'expiration d'une carte
 * Ex: "1225" → "12/25"
 */
export function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 4)

  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
  }

  return cleaned
}

/**
 * Formate le CVV (3 ou 4 chiffres)
 */
export function formatCVV(value: string, isAmex = false): string {
  const maxLength = isAmex ? 4 : 3
  return value.replace(/\D/g, '').slice(0, maxLength)
}

// ============================================
// FORMATTER PRIX
// ============================================

/**
 * Formate un prix avec 2 décimales
 * Ex: "1234.5" → "1 234,50"
 */
export function formatPrice(value: string, locale: string = 'fr-FR', currency: string = 'EUR'): string {
  const num = parseFloat(value.replace(',', '.').replace(/[^\d.]/g, ''))

  if (isNaN(num)) return value

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

/**
 * Formate un nombre avec séparateur de milliers
 * Ex: "1234567" → "1 234 567"
 */
export function formatNumber(value: string, locale: string = 'fr-FR'): string {
  const num = parseFloat(value.replace(',', '.').replace(/[^\d.-]/g, ''))

  if (isNaN(num)) return value

  return new Intl.NumberFormat(locale).format(num)
}

// ============================================
// FORMATTER NOM
// ============================================

/**
 * Capitalise la première lettre de chaque mot
 * Ex: "jean-pierre dupont" → "Jean-Pierre Dupont"
 */
export function formatName(value: string): string {
  return value
    .toLowerCase()
    .split(/(\s+|-)/g)
    .map(part => {
      if (part === ' ' || part === '-') return part
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join('')
}

// ============================================
// FORMATTER SLUG
// ============================================

/**
 * Génère un slug à partir d'un texte
 * Ex: "Mon Article de Blog" → "mon-article-de-blog"
 */
export function formatSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder lettres, chiffres, espaces, tirets
    .trim()
    .replace(/\s+/g, '-') // Espaces → tirets
    .replace(/-+/g, '-') // Plusieurs tirets → un seul
}

// ============================================
// FORMATTER IBAN
// ============================================

/**
 * Formate un IBAN
 * Ex: "FR7630006000011234567890189" → "FR76 3000 6000 0112 3456 7890 189"
 */
export function formatIBAN(value: string): string {
  const cleaned = value.replace(/\s/g, '').toUpperCase()

  const groups: string[] = []
  for (let i = 0; i < cleaned.length; i += 4) {
    groups.push(cleaned.slice(i, i + 4))
  }

  return groups.join(' ')
}

// ============================================
// FACTORY POUR INPUT HANDLERS
// ============================================

/**
 * Crée un handler d'input avec formatter
 * Utilisable directement sur @input
 */
export function createInputFormatter(formatter: (value: string) => string) {
  return (event: Event) => {
    const input = event.target as HTMLInputElement
    const cursorPosition = input.selectionStart ?? 0
    const oldLength = input.value.length

    input.value = formatter(input.value)

    // Ajuster la position du curseur
    const newLength = input.value.length
    const newPosition = Math.max(0, cursorPosition + (newLength - oldLength))

    // Remettre le curseur à la bonne position
    requestAnimationFrame(() => {
      input.setSelectionRange(newPosition, newPosition)
    })

    return input.value
  }
}
