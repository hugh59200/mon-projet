import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@3.2.0'
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno'
import { logEmail } from '../../utils/logEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

// 🧩 Config environnement
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
const SUPABASE_URL = Deno.env.get('PROJECT_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

// ⚙️ Clients
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-09-30.clover' })
const resend = new Resend(RESEND_API_KEY)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: { Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  },
})

// =========================================================
// 🧠 Fonction utilitaire : envoi et log d’e-mail
// =========================================================
async function sendAndLogEmail(to: string, amount: number, sessionId: string, orderId?: string) {
  const html = renderEmailTemplate('payment', { amount, sessionId })

  const response = await resend.emails.send({
    from: 'Fast Peptides <no-reply@fastpeptides.com>',
    to,
    subject: 'Confirmation de votre commande',
    html,
  })

  // Log dans emails_sent
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

// =========================================================
// 🚀 Webhook Stripe
// =========================================================
serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      return new Response('❌ Signature manquante', { status: 400 })
    }

    const rawBody = await req.text()
    const event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET,
    )

    if (event.type !== 'checkout.session.completed') {
      return new Response('✅ Ignored non-checkout event', { status: 200 })
    }

    const session = event.data.object as any
    const sessionId = session.id
    const totalAmount = (session.amount_total ?? 0) / 100
    const email = session.customer_details?.email ?? ''
    const fullName = session.customer_details?.name ?? ''

    console.log('💳 Paiement reçu :', { email, totalAmount, sessionId })

    // Vérifier si la commande existe déjà
    const { data: existingOrder, error: selectError } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()

    if (selectError) throw new Error(`Erreur SELECT : ${selectError.message}`)

    if (existingOrder) {
      // ✅ Mise à jour de la commande existante
      console.log('🔁 Update commande existante...')
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          total_amount: totalAmount,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_session_id', sessionId)

      if (updateError) throw new Error(`Erreur UPDATE : ${updateError.message}`)
    } else {
      // 🆕 Création d’une nouvelle commande
      console.log('🆕 Insertion nouvelle commande...')
      const { error: insertError } = await supabase.from('orders').insert({
        stripe_session_id: sessionId,
        total_amount: totalAmount,
        status: 'paid',
        created_at: new Date().toISOString(),
        email,
        full_name: fullName,
        payment_method: 'stripe',
      })

      if (insertError) throw new Error(`Erreur INSERT : ${insertError.message}`)
    }

    // Envoi e-mail
    if (email) {
      await sendAndLogEmail(email, totalAmount, sessionId, existingOrder?.id)
    }

    console.log('✅ Paiement traité avec succès !')
    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('💥 Erreur Webhook Stripe :', err)
    return new Response(`Erreur webhook: ${err instanceof Error ? err.message : 'Unknown error'}`, {
      status: 400,
    })
  }
})
