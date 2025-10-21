import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type OrderStatusPayload = {
  order_id: string
  status: string
  email: string
  full_name?: string
  tracking_number?: string
  carrier?: string
}

// ✅ Headers CORS
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

// 🧠 Texte dynamique selon le statut
function getStatusMessage(status: string) {
  switch (status.toLowerCase()) {
    case 'en attente':
    case 'pending':
      return `Votre commande est en attente de traitement. Nous la préparerons très bientôt. 🕓`
    case 'en préparation':
    case 'processing':
      return `Votre commande est en cours de préparation dans nos laboratoires. 🧪`
    case 'expédiée':
    case 'shipped':
      return `Votre commande a été expédiée 🚚. Vous la recevrez très prochainement.`
    case 'terminée':
    case 'completed':
      return `Votre commande a été livrée avec succès 🎉. Merci de votre confiance !`
    case 'annulée':
    case 'canceled':
      return `Votre commande a été annulée. Si vous pensez qu'il s'agit d'une erreur, contactez notre support. ❌`
    case 'confirmée':
    case 'confirmed':
      return `Votre commande a bien été confirmée ✅. Elle sera bientôt préparée.`
    default:
      return `Le statut de votre commande a été mis à jour : <b>${status}</b>`
  }
}

serve(async (req) => {
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
    const { order_id, status, email, full_name, tracking_number, carrier } = body

    if (!order_id || !status || !email) {
      return new Response(JSON.stringify({ success: false, message: 'Requête incomplète' }), {
        status: 400,
        headers: corsHeaders(),
      })
    }

    // 🧾 Récupération de la commande
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, items, total_amount, created_at')
      .eq('id', order_id)
      .single()

    if (error || !order) {
      console.error('❌ Erreur récupération commande :', error)
      throw new Error('Commande introuvable')
    }

    // 🔍 Parser items
    let itemsArray: any[] = []
    try {
      if (Array.isArray(order.items)) {
        itemsArray = order.items
      } else if (typeof order.items === 'string') {
        itemsArray = JSON.parse(order.items)
      }
    } catch (e) {
      console.warn('⚠️ Erreur parsing items:', e)
    }

    // 🧩 Construire les lignes produits
    const productRows =
      itemsArray.length > 0
        ? itemsArray
            .map(
              (item: any) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${(
          item.price * item.quantity
        ).toFixed(2)} €</td>
      </tr>
    `,
            )
            .join('')
        : `<tr><td colspan="3" style="text-align:center;padding:12px;">Aucun produit trouvé</td></tr>`

    // 💬 Texte personnalisé selon le statut
    const message = getStatusMessage(status)

    // 💎 HTML stylé & responsive avec bouton de suivi
    const html = `
    <div style="font-family:Arial, sans-serif;max-width:600px;margin:auto;color:#222;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <div style="background:#00796B;padding:20px;text-align:center;color:white;">
        <img src="https://fastpeptides.com/logo.png" alt="Fast Peptides" width="120" style="margin-bottom:10px;" />
        <h2 style="margin:0;font-size:22px;">Mise à jour de votre commande 🧬</h2>
      </div>
      
      <div style="padding:24px;">
        <p>Bonjour ${full_name || 'cher client'},</p>
        <p>${message}</p>

        ${
          status.toLowerCase() === 'expédiée' || status.toLowerCase() === 'shipped'
            ? `
          <div style="background:#f0fdf4;border:1px solid #a7f3d0;padding:16px 20px;border-radius:10px;margin:20px 0;">
            <h3 style="margin:0 0 8px 0;color:#065f46;">📦 Informations d'expédition</h3>
            <p style="margin:4px 0;"><b>Transporteur :</b> ${carrier || 'Non spécifié'}</p>
            ${
              tracking_number
                ? `
              <p style="margin:4px 0;"><b>Numéro de suivi :</b> ${tracking_number}</p>
              <div style="text-align:center;margin-top:12px;">
                <a href="${tracking_number}" target="_blank" style="display:inline-block;background:#00796B;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold;">
                  🚚 Suivre mon colis
                </a>
              </div>`
                : `<p>Les informations de suivi seront communiquées sous peu.</p>`
            }
          </div>
        `
            : ''
        }

        <h3 style="margin-top:24px;margin-bottom:8px;">Détails de la commande</h3>
        <table style="width:100%;border-collapse:collapse;border:1px solid #eee;font-size:14px;">
          <thead>
            <tr style="background:#f7f7f7;">
              <th align="left" style="padding:8px 12px;">Produit</th>
              <th align="center" style="padding:8px 12px;">Qté</th>
              <th align="right" style="padding:8px 12px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>

        <p style="text-align:right;margin-top:16px;font-size:16px;">
          <b>Total : ${order.total_amount.toFixed(2)} €</b>
        </p>

        <p style="margin-top:32px;">Merci pour votre confiance 🙌</p>
        <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />
        <p style="font-size:13px;color:#777;text-align:center;">
          L’équipe Fast Peptides 🧬<br/>
          <a href="https://fastpeptides.com" style="color:#00796B;text-decoration:none;">fastpeptides.com</a>
        </p>
      </div>
    </div>
  `

    const fromEmail = env === 'production' ? 'contact@peptidestore.com' : 'onboarding@resend.dev'

    // 📧 Envoi via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: `Votre commande – ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html,
      }),
    })

    const data = await resendRes.json()
    console.info('📨 Réponse Resend:', data)

    // 🧾 Logs
    const logType = resendRes.ok ? 'order_status_email_sent' : 'order_status_email_error'
    await supabase.from('logs').insert([
      {
        type: logType,
        order_id,
        email,
        message: JSON.stringify(data),
        created_at: new Date().toISOString(),
      },
    ])

    if (!resendRes.ok) {
      return new Response(JSON.stringify({ success: false, message: 'Erreur Resend' }), {
        status: 200,
        headers: corsHeaders(),
      })
    }

    return new Response(JSON.stringify({ success: true, message: 'Email envoyé ✅' }), {
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
})
