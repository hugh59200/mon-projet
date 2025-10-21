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

// ✅ Gestion CORS universelle
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

serve(async (req: { method: string; json: () => OrderPayload | PromiseLike<OrderPayload> }) => {
  // 🔸 Réponse aux preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() })
  }

  try {
    // 🔑 Variables d’environnement Supabase
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const env = Deno.env.get('ENV') || 'development'

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY manquant dans les variables Supabase')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 📦 Lecture du corps JSON
    const body: OrderPayload = await req.json()
    const { order_id, email, full_name, total_amount, items, created_at } = body

    if (!email || !order_id || !items?.length) {
      return new Response(JSON.stringify({ success: false, error: 'Requête incomplète.' }), {
        status: 200, // ✅ On renvoie toujours 200 pour éviter les erreurs front
        headers: corsHeaders(),
      })
    }

    // 💬 Choix de l’expéditeur selon l’environnement
    const fromEmail = env === 'production' ? 'contact@peptidestore.com' : 'onboarding@resend.dev'

    // 🧾 Contenu HTML pro et responsive
    const html = `
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; color:#111;">
        <h2 style="color:#008080;">Merci pour votre commande, ${full_name || 'cher client'} 🎉</h2>
        <p>Votre commande <strong>#${order_id}</strong> a bien été enregistrée.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px;">
          <thead>
            <tr style="background:#f6f6f6;">
              <th style="text-align:left; padding:8px;">Produit</th>
              <th style="text-align:right; padding:8px;">Qté</th>
              <th style="text-align:right; padding:8px;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (i) => `
                <tr>
                  <td style="padding:8px;">${i.name}</td>
                  <td style="text-align:right; padding:8px;">${i.quantity}</td>
                  <td style="text-align:right; padding:8px;">${(i.price * i.quantity).toFixed(2)} €</td>
                </tr>`,
              )
              .join('')}
          </tbody>
        </table>

        <p style="margin-top:15px;">
          <strong>Total :</strong> ${total_amount.toFixed(2)} €<br/>
          <strong>Date :</strong> ${new Date(created_at).toLocaleString('fr-FR')}
        </p>

        <p>Nous vous tiendrons informé de l’expédition sous peu 🚚</p>
        <hr/>
        <small>Merci de votre confiance,<br/>L’équipe PeptideStore 🧬</small>
      </div>
    `

    console.info(`📤 Envoi email via Resend → ${email} (${env})`)

    // 📧 Envoi via Resend API
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

    const resendData = await resendRes.json()
    console.info('📨 Réponse Resend:', resendData)

    // ⚠️ Si Resend retourne une erreur, on la log mais on ne fait pas planter le front
    if (!resendRes.ok) {
      console.error('❌ Erreur Resend:', resendData)
      await supabase.from('logs').insert([
        {
          type: 'email_error',
          order_id,
          email,
          message: JSON.stringify(resendData),
          created_at: new Date().toISOString(),
        },
      ])
      return new Response(
        JSON.stringify({ success: false, message: 'Erreur Resend, mais commande confirmée' }),
        { status: 200, headers: corsHeaders() },
      )
    }

    // ✅ Met à jour le statut de la commande
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', order_id)

    if (updateError) {
      console.error('⚠️ Erreur lors de la mise à jour du statut :', updateError)
    }

    // 📘 Log email envoyé
    await supabase.from('logs').insert([
      {
        type: 'email_sent',
        order_id,
        email,
        created_at: new Date().toISOString(),
      },
    ])

    return new Response(JSON.stringify({ success: true, message: 'Email envoyé avec succès ✅' }), {
      status: 200,
      headers: corsHeaders(),
    })
  } catch (err) {
    console.error('❌ Erreur Edge Function:', err)
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 200, headers: corsHeaders() }, // ✅ Toujours 200 pour éviter le toast rouge
    )
  }
})
