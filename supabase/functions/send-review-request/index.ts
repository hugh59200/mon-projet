// supabase/functions/send-review-request/index.ts
// Edge Function pour envoyer les emails de demande d'avis (J+10 après expédition)

import { APP_BASE_URL, supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { getValidLocale, translations } from '../../utils/i18n.ts'
import { sendEmail } from '../../utils/sendEmail.ts'
import { renderEmailTemplate } from '../../utils/templates/renderEmailTemplate.ts'

interface ReviewRequestBody {
  order_id?: string // Optionnel : pour envoyer un seul email manuellement
  locale?: string
}

interface OrderForReview {
  order_id: string
  order_number: string
  email: string
  full_name: string
  user_id: string | null
  is_guest: boolean
  tracking_token: string | null
  shipped_at: string
  first_product_id: string
  first_product_name: string
  first_product_slug: string
  first_product_image: string | null
}

Deno.serve(
  createHandler<ReviewRequestBody>(async (_req, body) => {
    let ordersToProcess: OrderForReview[] = []

    if (body.order_id) {
      // Mode manuel : un seul order_id spécifique
      // On vérifie qu'il est éligible via la fonction RPC
      const { data, error } = await supabase.rpc('get_orders_for_review_request')

      if (error) throw new Error(`RPC error: ${error.message}`)

      // Filtrer pour ne garder que la commande demandée
      ordersToProcess = (data as OrderForReview[])?.filter(
        (o) => o.order_id === body.order_id
      ) || []

      // Si pas trouvé dans les éligibles, vérifier si la commande existe quand même
      if (ordersToProcess.length === 0) {
        const { data: order } = await supabase
          .from('orders_full_view')
          .select('order_id, order_number, shipping_email, shipping_name, user_id, tracking_token, shipped_at')
          .eq('order_id', body.order_id)
          .maybeSingle()

        if (!order) {
          throw new Error('Order not found')
        }

        // Vérifier s'il y a déjà un email de review envoyé
        const { data: existingEmail } = await supabase
          .from('emails_sent')
          .select('id')
          .eq('order_id', body.order_id)
          .eq('type', 'review_request')
          .maybeSingle()

        if (existingEmail) {
          return { success: false, message: 'Review request already sent for this order' }
        }

        // Récupérer le premier produit de la commande
        const { data: firstItem } = await supabase
          .from('order_items')
          .select('product_id, product_name_snapshot, products(id, name, slug, image)')
          .eq('order_id', body.order_id)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle()

        if (!firstItem || !firstItem.products) {
          throw new Error('No products found for this order')
        }

        // Construire manuellement l'objet
        const product = firstItem.products as { id: string; name: string; slug: string; image: string | null }
        ordersToProcess = [{
          order_id: order.order_id,
          order_number: order.order_number,
          email: order.shipping_email,
          full_name: order.shipping_name,
          user_id: order.user_id,
          is_guest: !order.user_id,
          tracking_token: order.tracking_token,
          shipped_at: order.shipped_at,
          first_product_id: product.id,
          first_product_name: firstItem.product_name_snapshot || product.name,
          first_product_slug: product.slug,
          first_product_image: product.image,
        }]
      }
    } else {
      // Mode cron : toutes les commandes éligibles (J+10)
      const { data, error } = await supabase.rpc('get_orders_for_review_request')
      if (error) throw new Error(`RPC error: ${error.message}`)
      ordersToProcess = (data as OrderForReview[]) || []
    }

    if (ordersToProcess.length === 0) {
      return { success: true, processed: 0, message: 'No orders eligible for review request' }
    }

    const results: Array<{ order_id: string; status: string; error?: string }> = []

    for (const order of ordersToProcess) {
      const locale = getValidLocale(body.locale ?? 'fr')
      const t = translations.reviewRequest

      // Générer un token unique pour l'avis (pour identifier la soumission)
      const reviewToken = crypto.randomUUID()

      // Construire l'URL de destination
      // Pour les invités comme pour les membres, on redirige vers la page produit
      // avec les paramètres nécessaires pour ouvrir le formulaire d'avis
      const ctaUrl = `${APP_BASE_URL}/catalogue/${order.first_product_slug}?review_token=${reviewToken}&order=${order.order_id}`

      try {
        const html = renderEmailTemplate('review_request', {
          order_number: order.order_number,
          full_name: order.full_name,
          product_name: order.first_product_name,
          product_image: order.first_product_image,
          product_slug: order.first_product_slug,
          ctaUrl,
          locale,
        })

        const emailSubject = t.subject[locale](order.order_number)

        await sendEmail({
          to: order.email,
          subject: emailSubject,
          html,
          type: 'review_request',
          order_id: order.order_id,
        })

        results.push({ order_id: order.order_id, status: 'sent' })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error(`Failed to send review request for order ${order.order_id}:`, errorMessage)
        results.push({ order_id: order.order_id, status: 'error', error: errorMessage })
      }
    }

    const successCount = results.filter((r) => r.status === 'sent').length
    const errorCount = results.filter((r) => r.status === 'error').length

    return {
      success: true,
      processed: results.length,
      sent: successCount,
      errors: errorCount,
      results,
    }
  })
)
