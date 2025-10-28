import { supabase } from '../supabaseClient'
import type { Tables } from '../types/supabase'
import type { OrderStatus } from '../types/supabase.types'

type OrderRow = Tables<'orders'>

/**
 * 🔹 Récupère toutes les commandes
 */
export async function getOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as OrderRow[]
}

/**
 * 🔹 Met à jour le statut d’une commande
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) throw new Error(error.message)
}

/**
 * 🔹 Supprime une commande (optionnel — selon politique admin)
 */
export async function deleteOrder(orderId: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', orderId)
  if (error) throw new Error(error.message)
}
