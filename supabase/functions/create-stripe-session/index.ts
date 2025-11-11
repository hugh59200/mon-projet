import { stripe, supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'

interface Payload {
  amount: number
  email: string
  orderId: string
}

Deno.serve(
  createHandler<Payload>(async (_req, body) => {
    const { amount, email, orderId } = body

    if (!amount || !email || !orderId) {
      throw new Error('amount, email et orderId requis')
    }

    const ENV = Deno.env.get('ENV') || 'development'

    const successUrl =
      ENV === 'development'
        ? `https://localhost:5278/paiement/success?session_id={CHECKOUT_SESSION_ID}`
        : `https://fast-peptides.com/paiement/success?session_id={CHECKOUT_SESSION_ID}`

    const cancelUrl =
      ENV === 'development'
        ? `https://localhost:5278/paiement/cancel`
        : `https://fast-peptides.com/paiement/cancel`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { order_id: orderId },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Commande Fast Peptides' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
    })

    // ✅ update DB
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
