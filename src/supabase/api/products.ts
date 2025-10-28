import { supabase } from '@/supabase/supabaseClient'
import type { TablesInsert, TablesUpdate } from '@/supabase/types/supabase'

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function updateProduct(id: string, data: TablesUpdate<'products'>) {
  const { error } = await supabase.from('products').update(data).eq('id', id)
  if (error) throw error
}

export async function createProduct(data: TablesInsert<'products'>) {
  const { error } = await supabase.from('products').insert(data)
  if (error) throw error
}
