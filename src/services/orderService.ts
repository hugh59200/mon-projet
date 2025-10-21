// src/services/orderService.ts
import { supabase } from '@/services/supabaseClient'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface CreateOrderPayload {
  email: string
  full_name: string
  address: string
  zip: string
  city: string
  country: string
  payment_method: string
  total_amount: number
  items: OrderItem[]
}

/**
 * 🧾 Crée une commande complète via la fonction RPC Supabase
 */
export async function createFullOrder(payload: CreateOrderPayload) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Utilisateur non connecté')
  }

  const { data, error } = await supabase.rpc('create_full_order', {
    _user_id: user.id,
    _email: payload.email,
    _full_name: payload.full_name,
    _address: payload.address,
    _zip: payload.zip,
    _city: payload.city,
    _country: payload.country,
    _payment_method: payload.payment_method,
    _total_amount: payload.total_amount,
    _items: payload.items,
  })

  if (error) {
    console.error('❌ Erreur RPC create_full_order :', error)
    throw new Error(error.message)
  }

  console.log('✅ Commande complète créée :', data)

  return {
    id: data,
    total: payload.total_amount,
    date: new Date().toISOString(),
    status: 'En attente',
  }
}
