// functions/create-stripe-session/index.ts

import { PAYMENT_CANCEL_URL, PAYMENT_SUCCESS_URL_BASE, supabase } from '../../utils/clients.ts'

import { createHandler } from '../../utils/createHandler.ts'
import { stripeCreateCheckoutSession } from '../../utils/stripeClient.ts'

interface Payload {
  amount: number
  email: string
  orderId: string
}

Deno.serve(
  createHandler<Payload>(async (_req, body) => {
    const { amount, email, orderId } = body

    if (!amount || !email || !orderId) {
      throw new Error('amount, email, orderId requis')
    }

    const params: Record<string, string> = {
      mode: 'payment',
      customer_email: email,
      success_url: `${PAYMENT_SUCCESS_URL_BASE}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: PAYMENT_CANCEL_URL,
      'metadata[order_id]': orderId,

      // line_items[0]
      'line_items[0][price_data][currency]': 'eur',
      'line_items[0][price_data][product_data][name]': 'Commande Fast Peptides',
      'line_items[0][price_data][unit_amount]': String(Math.round(amount * 100)),
      'line_items[0][quantity]': '1',
    }

    const session = await stripeCreateCheckoutSession(params)

    await supabase
      .from('orders')
      .update({
        stripe_session_id: session.id,
        payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    return {
      url: session.url,
      sessionId: session.id,
      payment_intent_id: session.payment_intent,
    }
  }),
)
