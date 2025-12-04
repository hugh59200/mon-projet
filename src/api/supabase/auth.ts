import { supabase, supabaseSilent } from '@/supabase/supabaseClient'
import type { AuthChangeEvent, Session, User, AuthOtpResponse } from '@supabase/supabase-js'

// ============================================================
// TYPES
// ============================================================

export interface SignUpWithMetadataOptions {
  email: string
  password: string
  fullName?: string
  captchaToken?: string
}

export interface ResetPasswordOptions {
  email: string
  redirectTo: string
  captchaToken?: string
}

export interface VerifyOtpOptions {
  tokenHash: string
  type: 'signup' | 'recovery' | 'invite' | 'magiclink' | 'email_change'
}

// ============================================================
// SESSION & STATE
// ============================================================

/**
 * Récupère la session courante
 */
export async function getSession(): Promise<{ session: Session | null; user: User | null }> {
  const { data } = await supabaseSilent.auth.getSession()
  return {
    session: data.session,
    user: data.session?.user ?? null,
  }
}

/**
 * Écoute les changements d'état d'authentification
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  return supabaseSilent.auth.onAuthStateChange(callback)
}

// ============================================================
// SIGN UP WITH METADATA (pour TrackOrderView)
// ============================================================

/**
 * Inscription avec métadonnées utilisateur (fullName, etc.)
 * Différent de signUp dans external/auth.ts qui ne prend pas de metadata
 */
export async function signUpWithMetadata(options: SignUpWithMetadataOptions): Promise<{ user: User | null; error: Error | null }> {
  const { data, error } = await supabase.auth.signUp({
    email: options.email,
    password: options.password,
    options: {
      data: {
        full_name: options.fullName || '',
      },
      captchaToken: options.captchaToken,
    },
  })

  return {
    user: data.user,
    error: error ? new Error(error.message) : null,
  }
}

// ============================================================
// PASSWORD RESET & UPDATE
// ============================================================

/**
 * Envoie un email de réinitialisation de mot de passe avec captcha
 */
export async function resetPasswordForEmail(
  options: ResetPasswordOptions,
): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(options.email, {
    redirectTo: options.redirectTo,
    captchaToken: options.captchaToken,
  })

  return {
    error: error ? new Error(error.message) : null,
  }
}

/**
 * Met à jour le mot de passe de l'utilisateur connecté
 */
export async function updatePassword(newPassword: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })

  return {
    error: error ? new Error(error.message) : null,
  }
}

// ============================================================
// OTP VERIFICATION
// ============================================================

/**
 * Vérifie un OTP (token de confirmation email, reset password, etc.)
 */
export async function verifyOtp(
  options: VerifyOtpOptions,
): Promise<{ user: User | null; error: Error | null }> {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: options.tokenHash,
    type: options.type,
  }) as AuthOtpResponse

  return {
    user: data.user ?? null,
    error: error ? new Error(error.message) : null,
  }
}
