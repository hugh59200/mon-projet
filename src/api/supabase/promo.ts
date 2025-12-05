import { supabaseUntyped as supabase } from '@/supabase/supabaseClient'

// ============================================================
// TYPES
// ============================================================

export type PromoCodeDiscountType = 'percentage' | 'fixed'

export interface PromoCode {
  id: string
  code: string
  description: string | null
  discount_type: PromoCodeDiscountType
  discount_value: number
  min_order_amount: number
  max_discount_amount: number | null
  max_uses: number | null
  max_uses_per_user: number | null
  current_uses: number
  valid_from: string | null
  valid_until: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface PromoValidationSuccess {
  valid: true
  promo_code_id: string
  code: string
  discount_type: PromoCodeDiscountType
  discount_value: number
  discount_amount: number
  message: string
}

export interface PromoValidationError {
  valid: false
  error: string
  message: string
  min_amount?: number
}

export type PromoValidationResult = PromoValidationSuccess | PromoValidationError

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Valide un code promo et retourne le montant de remise calculé
 */
export async function validatePromoCode(
  code: string,
  subtotal: number,
  userId?: string,
  userEmail?: string,
): Promise<PromoValidationResult> {
  const { data, error } = await supabase.rpc('validate_promo_code', {
    p_code: code,
    p_subtotal: subtotal,
    p_user_id: userId ?? null,
    p_user_email: userEmail ?? null,
  })

  if (error) {
    console.error('[validatePromoCode] Error:', error)
    return {
      valid: false,
      error: 'RPC_ERROR',
      message: 'Erreur lors de la validation du code',
    }
  }

  return data as PromoValidationResult
}

/**
 * Applique un code promo après création de commande
 * (incrémente le compteur et enregistre l'utilisation)
 */
export async function applyPromoCode(
  promoCodeId: string,
  orderId: string,
  userId: string | null,
  userEmail: string,
  discountApplied: number,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('apply_promo_code', {
    p_promo_code_id: promoCodeId,
    p_order_id: orderId,
    p_user_id: userId,
    p_user_email: userEmail,
    p_discount_applied: discountApplied,
  })

  if (error) {
    console.error('[applyPromoCode] Error:', error)
    return false
  }

  return data === true
}

// ============================================================
// ADMIN FUNCTIONS
// ============================================================

export async function fetchPromoCodes(): Promise<PromoCode[]> {
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[fetchPromoCodes] Error:', error)
    throw error
  }

  return data as PromoCode[]
}

export async function createPromoCode(
  payload: Omit<PromoCode, 'id' | 'current_uses' | 'created_at' | 'updated_at'>,
): Promise<PromoCode> {
  const { data, error } = await supabase.from('promo_codes').insert(payload).select().single()

  if (error) {
    console.error('[createPromoCode] Error:', error)
    throw error
  }

  return data as PromoCode
}

export async function updatePromoCode(
  id: string,
  payload: Partial<Omit<PromoCode, 'id' | 'current_uses' | 'created_at'>>,
): Promise<void> {
  const { error } = await supabase
    .from('promo_codes')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('[updatePromoCode] Error:', error)
    throw error
  }
}

export async function deletePromoCode(id: string): Promise<void> {
  const { error } = await supabase.from('promo_codes').delete().eq('id', id)

  if (error) {
    console.error('[deletePromoCode] Error:', error)
    throw error
  }
}

export async function togglePromoCodeActive(id: string, active: boolean): Promise<void> {
  await updatePromoCode(id, { active })
}
