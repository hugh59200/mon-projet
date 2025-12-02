/**
 * Messages de validation localisés
 * À intégrer dans le système i18n existant
 */

export const validationMessagesFR = {
  validation: {
    required: 'Ce champ est requis',
    minLength: 'Minimum {n} caractères requis',
    maxLength: 'Maximum {n} caractères autorisés',
    error: 'Erreur de validation',

    // Email
    email: {
      invalid: 'Adresse e-mail invalide',
      tooLong: "L'adresse e-mail est trop longue",
      disposable: 'Les adresses e-mail jetables ne sont pas autorisées',
      alreadyUsed: 'Cette adresse e-mail est déjà utilisée',
    },

    // Password
    password: {
      enterPassword: 'Entrez un mot de passe',
      minLength: 'Au moins 8 caractères',
      lowercase: 'Une lettre minuscule',
      uppercase: 'Une lettre majuscule',
      number: 'Un chiffre',
      special: 'Un caractère spécial (!@#$%...)',
      noRepeat: 'Pas de répétitions (aaa, 111)',
      noSequence: 'Pas de séquences (123, abc)',
      tooCommon: 'Mot de passe trop courant',
      strong: 'Mot de passe robuste !',
      mismatch: 'Les mots de passe ne correspondent pas',
      strength: 'Force de mot de passe insuffisante (niveau {n} requis)',
      levels: {
        veryWeak: 'Très faible',
        weak: 'Faible',
        fair: 'Moyen',
        strong: 'Fort',
        veryStrong: 'Très fort',
      },
    },

    // Phone
    phone: {
      invalid: 'Numéro de téléphone invalide',
      unsupportedCountry: 'Pays non supporté',
      format: 'Format attendu : {value}',
    },

    // Postal code
    postalCode: {
      invalid: 'Code postal invalide (ex: {value})',
      unsupportedCountry: 'Pays non supporté',
    },

    // Numbers
    number: {
      min: 'La valeur doit être au moins {n}',
      max: 'La valeur doit être au maximum {n}',
      integer: 'Seuls les nombres entiers sont autorisés',
    },

    // Price
    price: {
      positive: 'Le prix doit être positif',
      format: 'Format invalide (ex: 12.99)',
    },

    // Name
    name: {
      invalid: 'Caractères non autorisés',
      tooShort: 'Au moins 2 caractères requis',
    },

    // URL
    url: {
      invalid: 'URL invalide',
    },

    // Slug
    slug: {
      invalid: 'Format slug invalide (lettres minuscules, chiffres et tirets uniquement)',
    },

    // Credit card
    card: {
      invalid: 'Numéro de carte invalide',
      expired: 'Carte expirée',
      cvvInvalid: 'CVV invalide',
    },

    // Generic field states
    field: {
      valid: 'Valide',
      checking: 'Vérification en cours...',
    },
  },
}

export const validationMessagesEN = {
  validation: {
    required: 'This field is required',
    minLength: 'Minimum {n} characters required',
    maxLength: 'Maximum {n} characters allowed',
    error: 'Validation error',

    // Email
    email: {
      invalid: 'Invalid email address',
      tooLong: 'Email address is too long',
      disposable: 'Disposable email addresses are not allowed',
      alreadyUsed: 'This email address is already in use',
    },

    // Password
    password: {
      enterPassword: 'Enter a password',
      minLength: 'At least 8 characters',
      lowercase: 'One lowercase letter',
      uppercase: 'One uppercase letter',
      number: 'One number',
      special: 'One special character (!@#$%...)',
      noRepeat: 'No repetitions (aaa, 111)',
      noSequence: 'No sequences (123, abc)',
      tooCommon: 'Password is too common',
      strong: 'Strong password!',
      mismatch: 'Passwords do not match',
      strength: 'Insufficient password strength (level {n} required)',
      levels: {
        veryWeak: 'Very weak',
        weak: 'Weak',
        fair: 'Fair',
        strong: 'Strong',
        veryStrong: 'Very strong',
      },
    },

    // Phone
    phone: {
      invalid: 'Invalid phone number',
      unsupportedCountry: 'Country not supported',
      format: 'Expected format: {value}',
    },

    // Postal code
    postalCode: {
      invalid: 'Invalid postal code (e.g. {value})',
      unsupportedCountry: 'Country not supported',
    },

    // Numbers
    number: {
      min: 'Value must be at least {n}',
      max: 'Value must be at most {n}',
      integer: 'Only whole numbers are allowed',
    },

    // Price
    price: {
      positive: 'Price must be positive',
      format: 'Invalid format (e.g. 12.99)',
    },

    // Name
    name: {
      invalid: 'Invalid characters',
      tooShort: 'At least 2 characters required',
    },

    // URL
    url: {
      invalid: 'Invalid URL',
    },

    // Slug
    slug: {
      invalid: 'Invalid slug format (lowercase letters, numbers and hyphens only)',
    },

    // Credit card
    card: {
      invalid: 'Invalid card number',
      expired: 'Card expired',
      cvvInvalid: 'Invalid CVV',
    },

    // Generic field states
    field: {
      valid: 'Valid',
      checking: 'Checking...',
    },
  },
}

/**
 * Messages de validation avec fallback
 * Utilisable sans i18n si nécessaire
 */
export function getValidationMessage(key: string, locale: 'fr' | 'en' = 'fr', params?: Record<string, string | number>): string {
  const messages = locale === 'fr' ? validationMessagesFR : validationMessagesEN

  // Naviguer dans l'objet avec la clé (ex: "validation.email.invalid")
  const keys = key.split('.')
  let current: any = messages

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k]
    } else {
      return key // Retourner la clé si non trouvée
    }
  }

  if (typeof current !== 'string') return key

  // Remplacer les paramètres
  if (params) {
    return current.replace(/\{(\w+)\}/g, (_, p) => String(params[p] ?? `{${p}}`))
  }

  return current
}
