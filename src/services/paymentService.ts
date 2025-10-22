// src/services/paymentService.ts
import { supabase } from '@/services/supabaseClient'

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

export async function processPayment(
  amount: number,
  provider: PaymentProvider = 'simulation',
): Promise<PaymentIntent> {
  console.log(`💳 Paiement via ${provider} pour ${amount} €`)

  switch (provider) {
    case 'simulation':
      return simulatePayment(amount)
    case 'stripe':
      return createStripeCheckout(amount)
    case 'crypto':
      return createCryptoInvoice(amount)
    default:
      throw new Error('Mode de paiement non supporté.')
  }
}

/** 1️⃣ Simulation locale */
async function simulatePayment(amount: number): Promise<PaymentIntent> {
  await new Promise((r) => setTimeout(r, 1000))
  return {
    id: `sim-${Math.random().toString(36).substring(2, 10)}`,
    amount,
    currency: 'EUR',
    status: 'succeeded',
    provider: 'simulation',
    created_at: new Date().toISOString(),
  }
}

/** 2️⃣ Stripe Checkout (via Supabase Edge Function) */
async function createStripeCheckout(amount: number): Promise<PaymentIntent> {
  const { data, error } = await supabase.functions.invoke('create-stripe-session', {
    body: { amount },
  })

  console.log('Stripe session response:', { data, error }) // 👈 ajoute ça

  if (error || !data) throw new Error(error?.message || 'Erreur Stripe')

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

/** 3️⃣ Coinbase Commerce ou BTCPay */
async function createCryptoInvoice(amount: number): Promise<PaymentIntent> {
  const { data, error } = await supabase.functions.invoke('create-crypto-invoice', {
    body: { amount },
  })

  if (error || !data) throw new Error(error?.message || 'Erreur création facture crypto')

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
