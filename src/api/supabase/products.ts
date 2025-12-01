import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { ProductsInsert, ProductsUpdate } from '@/supabase/types/supabase.types'
import { handleApi, handleMutation } from '../helpers/handleError'

export async function fetchProducts() {
  const res = await supabase.from('products').select('*').order('created_at', { ascending: false })
  return handleApi(res)
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
