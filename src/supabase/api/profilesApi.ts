import { supabase } from '../supabaseClient'
import type { Orders, Profiles } from '../types/supabase.types'
import { handleApi, handleApiMaybe, handleMutation } from './helpers/HandleError'

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
    .select('id, total_amount, created_at, status, order_number') // J'ai ajouté order_number c'est souvent utile
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5) // Passé à 5 pour voir un peu plus d'historique

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

// 🆕 AJOUT : La fonction qui appelle le RPC SQL qu'on vient de créer
export async function claimGuestOrders(email: string, userId: string) {
  const { data, error } = await supabase.rpc('claim_guest_orders', {
    p_email: email,
    p_user_id: userId,
  })

  if (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
  } else {
    console.log('Récupération commandes:', data)
  }
}
