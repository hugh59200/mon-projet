import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

serve(
  async (req: {
    method: string
    json: () =>
      | PromiseLike<{
          order_id: any
          email: any
          full_name: any
          total_amount: any
          items: any
          created_at: any
        }>
      | {
          order_id: any
          email: any
          full_name: any
          total_amount: any
          items: any
          created_at: any
        }
  }) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() })

    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY')
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const env = Deno.env.get('ENV') || 'development'

      if (!resendApiKey) throw new Error('RESEND_API_KEY manquant')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { order_id, email, full_name, total_amount, items, created_at } = await req.json()

      if (!order_id || !email || !items?.length) {
        return new Response(JSON.stringify({ success: false, message: 'Requête incomplète' }), {
          status: 400,
          headers: corsHeaders(),
        })
      }

      const productRows = items
        .map(
          (i: { name: any; quantity: number; price: number }) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.name}</td>
          <td style="text-align:center;padding:8px 12px;">${i.quantity}</td>
          <td style="text-align:right;padding:8px 12px;">${(i.price * i.quantity).toFixed(2)} €</td>
        </tr>
      `,
        )
        .join('')

      const html = `
      <div style="font-family:Arial, sans-serif;max-width:600px;margin:auto;color:#222;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <div style="background:#00796B;padding:20px;text-align:center;color:white;">
          <img src="https://fastpeptides.com/logo.png" alt="Fast Peptides" width="120" style="margin-bottom:10px;" />
          <h2 style="margin:0;font-size:22px;">Confirmation de votre commande 🎉</h2>
        </div>
        <div style="padding:24px;">
          <p>Bonjour ${full_name || 'cher client'},</p>
          <p>Nous avons bien reçu votre commande <strong>#${order_id}</strong> le ${new Date(
            created_at,
          ).toLocaleDateString('fr-FR')}.</p>
          <p>Voici le récapitulatif :</p>

          <table style="width:100%;border-collapse:collapse;border:1px solid #eee;font-size:14px;margin-top:10px;">
            <thead style="background:#f7f7f7;">
              <tr>
                <th align="left" style="padding:8px 12px;">Produit</th>
                <th align="center" style="padding:8px 12px;">Qté</th>
                <th align="right" style="padding:8px 12px;">Total</th>
              </tr>
            </thead>
            <tbody>${productRows}</tbody>
          </table>

          <p style="text-align:right;margin-top:16px;font-size:16px;"><b>Total : ${total_amount.toFixed(
            2,
          )} €</b></p>

          <p style="margin-top:24px;">Nous vous tiendrons informé dès que votre commande sera expédiée 🚚</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />
          <p style="font-size:13px;color:#777;text-align:center;">L’équipe Fast Peptides 🧬<br/>
          <a href="https://fastpeptides.com" style="color:#00796B;">fastpeptides.com</a></p>
        </div>
      </div>
    `

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
          subject: `Confirmation de votre commande #${order_id}`,
          html,
        }),
      })

      const data = await resendRes.json()
      await supabase.from('logs').insert([
        {
          type: resendRes.ok ? 'order_confirmation_sent' : 'order_confirmation_error',
          order_id,
          email,
          message: JSON.stringify(data),
          created_at: new Date().toISOString(),
        },
      ])

      return new Response(JSON.stringify({ success: resendRes.ok }), {
        status: 200,
        headers: corsHeaders(),
      })
    } catch (err) {
      console.error(err)
      return new Response(JSON.stringify({ success: false, error: String(err) }), {
        status: 200,
        headers: corsHeaders(),
      })
    }
  },
)
