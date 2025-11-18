// utils/stripeClient.ts

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!
export const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

/**
 * Create Stripe Checkout Session (HTTP API)
 */
export async function stripeCreateCheckoutSession(params: Record<string, string>) {
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
  })

  if (!res.ok) {
    throw new Error(`Stripe session error ${res.status}: ${await res.text()}`)
  }

  return await res.json()
}

/**
 * Retrieve Stripe PaymentIntent
 */
export async function retrievePaymentIntent(id: string) {
  const res = await fetch(`https://api.stripe.com/v1/payment_intents/${id}`, {
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Stripe retrieve error ${await res.text()}`)
  }

  return res.json()
}
