// supabase/functions/order-confirmation/index.ts

import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'
// ✅ On importe ton client existant qui est déjà ADMIN (Service Role)
import { APP_BASE_URL, supabase } from '../../utils/clients.ts'

interface OrderConfirmationBody {
  order_id?: string
  orderId?: string
}

Deno.serve(
  createHandler<OrderConfirmationBody>(async (_req, body) => {
    const order_id = body.order_id ?? body.orderId
    if (!order_id) throw new Error('Missing order_id')

    console.log(`🔍 Recherche commande: ${order_id}`)

    // 1. Récupération via le client ADMIN importé de clients.ts
    // Cela contourne la RLS car clients.ts utilise la Service Role Key
    const { data: order, error } = await supabase
      .from('orders_full_view')
      .select('*')
      .eq('order_id', order_id)
      .maybeSingle()

    if (error) {
      console.error('❌ Erreur DB:', error)
      throw error
    }

    if (!order) {
      console.error('❌ Commande introuvable')
      throw new Error('Order not found')
    }

    const orderNumber = order.order_number ?? order_id

    // 2. Logique intelligente pour le lien dans l'email
    // Si user_id est NULL (Invité) -> Lien Public de suivi
    // Si user_id existe (Membre) -> Lien Profil privé
    const ctaUrl = order.user_id
      ? `${APP_BASE_URL}/profil/commandes/${order_id}`
      : `${APP_BASE_URL}/suivi-commande?email=${encodeURIComponent(order.shipping_email)}&ref=${orderNumber}`

    const ctaLabel = order.user_id ? 'Voir ma commande' : 'Suivre mon colis'

    // 3. Préparation des données pour le template
    const html = renderEmailTemplate('confirmation', {
      order_id,
      order_number: orderNumber,
      created_at: order.created_at,
      full_name: order.shipping_name,

      // 💰 Données Financières
      total_amount: order.total_amount,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      discount_amount: order.discount_amount,

      // 📦 Mapping des items
      items: (order.detailed_items ?? []).map((i: any) => ({
        name: i.product_name ?? 'Produit',
        dosage: i.product_dosage,
        quantity: Number(i.quantity ?? 1),
        price: Number(i.product_price ?? 0),
        total: Number(i.total ?? 0),
      })),

      ctaLabel,
      ctaUrl,
    })

    // 4. Envoi de l'email
    await sendEmail({
      to: order.shipping_email,
      subject: `Confirmation de votre commande ${orderNumber}`,
      html,
      type: 'confirmation',
      order_id,
    })

    return {
      success: true,
      email_sent_to: order.shipping_email,
      mode: order.user_id ? 'auth' : 'guest',
    }
  }),
)
