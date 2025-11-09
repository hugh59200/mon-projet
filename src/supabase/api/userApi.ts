// src/services/userService.ts
import { supabase } from '@/supabase/supabaseClient'
import type { Role } from '@/supabase/types/supabase.types'

/**
 * ✅ Récupère les utilisateurs avec pagination et count
 */
export async function fetchUsersWithCount(search = '', limit = 20, offset = 0) {
  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  return query
}

/**
 * ✅ Supprime un utilisateur
 */
export async function deleteUserById(id: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * ✅ Met à jour le rôle
 */
export async function updateUserRole(id: string, role: Role) {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id)

  if (error) throw new Error(error.message)
}
