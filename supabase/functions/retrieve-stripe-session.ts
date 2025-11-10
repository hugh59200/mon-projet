import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Apikey, x-client-info',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: corsHeaders,
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    })

    const rawBody = await req.text()
    if (!rawBody) {
      return new Response(JSON.stringify({ error: 'Corps JSON manquant' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const { sessionId } = JSON.parse(rawBody)
    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'sessionId manquant' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    await supabase.from('logs').insert([
      {
        type: 'retrieve_stripe_session',
        message: JSON.stringify({
          id: session.id,
          email: session.customer_email,
          amount_total: session.amount_total,
          payment_intent: session.payment_intent,
        }),
        created_at: new Date().toISOString(),
      },
    ])

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (err) {
    console.error('💥 Erreur retrieve-stripe-session :', err)
    const error = err as Error
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
