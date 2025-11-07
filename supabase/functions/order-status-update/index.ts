// ============================================================
// 🔧 Chargement des variables d'environnement AVANT TOUT
// ============================================================
import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts'
await load({ envPath: new URL('./.env', import.meta.url).pathname })

// ============================================================
// 📦 Imports des dépendances
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getStatusMessage } from '../../utils/getStatusMessage.ts'
import { logEmail } from '../../utils/logEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

// ============================================================
// 🧾 Types
// ============================================================
type OrderStatusPayload = {
  order_id: string
  status: string
  email: string
  full_name?: string
  carrier?: string
  tracking_number?: string
}

// ============================================================
// 🌍 CORS
// ============================================================
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

// ============================================================
// 🚀 Serveur Deno local
// ============================================================
console.log('🚀 Listening on http://localhost:8000')
console.log('🔑 ENV LOADED:', {
  RESEND_API_KEY: Deno.env.get('RESEND_API_KEY') ? '✅' : '❌',
  // RESEND_API_KEY: Deno.env.get('RESEND_API_KEY') ? '✅' : '❌',
  SUPABASE_URL: Deno.env.get('SUPABASE_URL') ? '✅' : '❌',
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? '✅' : '❌',
  ENV: Deno.env.get('ENV'),
})

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() })

  try {
    // ✅ Récupération des variables d’environnement
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const env = Deno.env.get('ENV') || 'development'

    if (!resendApiKey) throw new Error('RESEND_API_KEY is missing')
    if (!supabaseUrl) throw new Error('SUPABASE_URL is required')
    if (!supabaseKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { order_id, status, email, full_name, carrier, tracking_number }: OrderStatusPayload =
      await req.json()

    const message = getStatusMessage(status, carrier, tracking_number)
    const html = renderEmailTemplate('status_update', { full_name, message, status })

    const fromEmail = env === 'production' ? 'contact@peptidestore.com' : 'onboarding@resend.dev'

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: `Commande – ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html,
      }),
    })

    const providerResponse = await resendRes.json()

    console.log('📤 Resend response:', providerResponse)
    console.log('📤 resendApiKey:', resendApiKey)

    await logEmail({
      order_id,
      to_email: email,
      subject: `Commande – ${status}`,
      body_html: html,
      type: 'status_update',
      provider_response: providerResponse,
      status: resendRes.ok ? 'sent' : 'error',
    })

    await supabase.from('order_status_logs').insert({
      order_id,
      status,
      sent_at: new Date().toISOString(),
      email,
    })

    return new Response(JSON.stringify({ success: resendRes.ok }), {
      status: 200,
      headers: corsHeaders(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('❌ Erreur Edge Function:', message)
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 200,
      headers: corsHeaders(),
    })
  }
})
