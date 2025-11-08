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

const ENV = Deno.env.get('ENV') || 'development'
const FROM_DEV = Deno.env.get('RESEND_FROM_DEV') || 'Fast Peptides <onboarding@resend.dev>'
const FROM_PROD = Deno.env.get('RESEND_FROM_PROD') || 'Fast Peptides <no-reply@fastpeptides.com>'
const FROM = ENV === 'development' ? FROM_DEV : FROM_PROD

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-09-30.clover' })
const resend = new Resend(RESEND_API_KEY)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) return new Response('no signature', { status: 400 })

    // ✅ raw body
    const rawBody = await req.arrayBuffer()
    const payloadString = new TextDecoder().decode(rawBody)

    const event = await stripe.webhooks.constructEventAsync(
      payloadString,
      signature,
      STRIPE_WEBHOOK_SECRET,
    )

    console.log(`🔥 Webhook reçu : ${event.type}`)

    if (event.type !== 'checkout.session.completed') {
      return new Response('OK', { status: 200 })
    }

    const session = event.data.object as any

    const orderId = session.metadata?.order_id
    if (!orderId) return new Response('OK', { status: 200 })

    const email = session.customer_details?.email
    const total = (session.amount_total ?? 0) / 100 // ✅ vrai montant en €

    // ✅ MAJ commande
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

    console.log(`✅ Order ${orderId} set to PAID`)

    // ✅ email uniquement ici
    if (email) {
      const html = renderEmailTemplate('payment', {
        amount: total, // ✅ ne PAS rediviser
        sessionId: session.id,
      })

      const mailResult = await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Confirmation de commande',
        html,
      })

      console.log('📤 Email envoyé:', mailResult)

      await logEmail({
        order_id: orderId,
        to_email: email,
        subject: 'Confirmation de commande',
        body_html: html,
        type: 'payment',
        provider_response: mailResult,
        status: 'sent',
      })
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('❌ Webhook error:', err)
    return new Response('Webhook error', { status: 400 })
  }
})
