import { supabase } from '../supabaseClient'
import type { Role } from '../types/supabase.types'
import { handleMutation } from './helpers/HandleError'

export async function fetchUsersWithCount(search = '', limit = 20, offset = 0) {
  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  const res = await query
  handleMutation(res.error)
  return res
}

export async function deleteUserById(id: string) {
  const { data, error } = await supabase.functions.invoke('delete-user-by-admin', {
    body: { user_id: id },
  })

  if (error || !data?.success) {
    throw new Error(data?.error ?? error?.message ?? 'Delete failed')
  }
}

export async function deleteUserSelf() {
  const { data, error } = await supabase.functions.invoke('delete-account-self', {
    body: {},
  })

  if (error || !data?.success) {
    throw new Error(data?.error ?? error?.message ?? 'Delete failed')
  }

  await supabase.auth.signOut()
}

export async function updateUserRole(id: string, role: Role) {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
  handleMutation(error)
}
