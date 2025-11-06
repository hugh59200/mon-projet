import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@3.2.0'
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno'
import { logEmail } from '../../utils/logEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2025-09-30.clover' })
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
const resendApiKey = Deno.env.get('RESEND_API_KEY')
const resend = new Resend(resendApiKey)
const supabase = createClient(Deno.env.get('PROJECT_URL')!, Deno.env.get('SERVICE_ROLE_KEY')!)

async function sendAndLogEmail(to: string, amount: number, sessionId: string, orderId?: string) {
  const html = renderEmailTemplate('payment', { amount, sessionId })

  const response = await resend.emails.send({
    from: 'Fast Peptides <no-reply@fastpeptides.com>',
    to,
    subject: 'Confirmation de votre commande',
    html,
  })

  await logEmail({
    order_id: orderId,
    to_email: to,
    subject: 'Confirmation de votre commande',
    body_html: html,
    type: 'payment',
    provider_response: response,
    status: 'sent',
  })
}

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature || !endpointSecret) return new Response('Signature manquante', { status: 400 })

    const rawBody = await req.text()
    const event = await stripe.webhooks.constructEventAsync(rawBody, signature, endpointSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const sessionId = session.id
      const totalAmount = session.amount_total ?? 0
      const email = session.customer_details?.email

      const { data: existingOrder } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .maybeSingle()

      if (existingOrder) {
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            total_amount: totalAmount / 100,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', sessionId)
      } else {
        await supabase.from('orders').insert({
          stripe_session_id: sessionId,
          total_amount: totalAmount / 100,
          status: 'paid',
          created_at: new Date().toISOString(),
        })
      }

      if (email) await sendAndLogEmail(email, totalAmount, sessionId, existingOrder?.id)
    }

    return new Response('OK', { status: 200 })
  } catch (err: unknown) {
    console.error('💥 Erreur Webhook Stripe :', err)
    return new Response(`Erreur webhook: ${err instanceof Error ? err.message : 'Unknown error'}`, { status: 400 })
  }
})
