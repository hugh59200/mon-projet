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

export async function createFullOrder(payload: CreateOrderPayload) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) throw new Error('Utilisateur non connecté')

  // 📦 1️⃣ Crée la commande dans Supabase
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
    _items: JSON.stringify(payload.items),
  })

  if (error) {
    console.error('❌ Erreur RPC create_full_order :', error)
    throw new Error(error.message)
  }

  const orderId = data

  console.log('✅ Commande complète créée :', orderId)

  // 📧 2️⃣ Envoi de l’email de confirmation via Edge Function
  try {
    const emailRes = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-confirmation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, // ✅ clé publique
        },
        body: JSON.stringify({
          order_id: orderId,
          email: payload.email,
          full_name: payload.full_name,
          total_amount: payload.total_amount,
          items: payload.items,
          created_at: new Date().toISOString(),
        }),
      },
    )

    const emailData = await emailRes.json()
    console.log('📨 Envoi email confirmation :', emailData)
  } catch (emailErr) {
    console.warn('⚠️ Erreur lors de l’envoi du mail (non bloquant)', emailErr)
  }

  // ✅ 3️⃣ Retour au front
  return {
    id: orderId,
    total: payload.total_amount,
    date: new Date().toISOString(),
    status: 'En attente',
  }
}
