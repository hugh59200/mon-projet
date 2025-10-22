import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // ✅ Gérer le prévol CORS proprement
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('➡️ Requête reçue sur create-stripe-session')

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY manquant')

    const stripe = new Stripe(stripeKey, { apiVersion: '2024-09-30.acacia' })
    const { amount, currency = 'eur', email } = await req.json()

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Montant invalide' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: 'Commande Fast Peptides' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:5173/confirmation?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/checkout?canceled=true',
      customer_email: email || undefined,
    })

    return new Response(
      JSON.stringify({ success: true, sessionId: session.id, url: session.url }),
      { status: 200, headers: corsHeaders },
    )
  } catch (err) {
    console.error('❌ Erreur Stripe:', err)
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
