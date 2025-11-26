// supabase/functions/order-confirmation/index.ts

import { APP_BASE_URL, supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { logEmail } from '../../utils/logEmail.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

interface OrderConfirmationBody {
  order_id?: string
  orderId?: string
}

Deno.serve(
  createHandler<OrderConfirmationBody>(async (_req, body) => {
    const order_id = body.order_id ?? body.orderId
    if (!order_id) throw new Error('Missing order_id')

    console.log(`🔍 Recherche commande: ${order_id}`)

    // 1. Récupération via le client ADMIN (Service Role Key)
    const { data: order, error } = await supabase
      .from('orders_full_view')
      .select('*')
      .eq('order_id', order_id)
      .maybeSingle()

    if (error) {
      console.error('❌ Erreur DB:', error)
      throw error
    }

    if (!order) {
      console.error('❌ Commande introuvable')
      throw new Error('Order not found')
    }

    const orderNumber = order.order_number ?? order_id
    const isGuest = !order.user_id

    // 🆕 Validation email
    if (!order.shipping_email || !order.shipping_email.includes('@')) {
      throw new Error(`Email invalide: ${order.shipping_email}`)
    }

    // 2. Construction du lien intelligent selon le type d'utilisateur
    let ctaUrl: string
    let ctaLabel: string

    if (isGuest) {
      // INVITÉ : Lien de tracking public avec TOKEN sécurisé
      if (!order.tracking_token) {
        console.warn(`⚠️ Token manquant pour ${order_id}, fallback email+ref`)
        ctaUrl = `${APP_BASE_URL}/suivi-commande?email=${encodeURIComponent(order.shipping_email)}&ref=${orderNumber}`
      } else {
        console.log(`🔐 Token trouvé: ${order.tracking_token.substring(0, 8)}...`)
        ctaUrl = `${APP_BASE_URL}/suivi-commande?token=${order.tracking_token}`
      }
      ctaLabel = 'Suivre ma commande'
    } else {
      // MEMBRE : Lien vers le profil privé
      ctaUrl = `${APP_BASE_URL}/profil/commandes/${order_id}`
      ctaLabel = 'Voir ma commande'
      console.log(`👤 Email pour membre: ${order.user_id}`)
    }

    // 3. Préparation des données pour le template
    const html = renderEmailTemplate('confirmation', {
      order_id,
      order_number: orderNumber,
      created_at: order.created_at,
      full_name: order.shipping_name,

      // 💰 Données Financières
      total_amount: order.total_amount,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      discount_amount: order.discount_amount,

      // 📦 Mapping des items
      items: (order.detailed_items ?? []).map((i: any) => ({
        name: i.product_name ?? 'Produit',
        dosage: i.product_dosage,
        quantity: Number(i.quantity ?? 1),
        price: Number(i.product_price ?? 0),
        total: Number(i.total ?? 0),
      })),

      // 🆕 Liens intelligents
      ctaLabel,
      ctaUrl,
    })

    // 4. Envoi de l'email
    const emailSubject = `Confirmation de votre commande ${orderNumber}`
    const emailResult = await sendEmail({
      to: order.shipping_email,
      subject: emailSubject,
      html,
      type: 'confirmation',
      order_id,
    })

    // 🆕 5. Log dans emails_sent via logEmail
    if (emailResult.success) {
      await logEmail({
        order_id,
        to_email: order.shipping_email,
        subject: emailSubject,
        body_html: html,
        type: 'confirmation',
        provider_response: emailResult.data || null,
        status: 'sent',
      })
      console.log('✅ Email enregistré dans emails_sent')
    } else {
      // Log même en cas d'échec pour debugging
      await logEmail({
        order_id,
        to_email: order.shipping_email,
        subject: emailSubject,
        body_html: html,
        type: 'confirmation',
        provider_response: emailResult.error || null,
        status: 'error',
      })
      console.error('❌ Échec envoi email')
    }

    console.log(`✅ Email envoyé à ${order.shipping_email}`)

    return {
      success: true,
      email_sent_to: order.shipping_email,
      mode: isGuest ? 'guest' : 'authenticated',
      tracking_link: ctaUrl,
      order_number: orderNumber,
      has_tracking_token: !!order.tracking_token,
    }
  }),
)
