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

/**
 * ✅ V2.0 : Finalise la commande en mettant à jour les colonnes spécifiques
 * (paypal_order_id ou stripe_session_id) selon le provider.
 */
export async function finalizeOrderAfterPayment(
  orderId: string,
  paymentId: string,
  provider: PaymentProvider, // ⚠️ Ajout nécessaire pour cibler la bonne colonne
) {
  try {
    const updateData: any = {
      status: 'paid', // Ou 'processing' selon ta logique métier
      updated_at: new Date().toISOString(),
    }

    // 🔀 Mapping vers les nouvelles colonnes V2
    if (provider === 'paypal') {
      updateData.paypal_order_id = paymentId
    } else if (provider === 'stripe') {
      updateData.stripe_session_id = paymentId
    } else {
      // Fallback legacy
      updateData.payment_intent_id = paymentId
    }

    const { error } = await supabase.from('orders').update(updateData).eq('id', orderId)

    if (error) throw error
    console.log(`✅ Commande ${orderId} finalisée (${provider})`)
  } catch (err) {
    console.error('❌ Erreur finalisation commande:', err)
    throw err // Important de relancer l'erreur pour que l'UI le sache
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
      // PayPal nécessite souvent une redirection manuelle ici ou dans le composant
      if (paypal.url) window.location.assign(paypal.url)

      return {
        id: paypal.paypalOrderId, // C'est cet ID qui ira dans paypal_order_id
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

// --- FONCTIONS INTERNES (Restent inchangées si tes Edge Functions n'ont pas bougé) ---

async function createPaypalOrder(amount: number, email: string, orderId: string) {
  const { data, error } = await supabase.functions.invoke('create-paypal-order', {
    body: { amount, email, orderId },
  })

  if (error) throw new Error(error.message)
  return data // Vérifie bien si c'est data ou data.data selon ton Edge Function retour
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

  const result = data as StripeSessionResponse // Souvent data est direct le body de la réponse

  if (!result?.url) {
    console.error('❌ Pas d’URL Stripe reçue', result)
    throw new Error('No Stripe checkout URL returned')
  }

  window.location.assign(result.url)

  return {
    id: result.sessionId, // C'est cet ID qui ira dans stripe_session_id
    amount,
    currency: 'EUR',
    status: 'pending',
    provider: 'stripe',
    checkout_url: result.url,
    created_at: new Date().toISOString(),
  }
}
