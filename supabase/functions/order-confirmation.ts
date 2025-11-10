// supabase/functions/order-confirmation/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { logEmail } from '../utils/logEmail.ts'
import { sendEmail } from '../utils/sendEmail.ts'
import { renderEmailTemplate } from '../utils/templates/renderEmailTemplate.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 })
  }

  try {
    const order = await req.json()
    const html = renderEmailTemplate('confirmation', order)

    const mailResult = await sendEmail({
      to: order.email,
      subject: `Confirmation commande #${order.order_id}`,
      html,
    })

    await logEmail({
      order_id: order.order_id,
      to_email: order.email,
      subject: `Confirmation commande #${order.order_id}`,
      body_html: html,
      type: 'confirmation',
      provider_response: mailResult,
      status: mailResult?.id ? 'sent' : 'error',
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('❌ Order-confirmation error:', err)
    return new Response(JSON.stringify({ success: false, error: `${err}` }), { status: 200 })
  }
})
