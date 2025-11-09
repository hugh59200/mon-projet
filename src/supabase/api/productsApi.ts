import { supabase } from '@/supabase/supabaseClient'
import type { Products, ProductsInsert, ProductsUpdate } from '@/supabase/types/supabase.types'

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Products[]
}

export async function deleteProductById(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function updateProductInDB(id: string, data: ProductsUpdate) {
  const { error } = await supabase.from('products').update(data).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function createProductInDB(data: ProductsInsert) {
  const { error } = await supabase.from('products').insert(data)
  if (error) throw new Error(error.message)
}
