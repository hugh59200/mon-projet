// src/services/orderService.ts
import { supabase } from '@/services/supabaseClient'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface CreateOrderPayload {
  user_id: string
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

export async function createOrder(payload: CreateOrderPayload) {
  // 1️⃣ Insertion de la commande dans la table Supabase
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: payload.user_id,
        email: payload.email,
        full_name: payload.full_name,
        address: payload.address,
        zip: payload.zip,
        city: payload.city,
        country: payload.country,
        payment_method: payload.payment_method,
        total_amount: payload.total_amount,
        items: payload.items,
        status: 'pending',
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('❌ Erreur lors de la création de la commande :', error)
    throw error
  }

  console.log('✅ Commande insérée :', data)

  return data
}
