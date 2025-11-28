import { supabase } from '@/supabase/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { mapAuthError } from '../constants/authErrors'

export type AuthResult = { success: true; user: User | null } | { success: false; message: string }

// Ta fonction RPC pour vérifier l'email (inchangée)
async function emailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('user_exists_by_email', { p_email: email })
  if (error) {
    console.warn('Failed emailExists RPC:', error.message)
    return false // fallback
  }
  return Boolean(data)
}

// ✅ MODIFICATION ICI : Ajout de captchaToken?
export async function signInWithPassword(
  email: string,
  password: string,
  captchaToken?: string, // <--- Nouvel argument
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken, // <--- Injection du token
    },
  })

  if (error) {
    // ➤ Cas spécial : mauvais identifiants
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      const exists = await emailExists(email)
      return {
        success: false,
        message: exists ? 'Mot de passe incorrect.' : 'Aucun compte ne correspond à cet e-mail.',
      }
    } else if (error.message.includes('Captcha')) {
      // Optionnel : Gérer spécifiquement l'erreur Captcha si besoin
      return { success: false, message: 'Échec de la vérification de sécurité (Captcha).' }
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

// ✅ MODIFICATION ICI : Ajout de captchaToken?
export async function signUp(
  email: string,
  password: string,
  captchaToken?: string, // <--- Nouvel argument
) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken, // <--- Injection du token
    },
  })

  if (error) return { success: false, message: mapAuthError(error) }
  return { success: true, user: null }
}

// ... Le reste (MagicLink, Provider) reste inchangé car pas besoin de Captcha manuel
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
