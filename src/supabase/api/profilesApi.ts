// ✅ src/supabase/api/profilesApi.ts
import { supabase } from '../supabaseClient'
import type { Orders, Profiles } from '../types/supabase.types'

/**
 * ✅ Récupère un profil complet
 */
export async function getProfile(id: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()

  if (error) throw new Error(error.message)
  return data as Profiles | null
}

/**
 * ✅ Mise à jour du profil
 */
export async function updateProfileInfo(id: string, payload: Partial<Profiles>) {
  const { error } = await supabase.from('profiles').update(payload).eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * ✅ Changement d’avatar (upload + mise à jour DB)
 */
export async function uploadAvatar(userId: string, file: File) {
  const ext = file.name.split('.').pop()
  const path = `${userId}-${Date.now()}.${ext}`

  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (error) throw new Error(error.message)

  const publicUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: path })
    .eq('id', userId)
  if (updateError) throw new Error(updateError.message)

  return publicUrl
}

/**
 * ✅ Charge les trois dernières commandes
 */
export async function getLastOrders(userId: string): Promise<Partial<Orders>[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('id, total_amount, created_at, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) throw new Error(error.message)
  return data as Partial<Orders>[]
}

/**
 * ✅ Mise à jour du mot de passe via auth
 */
export async function updatePasswordApi(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
}

export async function deleteAccountApi() {
  const token = (await supabase.auth.getSession()).data.session?.access_token
  if (!token) throw new Error('Utilisateur non authentifié')

  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Erreur suppression compte')
  }

  return true
}
