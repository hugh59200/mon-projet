// supabase/functions/send-shipping-email/index.ts

import { APP_BASE_URL, supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { getValidLocale, translations } from '../../utils/i18n.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

interface ShippingBody {
  order_id: string
  locale?: string
}

Deno.serve(
  createHandler<ShippingBody>(async (_req, body) => {
    const { order_id } = body
    if (!order_id) throw new Error('Missing order_id')

    const { data: order } = await supabase
      .from('orders_full_view')
      .select('*')
      .eq('order_id', order_id)
      .maybeSingle()

    if (!order) throw new Error('Order not found')

    // Déterminer la locale (body > order > fallback EN)
    const locale = getValidLocale(body.locale ?? order.locale)
    const t = translations.shipping

    const orderNumber = order.order_number ?? order_id
    const isGuest = !order.user_id

    // Calcul du nombre d'articles (sans les noms de produits)
    const detailedItems = order.detailed_items ?? []
    const itemCount = detailedItems.reduce((acc: number, item: any) => acc + Number(item.quantity ?? 1), 0)

    // URL de suivi transporteur
    const tracking_url = order.tracking_number
      ? `https://www.laposte.fr/outils/suivre-vos-envois?code=${order.tracking_number}`
      : undefined

    // URL vers la commande sur le site (guest ou membre)
    let ctaUrl: string
    if (isGuest && order.tracking_token) {
      ctaUrl = `${APP_BASE_URL}/suivi-commande?token=${order.tracking_token}`
    } else if (isGuest) {
      ctaUrl = `${APP_BASE_URL}/suivi-commande?email=${encodeURIComponent(order.shipping_email)}&ref=${orderNumber}`
    } else {
      ctaUrl = `${APP_BASE_URL}/profil/commandes/${order_id}`
    }

    const html = renderEmailTemplate('shipping', {
      order_number: orderNumber,
      full_name: order.shipping_name,
      item_count: itemCount,
      carrier: order.carrier,
      tracking_number: order.tracking_number,
      tracking_url,
      ctaUrl,
      locale,
    })

    // Sujet traduit
    const emailSubject = t.subject[locale](orderNumber)

    await sendEmail({
      to: order.shipping_email,
      subject: emailSubject,
      html,
      type: 'shipping',
      order_id,
    })

    return { success: true, locale }
  }),
)
