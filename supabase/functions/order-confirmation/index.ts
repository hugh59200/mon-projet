// supabase/functions/order-confirmation/index.ts
// Email "Commande en attente de paiement" (Paiement Asynchrone)

import { APP_BASE_URL, supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { getValidLocale, translations } from '../../utils/i18n.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'
import type { BankTransferDetails, CryptoDetails, PaymentMethod } from '../../utils/templates/pendingPaymentTemplate.ts'

interface OrderConfirmationBody {
  order_id?: string
  orderId?: string
  locale?: string
}

// ============================================================
// CONFIGURATION PAIEMENT (depuis variables d'environnement)
// ============================================================

const BANK_DETAILS: BankTransferDetails = {
  beneficiary: Deno.env.get('BANK_BENEFICIARY') || 'Atlas Lab Solutions LLC',
  iban: Deno.env.get('BANK_IBAN') || '',
  bic: Deno.env.get('BANK_BIC') || '',
}

const CRYPTO_DETAILS: CryptoDetails = {
  btc_address: Deno.env.get('CRYPTO_BTC_ADDRESS') || '',
  usdt_address: Deno.env.get('CRYPTO_USDT_ADDRESS') || '',
}

// ============================================================
// HANDLER PRINCIPAL
// ============================================================

Deno.serve(
  createHandler<OrderConfirmationBody>(async (_req, body) => {
    const order_id = body.order_id ?? body.orderId
    if (!order_id) throw new Error('Missing order_id')

    console.log(`📧 Traitement commande en attente: ${order_id}`)

    // 1. Récupération de la commande via le client ADMIN
    const { data: order, error } = await supabase
      .from('orders_full_view')
      .select('*')
      .eq('order_id', order_id)
      .maybeSingle()

    if (error) {
      console.error('Erreur DB:', error)
      throw error
    }

    if (!order) {
      console.error('Commande introuvable')
      throw new Error('Order not found')
    }

    // 2. Déterminer la locale
    const locale = getValidLocale(body.locale ?? 'fr')
    const t = translations.pendingPayment

    const orderNumber = order.order_number ?? order_id
    const isGuest = !order.user_id

    // 3. Validation email
    if (!order.shipping_email || !order.shipping_email.includes('@')) {
      throw new Error(`Email invalide: ${order.shipping_email}`)
    }

    // 4. Déterminer la méthode de paiement
    const rawPaymentMethod = (order.payment_method || 'bank_transfer').toLowerCase()
    let paymentMethod: PaymentMethod = 'bank_transfer'

    if (rawPaymentMethod.includes('crypto') || rawPaymentMethod.includes('btc') || rawPaymentMethod.includes('usdt')) {
      paymentMethod = 'crypto'
    }

    console.log(`Méthode de paiement détectée: ${paymentMethod}`)

    // 5. Construire la liste des articles (OpSec: pas de noms de produits)
    const detailedItems = order.detailed_items ?? []
    const items = detailedItems.map((item: { quantity?: number; product_price?: number }) => ({
      quantity: Number(item.quantity ?? 1),
      unit_price: Number(item.product_price ?? 0),
    }))

    // 6. Construire le lien de suivi
    let ctaUrl: string

    if (isGuest) {
      if (order.tracking_token) {
        ctaUrl = `${APP_BASE_URL}/suivi-commande?token=${order.tracking_token}`
      } else {
        ctaUrl = `${APP_BASE_URL}/suivi-commande?email=${encodeURIComponent(order.shipping_email)}&ref=${orderNumber}`
      }
    } else {
      ctaUrl = `${APP_BASE_URL}/profil/commandes/${order_id}`
    }

    // 7. Générer le HTML avec le template pending_payment
    const html = renderEmailTemplate('pending_payment', {
      order_number: orderNumber,
      full_name: order.shipping_name,
      payment_method: paymentMethod,
      items,
      subtotal: order.subtotal ?? order.total_amount,
      shipping_cost: order.shipping_cost ?? 0,
      total_amount: order.total_amount,
      bank_details: paymentMethod === 'bank_transfer' ? BANK_DETAILS : undefined,
      crypto_details: paymentMethod === 'crypto' ? CRYPTO_DETAILS : undefined,
      ctaUrl,
      locale,
    })

    // 8. Envoyer l'email avec le nouveau sujet
    const emailSubject = t.subject[locale](orderNumber)

    console.log(`📤 Envoi email à ${order.shipping_email}`)

    const emailResult = await sendEmail({
      to: order.shipping_email,
      subject: emailSubject,
      html,
      type: 'pending_payment',
      order_id,
    })

    console.log(`✅ Email envoyé: ${order.shipping_email}`)

    return {
      success: true,
      email_sent_to: order.shipping_email,
      mode: isGuest ? 'guest' : 'authenticated',
      payment_method: paymentMethod,
      tracking_link: ctaUrl,
      order_number: orderNumber,
      has_tracking_token: !!order.tracking_token,
      locale,
    }
  }),
)
