export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'invalid_credentials',
  EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
  EMAIL_ALREADY_REGISTERED: 'email_exists',
  RATE_LIMIT: 'too_many_requests',
  PROVIDER_DISABLED: 'provider_disabled',
  TOKEN_EXPIRED: 'token_expired',
  UNKNOWN: 'unknown',
} as const

export const AUTH_ERROR_MESSAGES = {
  invalid_credentials: 'Email ou mot de passe incorrect.',
  email_not_confirmed: 'Veuillez confirmer votre e-mail avant de vous connecter 📧',
  email_exists: 'Un compte existe déjà avec cet e-mail.',
  too_many_requests: 'Trop de tentatives, veuillez réessayer plus tard.',
  provider_disabled: 'Connexion via ce fournisseur indisponible.',
  token_expired: 'Votre session a expiré, veuillez vous reconnecter.',
  unknown: 'Une erreur est survenue. Veuillez réessayer.',
}

export function mapAuthError(error: any): string {
  if (!error) return ''
  const code = error.code || null
  const msg = (error.message || '').toLowerCase()

  if (code in AUTH_ERROR_MESSAGES)
    return AUTH_ERROR_MESSAGES[code as keyof typeof AUTH_ERROR_MESSAGES]
  if (msg.includes('invalid login credentials')) return AUTH_ERROR_MESSAGES.invalid_credentials
  if (msg.includes('email not confirmed')) return AUTH_ERROR_MESSAGES.email_not_confirmed
  if (msg.includes('provider')) return AUTH_ERROR_MESSAGES.provider_disabled

  return AUTH_ERROR_MESSAGES.unknown
}
