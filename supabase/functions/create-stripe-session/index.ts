// supabase/functions/create-stripe-session/index.ts
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

const ENV = Deno.env.get('ENV') || 'development'

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders })

  try {
    const { amount, email, orderId } = await req.json()

    if (!amount || !email)
      return new Response(JSON.stringify({ error: 'amount et email requis' }), {
        status: 400,
        headers: corsHeaders,
      })

    const successUrl =
      ENV === 'development'
        ? `https://localhost:5278/paiement/success?session_id={CHECKOUT_SESSION_ID}`
        : `https://fast-peptides.com/paiement/success?session_id={CHECKOUT_SESSION_ID}`

    const cancelUrl =
      ENV === 'development'
        ? `https://localhost:5278/paiement/cancel`
        : `https://fast-peptides.com/paiement/cancel`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      payment_method_types: ['card'],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { order_id: orderId },
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
    })

    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
        payment_intent_id: session.payment_intent,
      }),
      { status: 200, headers: corsHeaders },
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: `${err}` }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
