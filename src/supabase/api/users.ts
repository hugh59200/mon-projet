import { supabase } from '../supabaseClient'
import type { Tables } from '../types/supabase'
import type { Role } from '../types/supabase.types'

export type Users = Tables<'profiles'>

/**
 * 🔹 Récupère la liste des utilisateurs
 */
export async function getUsers(): Promise<Users[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Users[]
}

/**
 * 🔹 Met à jour le rôle d’un utilisateur
 */
export async function updateUserRole(userId: string, newRole: Role): Promise<void> {
  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
  if (error) throw new Error(error.message)
}

/**
 * 🔹 Supprime un utilisateur
 */
export async function deleteUser(userId: string): Promise<void> {
  const { error } = await supabase.from('profiles').delete().eq('id', userId)
  if (error) throw new Error(error.message)
}
