// functions/create-stripe-session/index.ts

import { PAYMENT_CANCEL_URL, PAYMENT_SUCCESS_URL_BASE, supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { stripeCreateCheckoutSession } from '../../utils/stripeClient.ts'

interface Payload {
  amount: number
  email: string
  orderId: string
  currency?: string // Ajout optionnel
}

Deno.serve(
  createHandler<Payload>(async (_req, body) => {
    const { amount, email, orderId, currency = 'eur' } = body

    if (!amount || !email || !orderId) {
      throw new Error('amount, email, orderId requis')
    }

    console.log(`🚀 Création session Stripe pour commande ${orderId} (${amount} ${currency})`)

    const params: Record<string, string> = {
      mode: 'payment',
      customer_email: email,
      // URL de redirection front-end
      success_url: `${PAYMENT_SUCCESS_URL_BASE}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: PAYMENT_CANCEL_URL,

      // Métadonnées cruciales pour le webhook
      'metadata[order_id]': orderId,

      // Produit unique (Total commande)
      'line_items[0][price_data][currency]': currency,
      'line_items[0][price_data][product_data][name]': `Commande #${orderId.slice(0, 8)}`,
      // Stripe attend des centimes (ex: 10.50 -> 1050)
      'line_items[0][price_data][unit_amount]': String(Math.round(amount * 100)),
      'line_items[0][quantity]': '1',
    }

    // Appel API Stripe
    const session = await stripeCreateCheckoutSession(params)

    if (!session || !session.id || !session.url) {
      console.error('❌ Erreur Stripe: Session invalide', session)
      throw new Error('Stripe API returned invalid session')
    }

    console.log('✅ Session Stripe créée:', session.id)

    // Mise à jour V2 : On enregistre l'ID de session Stripe
    const { error } = await supabase
      .from('orders')
      .update({
        stripe_session_id: session.id, // Nouvelle colonne V2
        payment_intent_id: session.payment_intent, // Stocké aussi au cas où
        updated_at: new Date().toISOString(),
        status: 'processing', // On passe en processing en attendant le paiement
      })
      .eq('id', orderId)

    if (error) {
      console.error('❌ Erreur Update DB:', error)
      // On ne bloque pas le paiement pour ça, mais on log l'erreur
    }

    // Retourne les infos au front
    return {
      url: session.url,
      sessionId: session.id,
      payment_intent_id: session.payment_intent,
    }
  }),
)
