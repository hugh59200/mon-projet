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
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('Missing session token')
  }

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user-by-admin`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ user_id: id }),
    },
  )

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Delete failed: ${txt}`)
  }
}

export async function deleteUserSelf() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('Missing session token')
  }

  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account-self`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({}),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Delete failed: ${txt}`)
  }

  await supabase.auth.signOut()
}

export async function updateUserRole(id: string, role: Role) {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
  handleMutation(error)
}
