// supabase/functions/send-order-update/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { supabase } from '../../utils/clients.ts'
import { getStatusMessage } from '../../utils/getStatusMessage.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

interface RequestBody {
  order_id: string
  status: string
}

serve(async (req: Request) => {
  try {
    const { order_id, status }: RequestBody = await req.json()

    if (!order_id || !status) {
      return new Response('Missing fields', { status: 400 })
    }

    const { data: order, error } = await supabase
      .from('orders_full_view')
      .select('shipping_email, order_number, carrier, tracking_number')
      .eq('order_id', order_id)
      .maybeSingle()

    if (error || !order) {
      return new Response('Order not found', { status: 404 })
    }

    const email = order.shipping_email
    const orderNumber = order.order_number ?? order_id
    const message = getStatusMessage(status, order.carrier, order.tracking_number)

    const html = renderEmailTemplate('status_update', { message })

    await sendEmail({
      to: email,
      subject: `Mise à jour – Commande ${orderNumber}`,
      type: 'status_update',
      html,
      order_id,
    })

    return new Response('Email sent', { status: 200 })
  } catch (err) {
    return new Response(`Error: ${String(err)}`, { status: 500 })
  }
})
