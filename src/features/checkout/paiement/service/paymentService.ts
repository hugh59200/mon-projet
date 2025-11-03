// ✅ src/services/paymentService.ts
import { supabase } from '@/supabase/supabaseClient'

/**
 * Types de prestataires de paiement supportés
 */
export type PaymentProvider = 'simulation' | 'stripe' | 'crypto'

/* -------------------------------------------------------------------------- */
/* 🧾 4️⃣ Enregistrement / finalisation de la commande                        */
/* -------------------------------------------------------------------------- */
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
    console.log('✅ Commande mise à jour comme "paid" pour', orderId)
  } catch (err) {
    console.error('💥 Erreur finalisation commande:', err)
  }
}

/**
 * Structure normalisée d’un paiement
 */
export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  provider: PaymentProvider
  checkout_url?: string
  created_at: string
}

/**
 * 💳 Fonction principale — lance le paiement selon le provider choisi
 */
export async function processPayment(
  amount: number,
  provider: PaymentProvider = 'simulation',
  email?: string,
): Promise<PaymentIntent> {
  console.log(`💳 Paiement via ${provider} pour ${amount} €`)

  switch (provider) {
    case 'simulation':
      return simulatePayment(amount)
    case 'stripe':
      return createStripeCheckout(amount, email)
    case 'crypto':
      return createCryptoInvoice(amount)
    default:
      throw new Error('Mode de paiement non supporté.')
  }
}

/* -------------------------------------------------------------------------- */
/* 🧩 1️⃣ Paiement simulé (pour tests)                                         */
/* -------------------------------------------------------------------------- */
async function simulatePayment(amount: number): Promise<PaymentIntent> {
  // Petit délai pour simuler un vrai appel API
  await new Promise((r) => setTimeout(r, 1000))

  return {
    id: `sim_${Math.random().toString(36).substring(2, 10)}`,
    amount,
    currency: 'EUR',
    status: 'succeeded',
    provider: 'simulation',
    created_at: new Date().toISOString(),
  }
}

/* -------------------------------------------------------------------------- */
/* 💳 2️⃣ Stripe Checkout (via Supabase Edge Function)                        */
/* -------------------------------------------------------------------------- */
async function createStripeCheckout(amount: number, email?: string): Promise<PaymentIntent> {
  try {
    const { data, error } = await supabase.functions.invoke('create-stripe-session', {
      body: { amount, currency: 'eur', email },
    })

    console.log('📡 Réponse Stripe:', { data, error })

    if (error || !data) {
      throw new Error(error?.message || 'Erreur de création de session Stripe')
    }

    // 🚀 Redirection directe vers Stripe Checkout
    if (data.url) {
      window.location.href = data.url
    }

    return {
      id: data.sessionId,
      amount,
      currency: 'EUR',
      status: 'pending',
      provider: 'stripe',
      checkout_url: data.url,
      created_at: new Date().toISOString(),
    }
  } catch (err) {
    console.error('❌ Erreur Stripe:', err)
    throw err
  }
}

/* -------------------------------------------------------------------------- */
/* 🪙 3️⃣ Paiement crypto (Coinbase / BTCPay)                                 */
/* -------------------------------------------------------------------------- */
async function createCryptoInvoice(amount: number): Promise<PaymentIntent> {
  const { data, error } = await supabase.functions.invoke('create-crypto-invoice', {
    body: { amount },
  })

  if (error || !data) {
    throw new Error(error?.message || 'Erreur création facture crypto')
  }

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
