export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'invalid_credentials',
  EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
  EMAIL_ALREADY_REGISTERED: 'user_already_exists',
  RATE_LIMIT: 'too_many_requests',
  PROVIDER_DISABLED: 'provider_disabled',
  TOKEN_EXPIRED: 'token_expired',
  WEAK_PASSWORD: 'weak_password',
  HOOK_FAILED: 'hook_payload_invalid_content_type', // ✅ NOUVEAU
  UNKNOWN: 'unknown',
} as const

export const AUTH_ERROR_MESSAGES = {
  invalid_credentials: 'Email ou mot de passe incorrect.',
  email_not_confirmed: 'Veuillez confirmer votre e-mail avant de vous connecter 📧',
  user_already_exists: 'Un compte existe déjà avec cet e-mail.',
  too_many_requests: 'Trop de tentatives, veuillez réessayer plus tard.',
  provider_disabled: 'Connexion via ce fournisseur indisponible.',
  token_expired: 'Votre session a expiré, veuillez vous reconnecter.',
  weak_password: 'Le mot de passe doit contenir au moins 6 caractères.',
  hook_payload_invalid_content_type:
    'Une erreur interne est survenue lors de l’envoi de l’e-mail. Veuillez réessayer.',
  unknown: 'Une erreur est survenue. Veuillez réessayer.',
}

export function mapAuthError(error: any): string {
  if (!error) return ''

  const code = error.code || ''
  const msg = (error.message || '').toLowerCase()

  // ✅ priorité aux codes exacts
  if (code && code in AUTH_ERROR_MESSAGES)
    return AUTH_ERROR_MESSAGES[code as keyof typeof AUTH_ERROR_MESSAGES]

  // ✅ détections fallback selon message Supabase
  if (msg.includes('invalid login')) return AUTH_ERROR_MESSAGES.invalid_credentials
  if (msg.includes('not confirmed')) return AUTH_ERROR_MESSAGES.email_not_confirmed
  if (msg.includes('already registered') || msg.includes('user already exists'))
    return AUTH_ERROR_MESSAGES.user_already_exists
  if (msg.includes('weak password')) return AUTH_ERROR_MESSAGES.weak_password
  if (msg.includes('provider')) return AUTH_ERROR_MESSAGES.provider_disabled

  return AUTH_ERROR_MESSAGES.unknown
}
