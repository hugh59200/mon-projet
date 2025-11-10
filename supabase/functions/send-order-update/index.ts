import { serve } from 'https://deno.land/std/http/server.ts'
import { supabase } from '../../utils/clients.ts'
import { getStatusMessage } from '../../utils/getStatusMessage.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

serve(async (req: Request) => {
  const { order_id, status } = await req.json()
  if (!order_id || !status) return new Response('Missing fields', { status: 400 })

  const { data: order } = await supabase
    .from('orders_full_view')
    .select('*')
    .eq('order_id', order_id)
    .maybeSingle()

  if (!order) return new Response('Order not found', { status: 404 })

  const email = order.shipping_email

  const html = renderEmailTemplate('status_update', {
    message: getStatusMessage(status, order.carrier, order.tracking_number),
  })

  await sendEmail({ to: email, subject: `Commande – ${status}`, html })

  return new Response('Email sent', { status: 200 })
})
