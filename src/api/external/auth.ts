import { supabase } from '@/supabase/supabaseClient'
import type { User } from '@supabase/supabase-js'

export type AuthResult = { success: true; user: User | null } | { success: false; message: string }

const AUTH_ERRORS: Record<string, string> = {
  invalid_credentials: 'Identifiants invalides.',
  email_not_confirmed: 'Veuillez confirmer votre email avant de vous connecter.',
  user_not_found: 'Aucun compte ne correspond à cet e-mail.',
  weak_password: 'Le mot de passe doit contenir au moins 6 caractères.',
  email_taken: 'Cette adresse email est déjà utilisée.',
  invalid_email: 'Adresse email invalide.',
  too_many_requests: 'Trop de tentatives. Veuillez réessayer plus tard.',
}

function mapAuthError(error: { code?: string; message?: string }): string {
  if (error.code && AUTH_ERRORS[error.code]) {
    return AUTH_ERRORS[error.code]!
  }
  return error.message || 'Une erreur est survenue.'
}

async function emailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('user_exists_by_email', { p_email: email })
  if (error) {
    console.warn('Failed emailExists RPC:', error.message)
    return false
  }
  return Boolean(data)
}

export async function signInWithPassword(
  email: string,
  password: string,
  captchaToken?: string,
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken,
    },
  })

  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      const exists = await emailExists(email)
      return {
        success: false,
        message: exists ? 'Mot de passe incorrect.' : 'Aucun compte ne correspond à cet e-mail.',
      }
    } else if (error.message.includes('Captcha')) {
      return { success: false, message: 'Échec de la vérification de sécurité (Captcha).' }
    }

    return { success: false, message: mapAuthError(error) }
  }

  if (!data.user?.email_confirmed_at) {
    await supabase.auth.signOut()
    return {
      success: false,
      message: mapAuthError({ code: 'email_not_confirmed' }),
    }
  }

  return { success: true, user: data.user }
}

export async function signUp(
  email: string,
  password: string,
  captchaToken?: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken,
    },
  })

  if (error) return { success: false, message: mapAuthError(error) }
  return { success: true, user: null }
}

export async function signInWithMagicLink(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  })

  if (error) return { success: false, message: mapAuthError(error) }
  return { success: true, user: null }
}

export async function signInWithProvider(
  provider: 'google' | 'github' | 'facebook',
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })

  if (error) return { success: false, message: mapAuthError(error) }
  return { success: true, user: null }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function resetPassword(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  })

  if (error) return { success: false, message: mapAuthError(error) }
  return { success: true, user: null }
}
