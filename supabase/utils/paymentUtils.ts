import { supabase } from './clients.ts'

/**
 * 🔵 Standard update for any provider
 */
export async function updateOrderPaid(orderId: string, referenceId?: string) {
  await supabase
    .from('orders')
    .update({
      status: 'paid',
      payment_intent_id: referenceId ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
}

/**
 * 🔍 Generic JSON success response
 */
export function successResponse(orderId: string) {
  return {
    status: 'success',
    orderId,
  }
}

/**
 * ❌ Generic error response
 */
export function errorResponse(error: unknown) {
  return {
    status: 'error',
    error: String(error),
  }
}

/**
 * 🧾 Log webhook/payment events (optional but PRO)
 */
export async function logPaymentEvent(provider: string, orderId: string, payload: any) {
  await supabase.from('payment_events').insert({
    provider,
    order_id: orderId,
    payload: JSON.stringify(payload),
    created_at: new Date().toISOString(),
  })
}
