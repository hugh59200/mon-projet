// supabase/functions/stripe-webhook/index.ts

import { FUNCTION_URL } from '../../utils/clients.ts'
import { createWebhookHandler } from '../../utils/createHandler.ts'
import { logPaymentEvent, updateOrderPaid } from '../../utils/paymentUtils.ts'
import { STRIPE_WEBHOOK_SECRET, retrievePaymentIntent } from '../../utils/stripeClient.ts'

// --- Vérification de signature Stripe en REST ---
async function verifyStripeSignature(rawBody: string, signature: string, secret: string) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signedPayload = signature
    .split(',')
    .find((s) => s.startsWith('v1='))
    ?.replace('v1=', '')
  if (!signedPayload) throw new Error('Bad Stripe signature format')

  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
  const expectedSig = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  if (expectedSig !== signedPayload) {
    throw new Error('Invalid Stripe signature')
  }
}

export default Deno.serve(
  createWebhookHandler(async (rawBody, req) => {
    const signature = req.headers.get('stripe-signature')
    if (!signature) throw new Error('Missing stripe-signature')

    // 🟦 Vérification manuelle HMAC SHA256
    await verifyStripeSignature(rawBody, signature, STRIPE_WEBHOOK_SECRET)

    // 🟦 Parse JSON après vérification
    const event = JSON.parse(rawBody)

    console.log('⚡ Stripe webhook received:', event.type)

    // Log du raw event
    await logPaymentEvent('stripe', event.data?.object?.metadata?.order_id ?? null, event)

    if (event.type !== 'checkout.session.completed') {
      return { ignored: event.type }
    }

    const session = event.data.object
    const orderId = session.metadata?.order_id
    const paymentIntentId = session.payment_intent

    if (!orderId) throw new Error('Missing order_id in metadata')

    console.log('💰 Payment succeeded for order:', orderId)

    // ▶ Récupérer PaymentIntent si besoin
    await retrievePaymentIntent(paymentIntentId)

    // ▶ Mettre la commande en 'paid'
    await updateOrderPaid(orderId, paymentIntentId)

    // ▶ Déclencher email confirmation
    await fetch(`${FUNCTION_URL}/order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })

    return { success: true, orderId }
  }),
)
