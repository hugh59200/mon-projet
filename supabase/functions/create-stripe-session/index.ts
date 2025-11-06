import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2025-09-30.clover',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Apikey, x-client-info',
  'Content-Type': 'application/json',
}

// ✅ Gestion de l’environnement
const ENV = Deno.env.get('ENV') || 'development'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => null)
    console.log('🧾 Corps reçu :', body)

    if (!body) {
      return new Response(JSON.stringify({ error: 'Request body manquant ou invalide.' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const { amount, email, orderId } = body

    if (!amount || !email) {
      return new Response(JSON.stringify({ error: 'amount et email sont requis' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    // ✅ URLs dynamiques selon l'environnement
    const successUrl =
      ENV === 'development'
        ? `https://localhost:5278/paiement/success?session_id={CHECKOUT_SESSION_ID}`
        : `https://fast-peptides/paiement/success?session_id={CHECKOUT_SESSION_ID}.com`

    const cancelUrl =
      ENV === 'development'
        ? `https://localhost:5278/paiement/cancel`
        : `https://fast-peptides/paiement/cancel.com`

    console.log('🌐 URLs dynamiques :', { successUrl, cancelUrl })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Commande Fast Peptides' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { order_id: orderId || 'unknown' },
    })

    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
        payment_intent_id: session.payment_intent,
      }),
      { status: 200, headers: corsHeaders },
    )
  } catch (err: unknown) {
    console.error('💥 Erreur création session Stripe :', err)
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Erreur interne du serveur',
      }),
      { status: 500, headers: corsHeaders },
    )
  }
})
