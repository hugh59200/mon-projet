// src/features/checkout/paiement/service/paymentService.ts
import { supabase } from '@/supabase/supabaseClient'

export type PaymentProvider = 'simulation' | 'stripe' | 'crypto'

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
  provider: PaymentProvider = 'simulation',
  email?: string,
  orderId?: string,
): Promise<PaymentIntent> {
  switch (provider) {
    case 'stripe':
      return createStripeCheckout(amount, email, orderId)
    case 'simulation':
      return simulatePayment(amount)
    case 'crypto':
      return createCryptoInvoice(amount)
    default:
      throw new Error('Mode de paiement non supporté')
  }
}

async function simulatePayment(amount: number): Promise<PaymentIntent> {
  await new Promise((r) => setTimeout(r, 1000))

  return {
    id: `sim_${Math.random().toString(36).slice(2)}`,
    amount,
    currency: 'EUR',
    status: 'succeeded',
    provider: 'simulation',
    created_at: new Date().toISOString(),
  }
}

async function createStripeCheckout(
  amount: number,
  email?: string,
  orderId?: string,
): Promise<PaymentIntent> {
  const { data, error } = await supabase.functions.invoke('create-stripe-session', {
    body: { amount, currency: 'eur', email, orderId },
  })

  if (error || !data) throw new Error(error?.message || 'Erreur création session Stripe')

  // ✅ Redirection
  if (data.url) window.location.href = data.url

  return {
    id: data.sessionId,
    amount,
    currency: 'EUR',
    status: 'pending',
    provider: 'stripe',
    checkout_url: data.url,
    created_at: new Date().toISOString(),
  }
}

async function createCryptoInvoice(amount: number): Promise<PaymentIntent> {
  const { data, error } = await supabase.functions.invoke('create-crypto-invoice', {
    body: { amount },
  })

  if (error || !data) throw new Error(error?.message || 'Erreur facture crypto')

  return {
    id: data.invoiceId,
    amount,
    currency: 'EUR',
    status: 'pending',
    provider: 'crypto',
    checkout_url: data.url,
    created_at: new Date().toISOString(),
  }
}
