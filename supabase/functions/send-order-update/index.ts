// supabase/functions/send-order-update/index.ts

import { APP_BASE_URL, supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { getStatusMessage } from '../../utils/getStatusMessage.ts'
import { getValidLocale, translations } from '../../utils/i18n.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

interface OrderUpdateBody {
  order_id: string
  status: string
  locale?: string
}

Deno.serve(
  createHandler<OrderUpdateBody>(async (_req, body) => {
    const { order_id, status } = body
    if (!order_id || !status) throw new Error('Missing order_id or status')

    const { data: order } = await supabase
      .from('orders_full_view')
      .select('shipping_email, order_number, carrier, tracking_number, user_id, tracking_token')
      .eq('order_id', order_id)
      .maybeSingle()

    if (!order) throw new Error('Order not found')

    // Déterminer la locale (body > fallback FR par défaut)
    const locale = getValidLocale(body.locale ?? 'fr')
    const t = translations.statusUpdate

    const isGuest = !order.user_id
    const displayId = order.order_number ?? order_id

    // Génère le message texte personnalisé selon le statut (avec locale)
    const message = getStatusMessage(status, order.carrier, order.tracking_number, locale)

    // Calcul du lien de suivi dynamique (guest ou membre)
    let ctaUrl: string
    if (isGuest && order.tracking_token) {
      ctaUrl = `${APP_BASE_URL}/suivi-commande?token=${order.tracking_token}`
    } else {
      ctaUrl = `${APP_BASE_URL}/profil/commandes/${order_id}`
    }

    const html = renderEmailTemplate('status_update', {
      order_id,
      order_number: displayId,
      message,
      ctaUrl,
      locale,
    })

    // Sujet traduit
    const emailSubject = t.subject[locale](displayId)

    await sendEmail({
      to: order.shipping_email,
      subject: emailSubject,
      html,
      type: 'status_update',
      order_id,
    })

    return {
      email_sent: order.shipping_email,
      new_status: status,
      is_guest: isGuest,
      locale,
    }
  }),
)
