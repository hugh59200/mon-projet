// supabase/functions/create-stripe-session/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const ENV = Deno.env.get('ENV') || 'development'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
})
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Apikey, x-client-info',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders })

  try {
    const { amount, email, orderId } = await req.json()

    if (!amount || !email || !orderId) {
      return new Response(JSON.stringify({ error: 'amount, email et orderId requis' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

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

      payment_method_options: {
        card: {
          request_three_d_secure: 'any',
        },
      },

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
    await supabase
      .from('orders')
      .update({
        stripe_session_id: session.id,
        payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
        payment_intent_id: session.payment_intent,
      }),
      { status: 200, headers: corsHeaders },
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: `${err}` }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
