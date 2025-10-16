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

serve(async (req) => {
  // 🔸 Réponse aux preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() })
  }

  try {
    // 🔑 Variables d’environnement
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
        status: 400,
        headers: corsHeaders(),
      })
    }

    // 💬 Choix de l’expéditeur selon l’environnement
    const fromEmail = env === 'production' ? 'contact@peptidestore.com' : 'onboarding@resend.dev'

    // 🧾 Contenu de l’email HTML
    const itemsHtml = items
      .map((i) => `<li>${i.name} — ${i.quantity} × ${i.price.toFixed(2)} €</li>`)
      .join('')

    const html = `
      <h2>Merci pour votre commande, ${full_name || 'cher client'} !</h2>
      <p>Votre commande <b>#${order_id}</b> a bien été enregistrée.</p>
      <ul>${itemsHtml}</ul>
      <p><b>Total :</b> ${total_amount.toFixed(2)} €</p>
      <p>Date : ${new Date(created_at).toLocaleString('fr-FR')}</p>
      <p>Nous vous tiendrons informé de l’expédition sous peu 🚚</p>
      <hr/>
      <small>Merci de votre confiance,<br/>L’équipe PeptideStore</small>
    `

    console.info(`📤 Envoi email via Resend → ${email} (${env})`)

    // 📧 Appel à Resend API
    const res = await fetch('https://api.resend.com/emails', {
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

    const data = await res.json()
    console.info('📨 Réponse Resend:', data)

    if (!res.ok) {
      console.error('❌ Erreur Resend:', data)
      return new Response(JSON.stringify({ success: false, error: data }), {
        status: 400,
        headers: corsHeaders(),
      })
    }

    // ✅ Met à jour le statut de la commande
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', order_id)

    if (updateError) {
      console.error('⚠️ Erreur lors de la mise à jour du statut :', updateError)
    }

    // 📘 Log optionnel dans une table dédiée
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
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: corsHeaders(),
    })
  }
})
