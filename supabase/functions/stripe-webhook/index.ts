import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@3.2.0'
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2025-09-30.clover',
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
const resendApiKey = Deno.env.get('RESEND_API_KEY')

// Fonction utilitaire d’envoi d’email
async function sendConfirmationEmail(to: string, amount: number, sessionId: string) {
  if (!resendApiKey) {
    console.warn('⚠️ RESEND_API_KEY manquant, email non envoyé.')
    return
  }

  const resend = new Resend(resendApiKey)

  await resend.emails.send({
    from: 'Fast Peptides <no-reply@fastpeptides.com>',
    to,
    subject: 'Confirmation de votre commande',
    html: `
      <h2>✅ Paiement confirmé !</h2>
      <p>Merci pour votre commande.</p>
      <p>Montant : <strong>${(amount / 100).toFixed(2)} USD</strong></p>
      <p>ID de session : <code>${sessionId}</code></p>
    `,
  })

  console.log(`📧 Email envoyé à ${to}`)
}

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature || !endpointSecret) {
      return new Response('Signature manquante', { status: 400 })
    }

    const rawBody = await req.text()
    const event = await stripe.webhooks.constructEventAsync(rawBody, signature, endpointSecret)

    console.log(`➡️ Webhook Stripe reçu : ${event.type}`)

    // --- Connexion Supabase ---
    const supabaseUrl = Deno.env.get('PROJECT_URL')
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY')
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabase = createClient(supabaseUrl!, serviceRoleKey!)

    // --- Traitement selon le type ---
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const sessionId = session.id
      const totalAmount = session.amount_total ?? 0
      const customerEmail = session.customer_details?.email

      console.log(`💚 Paiement terminé pour la session : ${sessionId}`)

      // ✅ Met à jour ou crée la commande
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
            payment_intent_id: session.payment_intent,
            total_amount: totalAmount / 100,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', sessionId)

        console.log('✅ Commande existante mise à jour !')
      } else {
        await supabase.from('orders').insert({
          stripe_session_id: sessionId,
          payment_intent_id: session.payment_intent,
          total_amount: totalAmount / 100,
          status: 'paid',
          created_at: new Date().toISOString(),
        })

        console.log('🆕 Nouvelle commande créée !')
      }

      // 📧 Envoi de l’email
      if (customerEmail) {
        await sendConfirmationEmail(customerEmail, totalAmount, sessionId)
      }
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object
      console.log(`💰 Payment Intent réussi : ${intent.id}`)
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('💥 Erreur Webhook Stripe :', err)
    return new Response(`Webhook error: ${err.message}`, { status: 400 })
  }
})
