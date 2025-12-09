// supabase/functions/check-cart-reminders/index.ts
// Edge Function pour envoyer les rappels doux (2h) sans code promo
// À programmer via cron (ex: toutes les heures)

import { supabase } from '../../utils/clients.ts'
import { createHandler } from '../../utils/createHandler.ts'

interface ReminderCartUser {
  user_id: string
  email: string
  first_name: string | null
  cart_total: number
  last_activity: string
  items_count: number
}

// ============================================================
// CONFIGURATION
// ============================================================

const REMINDER_DELAY_HOURS = 2 // Délai avant rappel doux
const MIN_CART_VALUE = 20 // Valeur minimum du panier

// ============================================================
// HANDLER
// ============================================================

Deno.serve(
  createHandler(async () => {
    console.log('📧 Vérification des paniers pour rappel doux (2h)...')

    // 1. Vérifier si le système est activé
    const { data: settings } = await supabase
      .from('auto_promo_settings')
      .select('setting_value, is_enabled')
      .eq('setting_key', 'cart_reminder')
      .single()

    if (!settings?.is_enabled) {
      console.log('❌ Système de rappel doux désactivé')
      return { success: true, message: 'Cart reminder disabled', processed: 0 }
    }

    const config = settings.setting_value as {
      delay_hours: number
      min_order_amount: number
      cooldown_hours: number
    }

    const delayHours = config.delay_hours || REMINDER_DELAY_HOURS
    const minAmount = config.min_order_amount || MIN_CART_VALUE

    // 2. Trouver les paniers éligibles au rappel
    const cutoffTime = new Date(Date.now() - delayHours * 60 * 60 * 1000).toISOString()

    const { data: eligibleCarts, error: cartsError } = await supabase.rpc('find_carts_for_reminder', {
      p_cutoff_time: cutoffTime,
      p_min_value: minAmount,
    })

    if (cartsError) {
      console.error('Erreur recherche paniers:', cartsError)
      throw cartsError
    }

    if (!eligibleCarts || eligibleCarts.length === 0) {
      console.log('✅ Aucun panier éligible au rappel doux')
      return { success: true, message: 'No carts for reminder', processed: 0 }
    }

    console.log(`📦 ${eligibleCarts.length} panier(s) éligible(s) au rappel`)

    // 3. Traiter chaque panier
    const results = []

    for (const cart of eligibleCarts as ReminderCartUser[]) {
      try {
        // Enregistrer le rappel
        const { data: recordResult, error: recordError } = await supabase.rpc('record_cart_reminder', {
          p_user_id: cart.user_id,
          p_user_email: cart.email,
          p_cart_value: cart.cart_total,
          p_items_count: cart.items_count,
        })

        if (recordError) {
          console.error(`Erreur enregistrement ${cart.email}:`, recordError)
          results.push({ email: cart.email, success: false, reason: recordError.message })
          continue
        }

        if (!recordResult?.success) {
          results.push({ email: cart.email, success: false, reason: recordResult?.reason })
          continue
        }

        // Envoyer l'email de rappel doux
        const { error: emailError } = await supabase.functions.invoke('send-cart-reminder-email', {
          body: {
            user_email: cart.email,
            first_name: cart.first_name,
            cart_value: cart.cart_total,
            items_count: cart.items_count,
          },
        })

        if (emailError) {
          console.error(`Erreur envoi email ${cart.email}:`, emailError)
          results.push({ email: cart.email, success: false, reason: emailError.message })
          continue
        }

        console.log(`✅ Rappel envoyé à ${cart.email}`)
        results.push({ email: cart.email, success: true })
      } catch (err) {
        console.error(`Erreur traitement ${cart.email}:`, err)
        results.push({ email: cart.email, success: false, error: String(err) })
      }
    }

    const successCount = results.filter((r) => r.success).length

    return {
      success: true,
      message: `Processed ${results.length} cart reminders`,
      processed: results.length,
      sent: successCount,
      results,
    }
  }),
)
