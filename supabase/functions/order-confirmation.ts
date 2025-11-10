import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { logEmail } from '../utils/logEmail.ts'
import { sendEmail } from '../utils/sendEmail.ts'
import { renderEmailTemplate } from '../utils/templates/renderEmailTemplate.ts'

serve(async (req) => {
  try {
    const order = await req.json()
    const html = renderEmailTemplate('confirmation', order)

    const sent = await sendEmail({
      to: order.email,
      subject: `Confirmation commande #${order.order_id}`,
      html,
      type: 'confirmation',
    })

    await logEmail({
      order_id: order.order_id,
      to_email: order.email,
      subject: `Confirmation commande #${order.order_id}`,
      body_html: html,
      type: 'confirmation',
      provider_response: sent,
      status: sent?.id ? 'sent' : 'error',
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 200 })
  }
})
