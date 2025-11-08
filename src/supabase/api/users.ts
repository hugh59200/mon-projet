import { supabase } from '../supabaseClient'
import type { Profiles, Role } from '../types/supabase.types'

/**
 * 🔹 Récupère la liste des utilisateurs
 */
export async function getUsers(): Promise<Profiles[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Profiles[]
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
