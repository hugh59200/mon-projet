import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ✅ Typage
type OrderStatusPayload = {
  order_id: string
  status: string
  email: string
  full_name?: string
}

// ✅ Headers CORS
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

serve(
  async (req: {
    method: string
    json: () => OrderStatusPayload | PromiseLike<OrderStatusPayload>
  }) => {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders() })
    }

    try {
      // 🔐 Variables d'environnement
      const resendApiKey = Deno.env.get('RESEND_API_KEY')
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const env = Deno.env.get('ENV') || 'development'

      if (!resendApiKey) throw new Error('RESEND_API_KEY manquant')

      const supabase = createClient(supabaseUrl, supabaseKey)
      const body: OrderStatusPayload = await req.json()
      const { order_id, status, email, full_name } = body

      if (!order_id || !status || !email) {
        return new Response(JSON.stringify({ success: false, message: 'Requête incomplète' }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      const fromEmail = env === 'production' ? 'contact@peptidestore.com' : 'onboarding@resend.dev'

      // 📧 Email HTML
      const html = `
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; color:#111;">
        <h2 style="color:#008080;">Mise à jour de votre commande 🧬</h2>
        <p>Bonjour ${full_name || 'cher client'},</p>
        <p>Le statut de votre commande <strong>#${order_id}</strong> a été mis à jour :</p>
        <p style="font-size:16px; font-weight:bold;">${status}</p>
        <p>Merci pour votre confiance 🙌</p>
        <hr/>
        <small>L’équipe Fast Peptides</small>
      </div>
    `

      // 📨 Envoi via Resend
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: `Votre commande #${order_id} – Statut : ${status}`,
          html,
        }),
      })

      const data = await resendRes.json()
      console.info('📨 Réponse Resend:', data)

      // 🧾 Log en base
      if (!resendRes.ok) {
        await supabase
          .from('logs')
          .insert([
            { type: 'order_status_email_error', order_id, email, message: JSON.stringify(data) },
          ])
        return new Response(JSON.stringify({ success: false, message: 'Erreur Resend' }), {
          status: 200,
          headers: corsHeaders(),
        })
      }

      await supabase
        .from('logs')
        .insert([
          {
            type: 'order_status_email_sent',
            order_id,
            email,
            created_at: new Date().toISOString(),
          },
        ])

      return new Response(JSON.stringify({ success: true, message: 'Email de statut envoyé ✅' }), {
        status: 200,
        headers: corsHeaders(),
      })
    } catch (err) {
      console.error('❌ Erreur Edge Function:', err)
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      return new Response(JSON.stringify({ success: false, error: errorMessage }), {
        status: 200,
        headers: corsHeaders(),
      })
    }
  },
)
