// supabase/functions/order-confirmation/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@3.2.0'
import { logEmail } from '../../utils/logEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

// ✅ ENV vars
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// ✅ Domaine vérifié → une seule adresse d'envoi
const FROM = 'Fast Peptides <no-reply@fastpeptides.com>'

const resend = new Resend(RESEND_API_KEY)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 })
  }

  try {
    const order = await req.json()
    const html = renderEmailTemplate('confirmation', order)

    // ✅ Email d’envoi
    const mailResult = await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Confirmation commande #${order.order_id}`,
      html,
    })

    // ✅ Logging
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
