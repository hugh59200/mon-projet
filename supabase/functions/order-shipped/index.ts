import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type ShipmentPayload = {
  order_id: string
  email: string
  full_name?: string
  tracking_number?: string
  carrier?: string
  shipped_at?: string
}

// ✅ CORS
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

serve(
  async (req: { method: string; json: () => ShipmentPayload | PromiseLike<ShipmentPayload> }) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() })

    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY')
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const env = Deno.env.get('ENV') || 'development'

      if (!resendApiKey) throw new Error('RESEND_API_KEY manquant')

      const supabase = createClient(supabaseUrl, supabaseKey)

      const body: ShipmentPayload = await req.json()
      const { order_id, email, full_name, tracking_number, carrier, shipped_at } = body

      if (!email || !order_id)
        return new Response(JSON.stringify({ success: false, error: 'Requête incomplète' }), {
          status: 200,
          headers: corsHeaders(),
        })

      const fromEmail = env === 'production' ? 'contact@peptidestore.com' : 'onboarding@resend.dev'

      const html = `
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; color:#111;">
        <h2 style="color:#008080;">Votre commande est expédiée 🚀</h2>
        <p>Bonjour ${full_name || 'cher client'},</p>
        <p>Votre commande <strong>#${order_id}</strong> a été expédiée avec succès.</p>

        ${
          carrier && tracking_number
            ? `<p><b>Transporteur :</b> ${carrier}<br/>
               <b>Numéro de suivi :</b> <a href="${tracking_number}" target="_blank">${tracking_number}</a></p>`
            : '<p>Les informations de suivi seront disponibles sous peu.</p>'
        }

        <p>Date d’expédition : ${new Date(shipped_at || Date.now()).toLocaleString('fr-FR')}</p>
        <p>Merci pour votre confiance 🙌</p>
        <hr/>
        <small>L’équipe PeptideStore 🧬</small>
      </div>
    `

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: `Votre commande #${order_id} a été expédiée 🚚`,
          html,
        }),
      })

      const data = await resendRes.json()
      console.info('📨 Réponse Resend:', data)

      if (!resendRes.ok) {
        await supabase
          .from('logs')
          .insert([
            { type: 'shipment_email_error', order_id, email, message: JSON.stringify(data) },
          ])
        return new Response(JSON.stringify({ success: false, message: 'Erreur Resend' }), {
          status: 200,
          headers: corsHeaders(),
        })
      }

      // ✅ Met à jour le statut de la commande
      await supabase
        .from('orders')
        .update({ status: 'shipped', shipped_at: new Date().toISOString() })
        .eq('id', order_id)

      await supabase
        .from('logs')
        .insert([
          { type: 'shipment_email_sent', order_id, email, created_at: new Date().toISOString() },
        ])

      return new Response(
        JSON.stringify({ success: true, message: 'Email expédition envoyé ✅' }),
        {
          status: 200,
          headers: corsHeaders(),
        },
      )
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
