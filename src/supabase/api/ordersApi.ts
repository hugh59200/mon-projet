import { supabase } from '../supabaseClient'
import type { OrdersFullView, OrderStatus } from '../types/supabase.types'
import { handleApi, handleMutation } from './helpers/HandleError'

/** ✅ Récupère toutes les commandes */
export async function fetchOrders(): Promise<OrdersFullView[]> {
  const res = await supabase
    .from('orders_full_view')
    .select('*')
    .order('created_at', { ascending: false })

  return handleApi(res)
}

/** ✅ Suppression sécurisée */
export async function deleteOrderById(id: string) {
  const { error } = await supabase.from('orders').delete().eq('id', id)

  handleMutation(error)
}

/** ✅ Mise à jour du statut via RPC ADMIN */
export async function updateOrderStatusInDB(orderId: string, status: OrderStatus) {
  const { data, error } = await supabase.rpc('admin_update_order_status', {
    p_order_id: orderId,
    p_new_status: status,
    p_send_email: true,
  })

  handleMutation(error)
  return data as OrdersFullView
}
