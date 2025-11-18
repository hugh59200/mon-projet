import { supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
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

    const { data: order } = await supabase
      .from('orders_full_view')
      .select('*')
      .eq('order_id', order_id)
      .maybeSingle()

    if (!order) throw new Error('Order not found')

    const orderNumber = order.order_number ?? order_id

    const html = renderEmailTemplate('confirmation', {
      order_id,
      order_number: orderNumber,
      items: order.detailed_items ?? [],
      total_amount: order.total_amount,
      full_name: order.shipping_name,
      created_at: order.created_at,
      ctaLabel: 'Voir ma commande',
      ctaUrl: `https://fast-peptides.com/compte/commandes/${orderNumber}`,
    })

    await sendEmail({
      to: order.shipping_email,
      subject: `Confirmation commande #${orderNumber}`,
      html,
      type: 'confirmation',
      order_id,
    })

    return { email_sent: order.shipping_email, order_number: orderNumber }
  }),
)
