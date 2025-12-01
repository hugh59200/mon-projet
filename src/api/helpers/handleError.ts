import type { PostgrestSingleResponse } from '@supabase/supabase-js'

export function handleApi<T>(res: PostgrestSingleResponse<T>) {
  if (res.error) throw new Error(res.error.message)
  return res.data as T
}

export function handleApiMaybe<T>(res: PostgrestSingleResponse<T | null>) {
  if (res.error) throw new Error(res.error.message)
  return res.data ?? null
}

// Works with PostgrestError, StorageError, AuthError
export function handleMutation(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}
