import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe, supabase } from '../../utils/clients.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req: Request) => {
  try {
    const body = new TextDecoder().decode(await req.arrayBuffer())
    const signature = req.headers.get('stripe-signature')

    if (!signature) return new Response('Missing signature', { status: 400 })

    const event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET)
    if (event.type !== 'checkout.session.completed') return new Response('Ignored', { status: 200 })

    const session = event.data.object
    const orderId = session.metadata?.order_id
    const email = session.customer_details?.email
    const total = (session.amount_total ?? 0) / 100

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
      const html = renderEmailTemplate('payment', { amount: total })
      await sendEmail({ to: email, subject: 'Confirmation de commande ✅', html })
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    return new Response('Webhook error', { status: 400 })
  }
})
