import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { Products, ProductsInsert, ProductsUpdate } from '@/supabase/types/supabase.types'
import { handleApi, handleApiMaybe, handleMutation } from '@/api/helpers/handleError'

export async function fetchProducts() {
  const res = await supabase.from('products').select('*').order('created_at', { ascending: false })
  return handleApi(res)
}

export async function fetchProductById(id: string): Promise<Products | null> {
  const res = await supabase.from('products').select('*').eq('id', id).maybeSingle()
  return handleApiMaybe(res)
}

export async function deleteProductById(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  handleMutation(error)
}

export async function updateProductInDB(id: string, payload: ProductsUpdate) {
  const { error } = await supabase.from('products').update(payload).eq('id', id)
  handleMutation(error)
}

export async function createProductInDB(payload: ProductsInsert) {
  const { error } = await supabase.from('products').insert(payload)
  handleMutation(error)
}
