// supabase/functions/send-order-update.ts (Modifié)

import { supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { getStatusMessage } from '../../utils/getStatusMessage.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

interface OrderUpdateBody {
  order_id: string
  status: string
}

Deno.serve(
  createHandler<OrderUpdateBody>(async (_req, body) => {
    const { order_id, status } = body
    if (!order_id || !status) throw new Error('Missing order_id or status')

    // ✅ SELECT V2 : On ajoute user_id et tracking_token
    const { data: order } = await supabase
      .from('orders_full_view')
      .select('shipping_email, order_number, carrier, tracking_number, user_id, tracking_token') // 🆕 Ajout de user_id et tracking_token
      .eq('order_id', order_id)
      .maybeSingle()

    if (!order) throw new Error('Order not found')

    const isGuest = !order.user_id // Détermine si c'est un invité
    const displayId = order.order_number ?? order_id

    // Génère le message texte personnalisé selon le statut
    const message = getStatusMessage(status, order.carrier, order.tracking_number)

    // 🆕 Calcul du lien de suivi dynamique (guest ou membre)
    let ctaUrl: string
    if (isGuest && order.tracking_token) {
      ctaUrl = `https://fast-peptides.com/suivi-commande?token=${order.tracking_token}`
    } else {
      ctaUrl = `https://fast-peptides.com/profil/commandes/${order_id}`
    }

    const html = renderEmailTemplate('status_update', {
      order_id,
      order_number: displayId,
      message,
      // 🆕 Passage du lien calculé au template
      ctaUrl,
    })

    await sendEmail({
      to: order.shipping_email,
      subject: `Mise à jour – Commande ${displayId}`,
      html,
      type: 'status_update',
      order_id,
    })

    return {
      email_sent: order.shipping_email,
      new_status: status,
      is_guest: isGuest, // Information supplémentaire pour le log
    }
  }),
)
