import { supabase } from '@/supabase/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { mapAuthError } from '../constants/authErrors'

export type AuthResult = { success: true; user: User | null } | { success: false; message: string }

async function emailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('user_exists_by_email', { p_email: email })
  if (error) {
    console.warn('Failed emailExists RPC:', error.message)
    return false // fallback
  }
  return Boolean(data)
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // ➤ Cas spécial : mauvais identifiants → on différencie email ou mot de passe
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      const exists = await emailExists(email)
      return {
        success: false,
        message: exists ? 'Mot de passe incorrect.' : 'Aucun compte ne correspond à cet e-mail.',
      }
    }

    // ➤ Autres erreurs
    return { success: false, message: mapAuthError(error) }
  }

  // ➤ Email pas confirmé
  if (!data.user?.email_confirmed_at) {
    await supabase.auth.signOut()
    return {
      success: false,
      message: mapAuthError({ code: 'email_not_confirmed' }),
    }
  }

  return { success: true, user: data.user }
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { success: false, message: mapAuthError(error) }
  }

  // ✅ Pour un signup, on n'a pas de user immédiatement tant que l'email n'est pas confirmé
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

/* ✅ ENFIN : Support OAuth Provider (Google / Github / Facebook) */
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
