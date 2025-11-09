import { supabase } from '../supabaseClient'
import type { Orders, OrderStatus } from '../types/supabase.types'
import { handleApi, handleMutation } from './helpers/HandleError'

export async function fetchOrders(): Promise<Orders[]> {
  const res = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  return handleApi(res)
}

export async function deleteOrderById(id: string) {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  handleMutation(error)
}

export async function updateOrderStatusInDB(orderId: string, status: OrderStatus) {
  const res = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select('id, email, full_name')
    .single()

  return handleApi(res)
}
