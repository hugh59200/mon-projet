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

    const { data: order } = await supabase
      .from('orders_full_view')
      .select('shipping_email, order_number, carrier, tracking_number')
      .eq('order_id', order_id)
      .maybeSingle()

    if (!order) throw new Error('Order not found')

    const message = getStatusMessage(status, order.carrier, order.tracking_number)

    const html = renderEmailTemplate('status_update', {
      order_id,
      message,
    })

    await sendEmail({
      to: order.shipping_email,
      subject: `Mise à jour – Commande ${order.order_number ?? order_id}`,
      html,
      type: 'status_update',
      order_id,
    })

    return {
      email_sent: order.shipping_email,
      new_status: status,
    }
  }),
)
