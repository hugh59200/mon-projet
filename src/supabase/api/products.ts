import { supabase } from '@/supabase/supabaseClient'
import type { ProductsInsert, ProductsUpdate } from '../types/supabase.types'

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function updateProduct(id: string, data: ProductsUpdate) {
  const { error } = await supabase.from('products').update(data).eq('id', id)
  if (error) throw error
}

export async function createProduct(data: ProductsInsert) {
  const { error } = await supabase.from('products').insert(data)
  if (error) throw error
}
