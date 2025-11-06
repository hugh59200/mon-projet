import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { logEmail } from '../../utils/logEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

type OrderPayload = {
  order_id: string
  email: string
  full_name?: string
  total_amount: number
  items: { name: string; quantity: number; price: number }[]
  created_at: string
}

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
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const env = Deno.env.get('ENV') || 'development'

    if (!resendApiKey) throw new Error('RESEND_API_KEY manquant')

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { order_id, email, full_name, total_amount, items, created_at }: OrderPayload =
      await req.json()

    // 💎 Génération du HTML depuis le template
    const html = renderEmailTemplate('confirmation', {
      order_id,
      full_name,
      total_amount,
      items,
      created_at,
    })

    const fromEmail = env === 'production' ? 'contact@peptidestore.com' : 'onboarding@resend.dev'

    // 📧 Envoi de l’e-mail via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: `Confirmation commande #${order_id}`,
        html,
      }),
    })

    const providerResponse = await resendRes.json()

    // 🧾 Log dans Supabase
    await logEmail({
      order_id,
      to_email: email,
      subject: `Confirmation commande #${order_id}`,
      body_html: html,
      type: 'confirmation',
      provider_response: providerResponse,
      status: resendRes.ok ? 'sent' : 'error',
    })

    return new Response(JSON.stringify({ success: resendRes.ok }), {
      status: 200,
      headers: corsHeaders(),
    })
  } catch (err) {
    // ✅ Typage propre pour Deno (err = unknown)
    const message = err instanceof Error ? err.message : String(err)
    console.error('❌ Erreur Edge Function:', message)

    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 200,
      headers: corsHeaders(),
    })
  }
})
