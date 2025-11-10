// /supabase/functions/send-order-update/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import { Resend } from 'npm:resend'
import { sendEmail } from '../utils/sendEmail.ts'

// ✅ Cloudflare/Turbo: pas de secrets hardcodés
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const resend = new Resend(RESEND_API_KEY)

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_KEY')!)

serve(async (req) => {
  const payload = await req.json()
  const { order_id, status } = payload

  if (!order_id || !status) return new Response('Missing order_id or status', { status: 400 })

  // ✅ Récupération de la commande complète
  const { data: order, error } = await supabase
    .from('orders_full_view')
    .select('*')
    .eq('order_id', order_id)
    .maybeSingle()

  if (error || !order) return new Response('Order not found', { status: 404 })

  const email = order.shipping_email
  const name = order.shipping_name

  // ✅ Choix template selon le statut
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

  // ✅ Envoi via Resend
  const sent = await sendEmail({
    to: email,
    subject,
    html,
  })

  // ✅ Log en base (emails_sent)
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
