import { serve } from 'https://deno.land/std/http/server.ts'
import { supabase } from '../../utils/clients.ts'
import { getStatusMessage } from '../../utils/getStatusMessage.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

serve(async (req: Request) => {

  // ✅ Fix CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  console.log('✅ send-order-update INVOKED')

  try {
    const { order_id, status } = await req.json()
    if (!order_id || !status) {
      return new Response('Missing fields', {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    }

    const { data: order } = await supabase
      .from('orders_full_view')
      .select('shipping_email, order_number, carrier, tracking_number')
      .eq('order_id', order_id)
      .maybeSingle()

    if (!order) {
      return new Response('Order not found', {
        status: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    }

    const message = getStatusMessage(status, order.carrier, order.tracking_number)
    const html = renderEmailTemplate('status_update', { message })

    await sendEmail({
      to: order.shipping_email,
      subject: `Mise à jour – Commande ${order.order_number || order_id}`,
      html,
      type: 'status_update',
      order_id,
    })

    return new Response('Email sent', {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })

  } catch (err) {
    console.error(err)
    return new Response(`Error: ${err}`, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  }
})
