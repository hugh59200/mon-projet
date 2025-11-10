import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe, supabase } from '../../utils/clients.ts'
import { corsHeaders, handleCors } from '../../utils/cors.ts'

const ENV = Deno.env.get('ENV') || 'development'

serve(async (req: Request) => {
  const cors = handleCors(req)
  if (cors) return cors

  try {
    const { amount, email, orderId } = await req.json()

    if (!amount || !email || !orderId) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const base = ENV === 'development' ? 'https://localhost:5278' : 'https://fast-peptides.com'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      success_url: `${base}/paiement/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/paiement/cancel`,
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
      headers: corsHeaders,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
