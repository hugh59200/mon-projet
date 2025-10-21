// src/services/orderService.ts
import { supabase } from '@/services/supabaseClient'

export interface ShipmentPayload {
  order_id: string
  email: string
  full_name?: string
  tracking_number?: string
  carrier?: string
}

/**
 * 🚚 Marque une commande comme expédiée et notifie le client par email
 */
export async function markOrderAsShipped(payload: ShipmentPayload) {
  // 🧾 1️⃣ Met à jour le statut de la commande
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'shipped',
      shipped_at: new Date().toISOString(),
      tracking_number: payload.tracking_number || null,
      carrier: payload.carrier || null,
    })
    .eq('id', payload.order_id)

  if (updateError) {
    console.error('❌ Erreur mise à jour statut commande :', updateError)
    throw new Error(updateError.message)
  }

  // 📤 2️⃣ Envoie l’email via la fonction `order-status-update`
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-status-update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      order_id: payload.order_id,
      status: 'shipped',
      email: payload.email,
      full_name: payload.full_name,
      tracking_number: payload.tracking_number,
      carrier: payload.carrier,
    }),
  })

  const data = await res.json()

  if (!data.success) {
    console.error('⚠️ Erreur lors de l’envoi de l’email expédition :', data)
    throw new Error('Erreur lors de l’envoi de l’email d’expédition')
  }

  console.log('✅ Email expédition envoyé avec succès :', data)
  return data
}
