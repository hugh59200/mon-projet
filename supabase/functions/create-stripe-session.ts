import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe, supabase } from '../utils/clients.ts'

const ENV = Deno.env.get('ENV') || 'development'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Apikey, x-client-info',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { amount, email, orderId } = await req.json()
    if (!amount || !email || !orderId) {
      return new Response(JSON.stringify({ error: 'amount, email et orderId requis' }), {
        status: 400,
        headers: cors,
      })
    }

    const base = ENV === 'development' ? 'https://localhost:5278' : 'https://fast-peptides.com'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      success_url: `${base}/paiement/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/paiement/cancel`,
      payment_method_options: { card: { request_three_d_secure: 'any' } },
      metadata: { order_id: orderId },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(amount * 100),
            product_data: { name: 'Commande Fast Peptides' },
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

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      status: 200,
      headers: cors,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: cors })
  }
})
