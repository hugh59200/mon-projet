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
      .select(
        'shipping_email, order_number, carrier, tracking_number, user_id, tracking_token, total_amount, payment_method, shipping_name',
      )
      .eq('order_id', order_id)
      .maybeSingle()

    if (!order) throw new Error('Order not found')

    // Déterminer la locale (body > fallback FR par défaut)
    const locale = getValidLocale(body.locale ?? 'fr')

    const isGuest = !order.user_id
    const displayId = order.order_number ?? order_id

    // Calcul du lien de suivi dynamique (guest ou membre)
    let ctaUrl: string
    if (isGuest && order.tracking_token) {
      ctaUrl = `${APP_BASE_URL}/suivi-commande?token=${order.tracking_token}`
    } else {
      ctaUrl = `${APP_BASE_URL}/profil/commandes/${order_id}`
    }

    let html: string
    let emailSubject: string

    // Cas spécial : statut "processing" = paiement validé (email premium vert)
    if (status.toLowerCase() === 'processing') {
      const t = translations.paymentValidated

      html = renderEmailTemplate('payment_validated', {
        order_number: displayId,
        full_name: order.shipping_name,
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        ctaUrl,
        locale,
      })

      emailSubject = t.subject[locale](displayId)
    } else {
      // Comportement standard pour tous les autres statuts
      const t = translations.statusUpdate
      const message = getStatusMessage(status, order.carrier, order.tracking_number, locale)

      html = renderEmailTemplate('status_update', {
        order_id,
        order_number: displayId,
        message,
        ctaUrl,
        locale,
      })

      emailSubject = t.subject[locale](displayId)
    }

    await sendEmail({
      to: order.shipping_email,
      subject: emailSubject,
      html,
      type: status.toLowerCase() === 'processing' ? 'payment_validated' : 'status_update',
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
