import { supabase } from '@/supabase/supabaseClient'

export interface ShipmentPayload {
  order_id: string
  email: string
  full_name?: string
  tracking_number?: string
  carrier?: string
}

export async function markOrderAsShipped(payload: ShipmentPayload) {
  // 1. Met à jour le statut de la commande
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
    console.error('Erreur mise à jour statut commande :', updateError)
    throw new Error(updateError.message)
  }

  // 2. Envoie l'email via la fonction `order-status-update`
  const { data, error } = await supabase.functions.invoke('order-status-update', {
    body: {
      order_id: payload.order_id,
      status: 'shipped',
      email: payload.email,
      full_name: payload.full_name,
      tracking_number: payload.tracking_number,
      carrier: payload.carrier,
    },
  })

  if (error || !data?.success) {
    console.error("Erreur lors de l'envoi de l'email expédition :", error ?? data)
    throw new Error(
      data?.error ?? error?.message ?? "Erreur lors de l'envoi de l'email d'expédition",
    )
  }

  console.log('Email expédition envoyé avec succès :', data)
  return data
}
