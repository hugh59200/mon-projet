import { supabase } from './clients.ts'

// V2 : On met à jour le statut et potentiellement l'ID de paiement
export async function updateOrderPaid(orderId: string, paymentIntentId: string | null) {
  const updates: any = {
    status: 'paid',
    updated_at: new Date().toISOString(),
  }

  // Si on reçoit un paymentIntentId (depuis le webhook), on le met à jour
  if (paymentIntentId) {
    updates.payment_intent_id = paymentIntentId
  }

  const { error } = await supabase.from('orders').update(updates).eq('id', orderId)

  if (error) throw error
}

export async function logPaymentEvent(provider: string, orderId: string | null, event: unknown) {
  await supabase.from('payment_events').insert({
    provider,
    order_id: orderId,
    payload: event, // Le champ est bien 'payload' type jsonb
    created_at: new Date().toISOString(),
  })
}
