import { supabase } from '@/services/supabaseClient'

export interface ShipmentPayload {
  order_id: string
  email: string
  full_name?: string
  tracking_number?: string
  carrier?: string
}

export async function markOrderAsShipped(payload: ShipmentPayload) {
  // 🧾 Mise à jour du statut dans Supabase
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'shipped', shipped_at: new Date().toISOString() })
    .eq('id', payload.order_id)

  if (updateError) {
    console.error('❌ Erreur lors de la mise à jour du statut :', updateError)
    throw new Error(updateError.message)
  }

  // 🚀 Appel de la fonction Edge pour envoyer l'email
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-shipped`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      ...payload,
      shipped_at: new Date().toISOString(),
    }),
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    console.error('⚠️ Erreur lors de l’envoi de l’email d’expédition :', data)
    throw new Error('Erreur lors de l’envoi de l’email d’expédition')
  }

  console.log('✅ Email d’expédition envoyé :', data)
  return data
}
