import { supabase } from '../supabase/supabaseClient'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin'
  created_at: string
  avatar_url?: string | null
}

export async function fetchUsers(search = '', limit = 20, offset = 0) {
  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data as UserProfile[]
}

export async function updateUserRole(id: string, role: 'user' | 'admin') {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
  if (error) throw error
}

export async function deleteUserById(id: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  if (error) throw error
}
