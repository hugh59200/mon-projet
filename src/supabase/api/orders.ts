import { supabase } from '../supabaseClient'
import type { Orders, OrderStatus } from '../types/supabase.types'

/**
 * 🔹 Récupère toutes les commandes
 */
export async function getOrders(): Promise<Orders[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Orders[]
}

export async function updateOrderStatusAndNotify(
  orderId: string,
  status: string,
  email: string,
  fullName?: string,
) {
  // 1️⃣ Mise à jour dans la DB
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)

  if (error) throw error

  // 2️⃣ Appel de la fonction Edge (envoi de mail)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  await fetch(`${supabaseUrl}/functions/v1/order-status-update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({
      order_id: orderId,
      status,
      email,
      full_name: fullName,
    }),
  })
}

/**
 * 🔹 Met à jour le statut d’une commande + déclenche la fonction Edge
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  // 1️⃣ Mise à jour du statut dans la DB
  const { data: updated, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select('id, email, full_name')
    .single()

  if (error) throw new Error(error.message)
  if (!updated) throw new Error('Commande introuvable')

  // 2️⃣ Appel de la fonction Edge pour envoyer la notification
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    const response = await fetch(`${supabaseUrl}/functions/v1/order-status-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        status,
        email: updated.email,
        full_name: updated.full_name,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.warn('⚠️ Edge Function: réponse non OK', errText)
    } else {
      const result = await response.json().catch(() => null)
      console.log('📤 Edge Function result:', result)
    }
  } catch (err) {
    console.warn('⚠️ Échec de la notification (Edge Function):', err)
  }
}

/**
 * 🔹 Supprime une commande (optionnel — selon politique admin)
 */
export async function deleteOrder(orderId: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', orderId)
  if (error) throw new Error(error.message)
}
