import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { Orders, Profiles } from '@/supabase/types/supabase.types'
import { handleApi, handleApiMaybe, handleMutation } from '@/api/helpers/handleError'

export async function getProfile(id: string): Promise<Profiles | null> {
  const res = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
  return handleApiMaybe(res)
}

export async function updateProfileInfo(id: string, payload: Partial<Profiles>) {
  const { error } = await supabase.from('profiles').update(payload).eq('id', id)
  handleMutation(error)
}

export async function getLastOrders(userId: string): Promise<Partial<Orders>[]> {
  const res = await supabase
    .from('orders')
    .select('id, total_amount, created_at, status, order_number')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  return handleApi(res)
}

export async function uploadAvatar(id: string, file: File) {
  const ext = file.name.split('.').pop()
  const path = `${id}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  handleMutation(uploadError)

  const publicUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: path })
    .eq('id', id)

  handleMutation(updateError)

  return publicUrl
}

export async function updatePasswordApi(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  handleMutation(error)
}

export async function deleteAccountApi() {
  const { data, error } = await supabase.functions.invoke('delete-account', {
    body: {},
  })

  if (error || !data?.success) {
    throw new Error(data?.error ?? error?.message ?? 'Erreur suppression compte')
  }
}

export async function claimGuestOrders(email: string, userId: string) {
  const { error } = await supabase.rpc('claim_guest_orders', {
    p_email: email,
    p_user_id: userId,
  })

  if (error) throw new Error(error.message)
}

// UI Preferences
export async function getUiPreferences(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('ui_preferences')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data?.ui_preferences as string | null
}

export async function updateUiPreferences(userId: string, prefs: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ ui_preferences: prefs })
    .eq('id', userId)

  if (error) throw new Error(error.message)
}

export function getAvatarPublicUrl(path: string): string {
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}

/**
 * Retourne l'URL d'affichage de l'avatar (gère les chemins et URLs complètes)
 */
export function getAvatarDisplayUrl(avatarUrl: string | null): string | null {
  if (!avatarUrl) return null
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (avatarUrl.startsWith('http')) return avatarUrl
  // Sinon, convertir le chemin en URL publique
  return getAvatarPublicUrl(avatarUrl)
}

/**
 * Récupère le profil du support (premier admin disponible)
 */
export async function getSupportProfile(): Promise<Pick<
  Profiles,
  'id' | 'avatar_url' | 'full_name'
> | null> {
  const res = await supabase
    .from('profiles')
    .select('id, avatar_url, full_name')
    .eq('role', 'admin')
    .limit(1)
    .maybeSingle()
  return handleApiMaybe(res)
}
