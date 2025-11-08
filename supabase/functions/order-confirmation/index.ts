// supabase/functions/order-confirmation/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@3.2.0'
import { logEmail } from '../../utils/logEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const ENV = Deno.env.get('ENV') || 'development'
const FROM_DEV = Deno.env.get('RESEND_FROM_DEV') || 'Fast Peptides <onboarding@resend.dev>'
const FROM_PROD = Deno.env.get('RESEND_FROM_PROD') || 'Fast Peptides <no-reply@fastpeptides.com>'
const FROM = ENV === 'development' ? FROM_DEV : FROM_PROD

const resend = new Resend(RESEND_API_KEY)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 })

  try {
    const order = await req.json()
    const html = renderEmailTemplate('confirmation', order)

    const res = await resend.emails.send({
      from: FROM,
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
      provider_response: res,
      status: 'sent',
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: `${err}` }), { status: 200 })
  }
})
