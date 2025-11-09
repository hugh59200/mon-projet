// src/api/ordersApi.ts
import { supabase } from '@/supabase/supabaseClient'
import type { Orders, OrderStatus } from '@/supabase/types/supabase.types'

/**
 * ✅ Liste des commandes
 */
export async function fetchOrders(): Promise<Orders[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Orders[]
}

/**
 * ✅ Supprime une commande
 */
export async function deleteOrderById(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * ✅ Met à jour le statut dans la DB (sans UI)
 */
export async function updateOrderStatusInDB(orderId: string, status: OrderStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select('id, email, full_name')
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Commande introuvable')

  return data // email, full_name, etc.
}
