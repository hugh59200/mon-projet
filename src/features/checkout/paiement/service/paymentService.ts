// src/features/checkout/paiement/service/paymentService.ts
import { supabase } from '@/supabase/supabaseClient'

export type PaymentProvider = 'stripe' | 'paypal'

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  provider: PaymentProvider
  checkout_url?: string
  created_at: string
}

export async function finalizeOrderAfterPayment(orderId: string, paymentIntentId?: string) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_intent_id: paymentIntentId ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (error) throw error
    console.log('✅ Commande mise à jour en "paid" -', orderId)
  } catch (err) {
    console.error('❌ Erreur finalisation commande:', err)
  }
}

export async function processPayment(
  amount: number,
  provider: PaymentProvider,
  email?: string,
  orderId?: string,
): Promise<PaymentIntent> {
  switch (provider) {
    case 'stripe':
      return createStripeCheckout(amount, email, orderId)
    case 'paypal':
      const paypal = await createPaypalOrder(amount, email!, orderId!)
      window.location.assign(paypal.url) // maintenant OK
      return {
        id: paypal.paypalOrderId,
        amount,
        currency: 'EUR',
        status: 'pending',
        provider: 'paypal',
        checkout_url: paypal.url,
        created_at: new Date().toISOString(),
      }

    default:
      throw new Error('Mode de paiement non supporté')
  }
}

async function createPaypalOrder(amount: number, email: string, orderId: string) {
  const { data, error } = await supabase.functions.invoke('create-paypal-order', {
    body: { amount, email, orderId },
  })

  if (error) throw new Error(error.message)

  return data.data // pas data !!
}

type StripeSessionResponse = {
  url: string
  sessionId: string
  payment_intent_id: string | null
}

async function createStripeCheckout(
  amount: number,
  email?: string,
  orderId?: string,
): Promise<PaymentIntent> {
  const { data, error } = await supabase.functions.invoke('create-stripe-session', {
    body: { amount, currency: 'eur', email, orderId },
  })

  if (error) throw new Error(error.message)

  const result = data?.data as StripeSessionResponse

  if (!result?.url) {
    console.error('❌ Pas d’URL Stripe reçue', result)
    throw new Error('No Stripe checkout URL returned')
  }

  window.location.assign(result.url)

  return {
    id: result.sessionId,
    amount,
    currency: 'EUR',
    status: 'pending',
    provider: 'stripe',
    checkout_url: result.url,
    created_at: new Date().toISOString(),
  }
}
