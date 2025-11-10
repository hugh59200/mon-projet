import { serve } from 'https://deno.land/std/http/server.ts'
import { buildTemplate } from '../utils/buildTemplate.ts' // si tu l’utilises
import { supabase } from '../utils/clients.ts'
import { logEmail } from '../utils/logEmail.ts'
import { sendEmail } from '../utils/sendEmail.ts'

serve(async (req) => {
  const { order_id, status } = await req.json()
  if (!order_id || !status) return new Response('Missing fields', { status: 400 })

  const { data: order } = await supabase
    .from('orders_full_view')
    .select('*')
    .eq('order_id', order_id)
    .maybeSingle()

  const email = order.shipping_email
  const name = order.shipping_name

  const html = buildTemplate({
    title: status,
    name,
    items: order.detailed_items,
    total: order.total_amount,
    status,
    tracking: order.tracking_number,
    carrier: order.carrier,
  })

  const sent = await sendEmail({ to: email, subject: `Commande – ${status}`, html })

  await logEmail({
    order_id,
    to_email: email,
    subject: `Commande – ${status}`,
    body_html: html,
    type: 'status_update',
    provider_response: sent,
    status: sent?.id ? 'sent' : 'error',
  })

  return new Response('Email sent', { status: 200 })
})
