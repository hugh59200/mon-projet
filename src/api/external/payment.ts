import { supabase } from '@/supabase/supabaseClient'

export type PaymentProvider =
  | 'stripe'
  | 'paypal'
  | 'apple_pay'
  | 'alma'
  | 'afterpay'
  | 'klarna'
  | 'google_pay'

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  provider: PaymentProvider
  checkout_url?: string
  created_at: string
}

export async function finalizeOrderAfterPayment(
  orderId: string,
  paymentId: string,
  provider: PaymentProvider,
) {
  try {
    const updateData: any = {
      status: 'paid',
      updated_at: new Date().toISOString(),
    }

    if (provider === 'paypal') {
      updateData.paypal_order_id = paymentId
    } else if (provider === 'stripe') {
      updateData.stripe_session_id = paymentId
    } else {
      updateData.payment_intent_id = paymentId
    }

    const { error } = await supabase.from('orders').update(updateData).eq('id', orderId)

    if (error) throw error
    console.log(`Commande ${orderId} finalisée (${provider})`)
  } catch (err) {
    console.error('Erreur finalisation commande:', err)
    throw err
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

      if (paypal.url) window.location.assign(paypal.url)

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

  const result = data.data ? data.data : data

  if (!result?.url) {
    console.error("Pas d'URL PayPal reçue", data)
    throw new Error('No PayPal approval URL returned')
  }

  return result
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

  const result = data.data ? data.data : data

  if (!result?.url) {
    console.error("Pas d'URL Stripe reçue", data)
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
