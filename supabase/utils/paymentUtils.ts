// supabase/utils/paymentUtils.ts
import { supabase } from './clients.ts'

export async function updateOrderPaid(orderId: string, paymentIntentId: string) {
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      payment_intent_id: paymentIntentId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) throw error
}

export async function logPaymentEvent(provider: string, orderId: string | null, event: unknown) {
  await supabase.from('payment_events').insert({
    provider,
    order_id: orderId,
    payload: event,
    created_at: new Date().toISOString(),
  })
}

export function successResponse(orderId: string) {
  return { ok: true, orderId }
}

export function errorResponse(err: unknown) {
  return { ok: false, error: String(err) }
}
