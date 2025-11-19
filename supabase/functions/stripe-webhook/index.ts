// supabase/functions/stripe-webhook/index.ts

import { supabase } from '../../utils/clients.ts'
import { logPaymentEvent, updateOrderPaid } from '../../utils/paymentUtils.ts'
import { STRIPE_WEBHOOK_SECRET } from '../../utils/stripeClient.ts'

/**
 * Vérification Stripe correcte : timestamp + "." + rawBody
 */
async function verifyStripeSignature(rawBody: string, signature: string, secret: string) {
  const encoder = new TextEncoder()

  const parts = signature.split(',')

  const timestamp = parts.find((p) => p.startsWith('t='))?.slice(2)
  const v1 = parts.find((p) => p.startsWith('v1='))?.slice(3)

  if (!timestamp || !v1) throw new Error('Bad Stripe signature format')

  const signedPayload = `${timestamp}.${rawBody}`

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload))
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  if (expected !== v1) throw new Error('Invalid Stripe signature')
}

/**
 * Webhook handler
 */
Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('Missing stripe-signature', { status: 400 })
    }

    // IMPORTANT: garder le raw body
    const rawBody = await req.text()

    // Vérification de la signature Stripe
    await verifyStripeSignature(rawBody, signature, STRIPE_WEBHOOK_SECRET)

    // Le payload Stripe vérifié
    const event = JSON.parse(rawBody)
    console.log('⚡ Webhook reçu et vérifié :', event.type)

    // Log pour backup
    await logPaymentEvent('stripe', event.data?.object?.metadata?.order_id ?? null, event)

    // On ne traite que checkout.session.completed
    if (event.type !== 'checkout.session.completed') {
      return Response.json({ ignored: event.type })
    }

    const session = event.data.object
    const orderId = session.metadata?.order_id
    const paymentIntent = session.payment_intent

    if (!orderId) throw new Error('Missing order_id in metadata')

    console.log('💰 Paiement validé, order_id:', orderId)

    // Update DB
    await updateOrderPaid(orderId, paymentIntent)

    // Envoi email
    await supabase.functions.invoke('order-confirmation', {
      body: { order_id: orderId },
    })

    return Response.json({ success: true, orderId })
  } catch (err) {
    console.error('❌ Webhook error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return new Response('Webhook error: ' + errorMessage, { status: 400 })
  }
})
