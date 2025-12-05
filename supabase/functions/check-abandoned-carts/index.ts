// supabase/functions/check-abandoned-carts/index.ts
// Edge Function pour détecter et traiter les paniers abandonnés
// À programmer via cron (ex: toutes les 6 heures)

import { supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'
import { sendEmail } from '../../utils/sendEmail.ts'

interface AbandonedCartUser {
  user_id: string
  email: string
  cart_total: number
  last_activity: string
  items_count: number
}

// ============================================================
// CONFIGURATION
// ============================================================

const ABANDONMENT_DELAY_HOURS = 24 // Délai avant de considérer un panier comme abandonné
const MIN_CART_VALUE = 30 // Valeur minimum du panier pour envoyer un code

// ============================================================
// HANDLER
// ============================================================

Deno.serve(
  createHandler(async () => {
    console.log('🛒 Vérification des paniers abandonnés...')

    // 1. Vérifier si le système est activé
    const { data: settings } = await supabase
      .from('auto_promo_settings')
      .select('setting_value, is_enabled')
      .eq('setting_key', 'cart_abandonment')
      .single()

    if (!settings?.is_enabled) {
      console.log('❌ Système d\'abandon de panier désactivé')
      return { success: true, message: 'Cart abandonment disabled', processed: 0 }
    }

    const config = settings.setting_value as {
      delay_hours: number
      min_order_amount: number
    }

    const delayHours = config.delay_hours || ABANDONMENT_DELAY_HOURS
    const minAmount = config.min_order_amount || MIN_CART_VALUE

    // 2. Trouver les paniers abandonnés
    // Paniers avec items, mis à jour il y a plus de X heures, sans commande récente
    const cutoffTime = new Date(Date.now() - delayHours * 60 * 60 * 1000).toISOString()

    const { data: abandonedCarts, error: cartsError } = await supabase
      .rpc('find_abandoned_carts', {
        p_cutoff_time: cutoffTime,
        p_min_value: minAmount,
      })

    if (cartsError) {
      console.error('❌ Erreur recherche paniers:', cartsError)
      throw cartsError
    }

    if (!abandonedCarts || abandonedCarts.length === 0) {
      console.log('✅ Aucun panier abandonné trouvé')
      return { success: true, message: 'No abandoned carts', processed: 0 }
    }

    console.log(`📦 ${abandonedCarts.length} panier(s) abandonné(s) trouvé(s)`)

    // 3. Traiter chaque panier abandonné
    const results = []

    for (const cart of abandonedCarts as AbandonedCartUser[]) {
      try {
        // Créer le code promo
        const { data: promoResult } = await supabase.rpc('create_cart_abandonment_promo', {
          p_user_id: cart.user_id,
          p_user_email: cart.email,
          p_cart_value: cart.cart_total,
        })

        if (!promoResult?.success) {
          console.log(`⏭️ Skip ${cart.email}: ${promoResult?.reason}`)
          results.push({ email: cart.email, success: false, reason: promoResult?.reason })
          continue
        }

        // Envoyer l'email
        await supabase.functions.invoke('send-promo-email', {
          body: {
            type: 'cart_abandonment',
            user_email: cart.email,
            promo_code: promoResult.code,
            discount_type: promoResult.discount_type,
            discount_value: promoResult.discount_value,
            expires_at: promoResult.expires_at,
            cart_value: cart.cart_total,
          },
        })

        console.log(`✅ Email envoyé à ${cart.email} avec code ${promoResult.code}`)
        results.push({ email: cart.email, success: true, code: promoResult.code })
      } catch (err) {
        console.error(`❌ Erreur traitement ${cart.email}:`, err)
        results.push({ email: cart.email, success: false, error: String(err) })
      }
    }

    const successCount = results.filter((r) => r.success).length

    return {
      success: true,
      message: `Processed ${results.length} abandoned carts`,
      processed: results.length,
      sent: successCount,
      results,
    }
  }),
)
