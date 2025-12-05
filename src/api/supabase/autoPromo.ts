import { supabaseUntyped as supabase } from '@/supabase/supabaseClient'

// ============================================================
// TYPES
// ============================================================

export interface AutoPromoResult {
  success: boolean
  code?: string
  promo_code_id?: string
  discount_type?: 'percentage' | 'fixed'
  discount_value?: number
  expires_at?: string
  reason?: string
  // Pour fidélité
  reward_level?: number
  orders_count?: number
}

export interface AutoPromoSettings {
  id: string
  setting_key: string
  setting_value: {
    discount_type: 'percentage' | 'fixed'
    discount_value: number
    min_order_amount?: number
    expires_days?: number
    orders_threshold?: number
    delay_hours?: number
    email_subject?: string
  }
  is_enabled: boolean
}

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Génère un code de bienvenue pour un nouvel utilisateur
 */
export async function createWelcomePromo(
  userId: string,
  userEmail: string,
): Promise<AutoPromoResult> {
  const { data, error } = await supabase.rpc('create_welcome_promo', {
    p_user_id: userId,
    p_user_email: userEmail,
  })

  if (error) {
    console.error('[createWelcomePromo] Error:', error)
    return { success: false, reason: error.message }
  }

  const result = data as AutoPromoResult

  // Si succès, envoyer l'email
  if (result.success && result.code) {
    sendPromoEmail('welcome', userEmail, result).catch(console.error)
  }

  return result
}

/**
 * Vérifie et attribue un code de fidélité
 */
export async function checkLoyaltyReward(
  userId: string,
  userEmail: string,
): Promise<AutoPromoResult> {
  const { data, error } = await supabase.rpc('check_loyalty_reward', {
    p_user_id: userId,
    p_user_email: userEmail,
  })

  if (error) {
    console.error('[checkLoyaltyReward] Error:', error)
    return { success: false, reason: error.message }
  }

  const result = data as AutoPromoResult

  // Si succès, envoyer l'email
  if (result.success && result.code) {
    sendPromoEmail('loyalty', userEmail, result).catch(console.error)
  }

  return result
}

/**
 * Crée un code pour panier abandonné
 */
export async function createCartAbandonmentPromo(
  userId: string | null,
  userEmail: string,
  cartValue: number,
): Promise<AutoPromoResult> {
  const { data, error } = await supabase.rpc('create_cart_abandonment_promo', {
    p_user_id: userId,
    p_user_email: userEmail,
    p_cart_value: cartValue,
  })

  if (error) {
    console.error('[createCartAbandonmentPromo] Error:', error)
    return { success: false, reason: error.message }
  }

  const result = data as AutoPromoResult

  // Si succès, envoyer l'email
  if (result.success && result.code) {
    sendPromoEmail('cart_abandonment', userEmail, {
      ...result,
      cart_value: cartValue,
    }).catch(console.error)
  }

  return result
}

/**
 * Envoie l'email de code promo via Edge Function
 */
async function sendPromoEmail(
  type: 'welcome' | 'loyalty' | 'cart_abandonment',
  userEmail: string,
  promoData: AutoPromoResult & { cart_value?: number },
): Promise<void> {
  try {
    await supabase.functions.invoke('send-promo-email', {
      body: {
        type,
        user_email: userEmail,
        promo_code: promoData.code,
        discount_type: promoData.discount_type,
        discount_value: promoData.discount_value,
        expires_at: promoData.expires_at,
        reward_level: promoData.reward_level,
        orders_count: promoData.orders_count,
        cart_value: promoData.cart_value,
      },
    })
  } catch (err) {
    console.error('[sendPromoEmail] Error:', err)
  }
}

// ============================================================
// ADMIN FUNCTIONS
// ============================================================

/**
 * Récupère les paramètres des codes automatiques
 */
export async function fetchAutoPromoSettings(): Promise<AutoPromoSettings[]> {
  const { data, error } = await supabase
    .from('auto_promo_settings')
    .select('*')
    .order('setting_key')

  if (error) {
    console.error('[fetchAutoPromoSettings] Error:', error)
    throw error
  }

  return data as AutoPromoSettings[]
}

/**
 * Met à jour un paramètre de code automatique
 */
export async function updateAutoPromoSetting(
  settingKey: string,
  settingValue: AutoPromoSettings['setting_value'],
  isEnabled: boolean,
): Promise<void> {
  const { error } = await supabase
    .from('auto_promo_settings')
    .update({
      setting_value: settingValue,
      is_enabled: isEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq('setting_key', settingKey)

  if (error) {
    console.error('[updateAutoPromoSetting] Error:', error)
    throw error
  }
}

/**
 * Récupère les récompenses promo d'un utilisateur
 */
export async function fetchUserPromoRewards(userId: string) {
  const { data, error } = await supabase
    .from('user_promo_rewards')
    .select(`
      *,
      promo_codes (
        code,
        discount_type,
        discount_value,
        valid_until,
        active
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[fetchUserPromoRewards] Error:', error)
    throw error
  }

  return data
}
