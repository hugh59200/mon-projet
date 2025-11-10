// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno'
import { logEmail } from '../utils/logEmail.ts'
import { sendEmail } from '../utils/sendEmail.ts'
import { renderEmailTemplate } from '../utils/templates/renderEmailTemplate.ts'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-09-30.clover' })
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) return new Response('Missing signature', { status: 400 })

    const rawBody = await req.arrayBuffer()
    const payloadString = new TextDecoder().decode(rawBody)

    const event = await stripe.webhooks.constructEventAsync(
      payloadString,
      signature,
      STRIPE_WEBHOOK_SECRET,
    )

    if (event.type !== 'checkout.session.completed') {
      return new Response('Ignored', { status: 200 })
    }

    const session = event.data.object as any
    const orderId = session.metadata?.order_id

    if (!orderId) {
      console.warn('⚠ Aucun order_id, on ignore')
      return new Response('Ignored', { status: 200 })
    }

    if (event.type === 'checkout.session.completed') {
      const exists = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .maybeSingle()

      if (exists?.data?.status === 'paid') return new Response('Already processed', { status: 200 })
    }

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
      const html = renderEmailTemplate('payment', {
        amount: total,
        sessionId: session.id,
      })

      const mailResult = await sendEmail({
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
        provider_response: mailResult,
        status: mailResult?.id ? 'sent' : 'error',
      })
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('❌ Webhook error:', err)
    return new Response('Webhook error', { status: 400 })
  }
})
