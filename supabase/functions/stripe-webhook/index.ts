// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@3.2.0'
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno'
import { logEmail } from '../../utils/logEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
const SUPABASE_URL = Deno.env.get('PROJECT_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-09-30.clover' })
const resend = new Resend(RESEND_API_KEY)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { headers: { Authorization: `Bearer ${SERVICE_ROLE_KEY}` } },
})

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) return new Response('Missing signature', { status: 400 })

    const rawBody = await req.arrayBuffer()
    const event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET,
    )

    if (event.type !== 'checkout.session.completed') return new Response('Ignored', { status: 200 })

    const session = event.data.object as any
    const orderId = session.metadata?.order_id

    if (!orderId) return new Response('Missing order_id', { status: 200 })

    const totalAmount = (session.amount_total ?? 0) / 100
    const email = session.customer_details?.email ?? ''

    await supabase
      .from('orders')
      .update({
        status: 'paid',
        stripe_session_id: session.id,
        payment_intent_id: session.payment_intent,
        total_amount: totalAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (email) {
      const html = renderEmailTemplate('payment', {
        amount: totalAmount,
        sessionId: session.id,
      })

      await resend.emails.send({
        from: 'Fast Peptides <no-reply@fastpeptides.com>',
        to: email,
        subject: 'Confirmation de paiement',
        html,
      })

      await logEmail({
        order_id: orderId,
        to_email: email,
        subject: 'Confirmation de paiement',
        body_html: html,
        type: 'payment',
        provider_response: {},
        status: 'sent',
      })
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response('Webhook error', { status: 400 })
  }
})
