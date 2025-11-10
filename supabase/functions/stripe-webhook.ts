import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe, supabase } from '../utils/clients.ts'
import { logEmail } from '../utils/logEmail.ts'
import { sendEmail } from '../utils/sendEmail.ts'
import { renderEmailTemplate } from '../utils/templates/renderEmailTemplate.ts'

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) return new Response('Missing signature', { status: 400 })

    const raw = await req.arrayBuffer()
    const body = new TextDecoder().decode(raw)

    const event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET)
    if (event.type !== 'checkout.session.completed') return new Response('Ignored', { status: 200 })

    const session = event.data.object
    const orderId = session.metadata?.order_id

    const total = (session.amount_total ?? 0) / 100
    const email = session.customer_details?.email

    await supabase
      .from('orders')
      .update({
        status: 'paid',
        stripe_session_id: session.id,
        payment_intent_id: session.payment_intent,
        total_amount: total,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (email) {
      const html = renderEmailTemplate('payment', { amount: total, sessionId: session.id })

      const sent = await sendEmail({
        to: email,
        subject: 'Confirmation de commande ✅',
        html,
      })

      await logEmail({
        order_id: orderId,
        to_email: email,
        subject: 'Confirmation de commande',
        body_html: html,
        type: 'payment',
        provider_response: sent,
        status: sent?.id ? 'sent' : 'error',
      })
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    return new Response('Webhook error', { status: 400 })
  }
})
