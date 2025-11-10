import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe, supabase } from '../../utils/clients.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('❌ Missing signature')
      return new Response('Missing signature', { status: 400 })
    }

    // ✅ lire le body RAW comme Stripe le demande
    const buf = await req.arrayBuffer()
    const rawBody = new TextDecoder().decode(buf)

    // ✅ construire l’événement Stripe
    const event = await stripe.webhooks.constructEventAsync(
      rawBody, // ✅ STRING obligatoire
      signature!, // ✅ signature requise
      STRIPE_WEBHOOK_SECRET,
    )

    console.log(`🚀 Stripe webhook reçu : ${event.type}`)

    if (event.type !== 'checkout.session.completed') {
      return new Response('ignored', { status: 200 })
    }

    const session: any = event.data.object

    const orderId = session.metadata?.order_id
    const email = session.customer_details?.email
    const total = (session.amount_total ?? 0) / 100

    // ✅ Mise à jour DB
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    console.log('✅ commande mise en PAID')

    // ✅ envoyer mail
    if (email) {
      const html = renderEmailTemplate('payment', { amount: total })

      await sendEmail({
        to: email,
        subject: 'Paiement confirmé ✅',
        html,
        type: 'payment',
        order_id: orderId,
      })

      console.log('📤 Email envoyé')
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('❌ Webhook error:', err)
    return new Response('Webhook error', { status: 400 })
  }
})
