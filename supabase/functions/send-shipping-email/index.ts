import { supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts' // Je l'ai passé en createHandler par cohérence
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

interface ShippingBody {
  order_id: string
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

    const tracking_url = order.tracking_number
      ? `https://www.laposte.fr/outils/suivre-vos-envois?code=${order.tracking_number}`
      : undefined

    // Mapping items simple pour le mail d'expédition
    const itemsMap = (order.detailed_items ?? []).map((i: any) => ({
      name: i.product_name,
      quantity: i.quantity,
    }))

    const html = renderEmailTemplate('shipping', {
      order_id,
      order_number: order.order_number, // Ajout V2
      full_name: order.shipping_name,
      carrier: order.carrier,
      tracking_number: order.tracking_number,
      tracking_url,
      items: itemsMap,
    })

    await sendEmail({
      to: order.shipping_email,
      subject: `Votre commande ${order.order_number ?? order_id} est expédiée 🚀`,
      html,
      type: 'shipping',
      order_id,
    })

    return { success: true }
  }),
)
