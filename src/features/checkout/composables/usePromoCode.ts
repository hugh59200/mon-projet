import { ref, computed } from 'vue'
import {
  validatePromoCode,
  applyPromoCode,
  type PromoValidationResult,
  type PromoValidationSuccess,
} from '@/api/supabase/promo'

export function usePromoCode() {
  // State
  const promoCode = ref('')
  const isValidating = ref(false)
  const validationResult = ref<PromoValidationResult | null>(null)
  const hasTriedValidation = ref(false)

  // Computed
  const isValid = computed(() => validationResult.value?.valid === true)

  const discountAmount = computed(() => {
    if (validationResult.value?.valid) {
      return (validationResult.value as PromoValidationSuccess).discount_amount
    }
    return 0
  })

  const promoCodeId = computed(() => {
    if (validationResult.value?.valid) {
      return (validationResult.value as PromoValidationSuccess).promo_code_id
    }
    return null
  })

  const errorMessage = computed(() => {
    if (!hasTriedValidation.value) return ''
    if (validationResult.value && !validationResult.value.valid) {
      return validationResult.value.message
    }
    return ''
  })

  const successMessage = computed(() => {
    if (validationResult.value?.valid) {
      return validationResult.value.message
    }
    return ''
  })

  // Methods
  async function validate(
    subtotal: number,
    userId?: string,
    userEmail?: string,
  ): Promise<boolean> {
    if (!promoCode.value.trim()) {
      validationResult.value = null
      hasTriedValidation.value = false
      return false
    }

    isValidating.value = true
    hasTriedValidation.value = true

    try {
      const result = await validatePromoCode(
        promoCode.value.trim(),
        subtotal,
        userId,
        userEmail,
      )
      validationResult.value = result
      return result.valid
    } catch (err) {
      console.error('[usePromoCode] Validation error:', err)
      validationResult.value = {
        valid: false,
        error: 'NETWORK_ERROR',
        message: 'Erreur de connexion',
      }
      return false
    } finally {
      isValidating.value = false
    }
  }

  async function apply(
    orderId: string,
    userId: string | null,
    userEmail: string,
  ): Promise<boolean> {
    if (!isValid.value || !promoCodeId.value) return false

    try {
      return await applyPromoCode(
        promoCodeId.value,
        orderId,
        userId,
        userEmail,
        discountAmount.value,
      )
    } catch (err) {
      console.error('[usePromoCode] Apply error:', err)
      return false
    }
  }

  function reset() {
    promoCode.value = ''
    validationResult.value = null
    hasTriedValidation.value = false
    isValidating.value = false
  }

  function remove() {
    reset()
  }

  return {
    // State
    promoCode,
    isValidating,
    validationResult,

    // Computed
    isValid,
    discountAmount,
    promoCodeId,
    errorMessage,
    successMessage,

    // Methods
    validate,
    apply,
    reset,
    remove,
  }
}
