// supabase/functions/order-confirmation/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { logEmail } from '../../utils/logEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() })

  try {
    const { order_id, email, full_name, total_amount, items, created_at } = await req.json()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const html = renderEmailTemplate('confirmation', {
      order_id,
      full_name,
      total_amount,
      items,
      created_at,
    })

    await logEmail({
      order_id,
      to_email: email,
      subject: `Confirmation commande #${order_id}`,
      body_html: html,
      type: 'confirmation',
      provider_response: {},
      status: 'sent',
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders(),
    })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: `${err}` }), {
      status: 200,
      headers: corsHeaders(),
    })
  }
})
