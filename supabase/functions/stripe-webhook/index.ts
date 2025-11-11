import Stripe from 'https://esm.sh/stripe@14.21.0'
import { stripe, STRIPE_WEBHOOK_SECRET, supabase } from '../../utils/clients.ts'
import { createWebhookHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

export default Deno.serve(
  createWebhookHandler(async (rawBody, req) => {
    const signature = req.headers.get('stripe-signature')
    if (!signature) throw new Error('Missing Stripe signature')

    const event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET,
    )

    if (event.type !== 'checkout.session.completed') {
      return { ignored: event.type }
    }

    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.order_id

    if (!orderId) throw new Error('Missing order_id')

    const { data: existing } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .maybeSingle()

    if (existing?.status === 'paid') {
      console.log(`✅ Order ${orderId} already paid (ignored)`)
      return { status: 'already_paid' }
    }

    await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    console.log(`✅ Order ${orderId} marked PAID`)

    if (session.customer_details?.email) {
      const html = renderEmailTemplate('payment', {
        amount: (session.amount_total ?? 0) / 100,
      })

      await sendEmail({
        to: session.customer_details.email,
        subject: 'Paiement confirmé ✅',
        html,
        type: 'payment',
        order_id: orderId,
      })

      console.log(`📤 Email envoyé à ${session.customer_details.email}`)
    }

    return { status: 'success', orderId }
  }),
)
