// /supabase/functions/send-order-update/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { supabase } from '../utils/clients.ts'
import { sendEmail } from '../utils/sendEmail.ts'

serve(async (req) => {
  const payload = await req.json()
  const { order_id, status } = payload

  if (!order_id || !status) return new Response('Missing order_id or status', { status: 400 })

  const { data: order } = await supabase
    .from('orders_full_view')
    .select('*')
    .eq('order_id', order_id)
    .maybeSingle()

  if (!order) return new Response('Order not found', { status: 404 })

  const email = order.shipping_email
  const name = order.shipping_name

  const subject = buildSubject(status)
  const html = buildTemplate({
    title: subject,
    name,
    items: order.detailed_items,
    total: order.total_amount,
    status,
    tracking: order.tracking_number,
    carrier: order.carrier,
  })

  const sent = await sendEmail({ to: email, subject, html })

  await supabase.from('emails_sent').insert({
    order_id,
    to_email: email,
    subject,
    body_html: html,
    type: mapType(status),
    status: sent.id ? 'sent' : 'error',
    provider_response: sent,
  })

  return new Response('Email sent', { status: 200 })
})

function buildSubject(status: string) {
  switch (status) {
    case 'pending':
      return 'Nous avons reçu votre commande !'
    case 'paid':
      return 'Votre paiement a été confirmé ✅'
    case 'processing':
      return 'Votre commande est en préparation 🔬'
    case 'shipped':
      return 'Votre commande est expédiée 📦'
    case 'delivered':
      return 'Votre commande a été livrée 🎉'
    default:
      return 'Mise à jour de votre commande'
  }
}

function mapType(status: string) {
  switch (status) {
    case 'pending':
      return 'confirmation'
    case 'paid':
      return 'payment'
    case 'processing':
      return 'status_update'
    case 'shipped':
      return 'shipping'
    case 'delivered':
      return 'status_update'
    default:
      return 'custom'
  }
}
