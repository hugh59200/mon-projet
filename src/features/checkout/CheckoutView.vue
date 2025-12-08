<template>
  <div class="checkout">
    <!-- Background -->
    <div class="checkout__bg">
      <div class="checkout__bg-gradient"></div>
      <div class="checkout__bg-pattern"></div>
    </div>

    <div class="checkout__container">
      <!-- Header -->
      <header class="checkout__header">
        <PremiumButton
          type="secondary"
          variant="ghost"
          size="sm"
          :label="t('cart.continueShopping')"
          icon-left="ArrowLeft"
          class="checkout__back"
          @click="$router.push('/catalogue')"
        />

        <div class="checkout__secure-badge">
          <BasicIconNext name="ShieldCheck" :size="16" />
          <span>{{ t('checkout.payment.securePayment') }}</span>
        </div>
      </header>

      <!-- Progress Steps -->
      <CheckoutProgress :current-step="currentStep" />

      <!-- Main Content -->
      <div class="checkout__content">
        <!-- Left Column -->
        <div class="checkout__main">
          <!-- Cart Section -->
          <CheckoutCartSection
            :items="cart.items"
            @remove="cart.removeFromCart"
            @update-quantity="handleUpdateQuantity"
          />

          <!-- Shipping Section -->
          <CheckoutShippingSection
            v-model:delivery-mode="deliveryMode"
            v-model:selected-relay="selectedRelay"
            v-model:use-profile-address="useProfileAddress"
            v-model:email="email"
            v-model:full-name="fullName"
            v-model:address="address"
            v-model:zip="zip"
            v-model:city="city"
            v-model:country="country"
            :brand-id="MONDIAL_RELAY_BRAND_ID"
            :is-logged-in="!!auth.user"
            :country-items="countryItems"
            :errors="displayErrors"
            :subtotal="cartSubtotal"
            :free-shipping-threshold="FREE_SHIPPING_THRESHOLD"
            :shipping-rate="FLAT_SHIPPING_RATE"
            @relay-select="handleRelaySelect"
            @relay-order-data="handleRelayOrderData"
            @relay-error="handleRelayError"
            @address-fill="onAddressFill"
            @field-blur="onFieldBlur"
          />

          <!-- Payment Section -->
          <CheckoutPaymentSection v-model="selectedPayment" />
        </div>

        <!-- Right Column - Order Summary -->
        <div class="checkout__sidebar">
          <!-- Upsell AOV -->
          <CheckoutUpsell />

          <CheckoutSummary
          :subtotal="cartSubtotal"
          :shipping-cost="shippingCost"
          :total="finalTotal"
          :delivery-mode="deliveryMode"
          :selected-relay-name="selectedRelay?.name"
          :free-shipping-threshold="FREE_SHIPPING_THRESHOLD"
          v-model:promo-code="promo.promoCode.value"
          :promo-valid="promo.isValid.value"
          :promo-validating="promo.isValidating.value"
          :promo-error="promo.errorMessage.value"
          :promo-discount="promo.discountAmount.value"
          v-model:disclaimer-accepted="disclaimerAccepted"
          :can-submit="canSubmit"
          :is-submitting="isSubmitting"
          @validate-promo="handleValidatePromo"
          @remove-promo="promo.remove()"
          @submit="submitOrder"
        />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
import { trackCheckoutStart, trackOrderComplete } from '@/features/tracking/services/sessionTracker'
import { createOrder, invokeOrderConfirmation } from '@/api/supabase/orders'
import type { CartView } from '@/supabase/types/supabase.types'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { computed, onMounted, ref, watch, watchEffect, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { OrderRelayData, RelayPoint } from '@/features/livraison/mondial-relay/relay'
// import { formatPostalCode } from '@/composables/validation/formatters'
import { COUNTRY_CONFIGS } from '@/composables/validation/validators'
import type { SupportedCountry } from '@/composables/validation/types'
import { usePromoCode } from './composables/usePromoCode'

// Sub-components
import CheckoutProgress from './components/CheckoutProgress.vue'
import CheckoutCartSection from './components/CheckoutCartSection.vue'
import CheckoutShippingSection from './components/CheckoutShippingSection.vue'
import CheckoutPaymentSection from './components/CheckoutPaymentSection.vue'
import CheckoutSummary from './components/CheckoutSummary.vue'
import CheckoutUpsell from './components/CheckoutUpsell.vue'

// Types
type ManualPaymentMethod = 'bank_transfer' | 'crypto'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const toast = useToastStore()
const promo = usePromoCode()

// State
const currentStep = ref(2)
const isSubmitting = ref(false)
const useProfileAddress = ref(true)
const selectedPayment = ref<ManualPaymentMethod>('crypto')
const disclaimerAccepted = ref(false)
const isRestoringFromStorage = ref(false)

// Countries whitelist
const ALLOWED_COUNTRIES = [
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱' },
]

const countryItems = ALLOWED_COUNTRIES.map((c) => ({
  id: c.name,
  label: `${c.flag} ${c.name}`,
}))

// Mondial Relay state
const deliveryMode = ref<'relay' | 'home'>('relay')
const selectedRelay = ref<RelayPoint | null>(null)
const relayOrderData = ref<OrderRelayData | null>(null)
const MONDIAL_RELAY_BRAND_ID = 'BDTEST'

// Form fields
const email = ref('')
const fullName = ref('')
const address = ref('')
const zip = ref('')
const city = ref('')
const country = ref('France')

// Validation errors
const errors = reactive({
  email: '',
  fullName: '',
  address: '',
  zip: '',
  city: '',
})

const touched = reactive({
  email: false,
  fullName: false,
  address: false,
  zip: false,
  city: false,
})

// Constants
const FREE_SHIPPING_THRESHOLD = 100
const FLAT_SHIPPING_RATE = 9.9

// Validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

const COUNTRY_CODE_MAP: Record<string, SupportedCountry> = {
  'France': 'FR',
  'Belgique': 'BE',
  'Espagne': 'ES',
  'Italie': 'IT',
  'Luxembourg': 'LU',
  'Pays-Bas': 'NL',
}

// Validation functions
function validateEmail(value: string): string {
  if (!value.trim()) return 'Email requis'
  if (!EMAIL_REGEX.test(value.trim())) return 'Email invalide'
  return ''
}

function validateFullName(value: string): string {
  if (!value.trim()) return 'Nom requis'
  if (value.trim().length < 3) return 'Minimum 3 caractères'
  if (!/^[\p{L}\s'-]+$/u.test(value.trim())) return 'Caractères invalides'
  return ''
}

function validateAddress(value: string): string {
  if (!value.trim()) return 'Adresse requise'
  if (value.trim().length < 5) return 'Adresse trop courte'
  return ''
}

function validateZip(value: string, countryName: string): string {
  if (!value.trim()) return 'Code postal requis'
  const countryCode = COUNTRY_CODE_MAP[countryName] || 'FR'
  const config = COUNTRY_CONFIGS[countryCode]
  if (config && !config.postalCodeRegex.test(value.trim())) {
    return `Format: ${config.postalCodeExample}`
  }
  return ''
}

function validateCity(value: string): string {
  if (!value.trim()) return 'Ville requise'
  if (value.trim().length < 2) return 'Ville trop courte'
  return ''
}

// Display errors only when touched
const displayErrors = computed(() => ({
  email: touched.email ? errors.email : '',
  fullName: touched.fullName ? errors.fullName : '',
  address: touched.address ? errors.address : '',
  zip: touched.zip ? errors.zip : '',
  city: touched.city ? errors.city : '',
}))

// Event handlers
function onFieldBlur(field: keyof typeof touched) {
  touched[field] = true
  switch (field) {
    case 'email':
      errors.email = validateEmail(email.value)
      break
    case 'fullName':
      errors.fullName = validateFullName(fullName.value)
      break
    case 'address':
      errors.address = validateAddress(address.value)
      break
    case 'zip':
      errors.zip = validateZip(zip.value, country.value)
      break
    case 'city':
      errors.city = validateCity(city.value)
      break
  }
}

function onAddressFill(data: { address: string; city: string; postcode: string }) {
  address.value = data.address
  city.value = data.city
  zip.value = data.postcode
  touched.address = true
  touched.city = true
  touched.zip = true
  errors.address = validateAddress(data.address)
  errors.city = validateCity(data.city)
  errors.zip = validateZip(data.postcode, country.value)
}

function handleUpdateQuantity(item: CartView, delta: number) {
  const newQty = (item.quantity ?? 1) + delta
  if (newQty >= 1 && item.product_id) {
    cart.updateQuantity(item.product_id, newQty)
  }
}

function handleRelaySelect(point: RelayPoint) {
  selectedRelay.value = point
  toast.show(`Point relais sélectionné : ${point.name}`, 'success')
}

function handleRelayOrderData(data: OrderRelayData) {
  relayOrderData.value = data
}

function handleRelayError(message: string) {
  toast.show(message, 'danger')
}

// Validate full form
function validateForm(): boolean {
  errors.email = validateEmail(email.value)
  errors.fullName = validateFullName(fullName.value)

  if (deliveryMode.value === 'home') {
    errors.address = validateAddress(address.value)
    errors.zip = validateZip(zip.value, country.value)
    errors.city = validateCity(city.value)
  } else {
    errors.address = ''
    errors.zip = ''
    errors.city = ''
  }

  Object.keys(touched).forEach(key => {
    touched[key as keyof typeof touched] = true
  })

  return !errors.email && !errors.fullName &&
    (deliveryMode.value === 'relay' || (!errors.address && !errors.zip && !errors.city))
}

// Computed
const cartSubtotal = computed(() => cart.totalPrice)

const shippingCost = computed(() => {
  if (deliveryMode.value === 'relay') return 0
  return cartSubtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE
})

const finalTotal = computed(() =>
  cartSubtotal.value + shippingCost.value - promo.discountAmount.value,
)

const canSubmit = computed(() => {
  if (cart.items.length === 0) return false
  if (isSubmitting.value) return false
  if (!disclaimerAccepted.value) return false
  if (!email.value.trim() || !fullName.value.trim()) return false
  if (validateEmail(email.value)) return false
  if (validateFullName(fullName.value)) return false

  if (deliveryMode.value === 'relay') {
    return selectedRelay.value !== null
  } else {
    if (!address.value.trim() || !zip.value.trim() || !city.value.trim()) return false
    if (validateAddress(address.value)) return false
    if (validateZip(zip.value, country.value)) return false
    if (validateCity(city.value)) return false
    return true
  }
})

// Promo code
async function handleValidatePromo() {
  if (!promo.promoCode.value.trim()) return

  const isValid = await promo.validate(
    cartSubtotal.value,
    auth.user?.id,
    email.value || auth.user?.email,
  )

  if (isValid) {
    toast.show(promo.successMessage.value, 'success')
  }
}

// Profile filling
function fillFromProfile() {
  if (!auth.user || !auth.profile) return
  email.value = auth.user.email || ''
  fullName.value = auth.profile.full_name || ''
  if (useProfileAddress.value && deliveryMode.value === 'home') {
    address.value = auth.profile.address || ''
    zip.value = auth.profile.zip || ''
    city.value = auth.profile.city || ''
    country.value = auth.profile.country || 'France'
  }
}

// Reset relay when switching mode
watch(deliveryMode, (mode) => {
  if (mode === 'home') {
    selectedRelay.value = null
    relayOrderData.value = null
  }
})

watch(useProfileAddress, (isUsing) => {
  if (isRestoringFromStorage.value) return
  if (isUsing) {
    fillFromProfile()
    toast.show('Adresse du profil chargée', 'info')
  } else {
    address.value = ''
    zip.value = ''
    city.value = ''
    country.value = 'France'
  }
})

// Lifecycle
onMounted(() => {
  // Tracker le début du checkout
  trackCheckoutStart()

  const saved = sessionStorage.getItem('fp-checkout-form')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      isRestoringFromStorage.value = true

      const savedUseProfileAddress = typeof data.useProfileAddress === 'boolean'
        ? data.useProfileAddress
        : true
      useProfileAddress.value = savedUseProfileAddress

      if (!auth.user || !savedUseProfileAddress) {
        email.value = data.email || ''
        fullName.value = data.fullName || ''
        address.value = data.address || ''
        zip.value = data.zip || ''
        city.value = data.city || ''
        country.value = data.country || 'France'
      }

      if (data.deliveryMode) deliveryMode.value = data.deliveryMode
      if (data.selectedPayment) selectedPayment.value = data.selectedPayment
      if (data.disclaimerAccepted === true) disclaimerAccepted.value = true
      if (data.selectedRelay) selectedRelay.value = data.selectedRelay
      if (data.relayOrderData) relayOrderData.value = data.relayOrderData

      setTimeout(() => {
        isRestoringFromStorage.value = false
      }, 0)
    } catch {
      isRestoringFromStorage.value = false
    }
  }
  if (auth.user && useProfileAddress.value) {
    fillFromProfile()
  }
})

watchEffect(() => {
  if (isRestoringFromStorage.value) return
  if (auth.user && useProfileAddress.value) {
    fillFromProfile()
  }
})

// Save form to sessionStorage
watch(
  [email, fullName, address, zip, city, country, deliveryMode, selectedPayment, disclaimerAccepted, useProfileAddress, selectedRelay, relayOrderData],
  () => {
    sessionStorage.setItem(
      'fp-checkout-form',
      JSON.stringify({
        email: email.value,
        fullName: fullName.value,
        address: address.value,
        zip: zip.value,
        city: city.value,
        country: country.value,
        deliveryMode: deliveryMode.value,
        selectedPayment: selectedPayment.value,
        disclaimerAccepted: disclaimerAccepted.value,
        useProfileAddress: useProfileAddress.value,
        selectedRelay: selectedRelay.value,
        relayOrderData: relayOrderData.value,
      }),
    )
  },
  { deep: true },
)

// Submit order
async function submitOrder() {
  if (isSubmitting.value || !canSubmit.value) return

  if (!validateForm()) {
    toast.show('Veuillez corriger les erreurs du formulaire', 'warning')
    return
  }

  isSubmitting.value = true

  try {
    currentStep.value = 3

    const orderItemsPayload = cart.items.map((item) => ({
      product_id: item.product_id!,
      quantity: item.quantity ?? 1,
      product_price: item.is_on_sale
        ? (item.product_sale_price ?? 0)
        : (item.product_price ?? 0),
    }))

    const orderPayload: any = {
      userId: auth.user?.id ?? null,
      email: email.value,
      fullName: fullName.value,
      address: deliveryMode.value === 'home' ? address.value : '',
      zip: deliveryMode.value === 'home' ? zip.value : '',
      city: deliveryMode.value === 'home' ? city.value : '',
      country: deliveryMode.value === 'home' ? country.value : 'France',
      paymentMethod: selectedPayment.value,
      subtotal: cartSubtotal.value,
      shippingCost: shippingCost.value,
      taxAmount: 0,
      discountAmount: promo.discountAmount.value,
      totalAmount: finalTotal.value,
      items: orderItemsPayload,
      promoCodeId: promo.promoCodeId.value,
      promoCodeSnapshot: promo.isValid.value ? promo.promoCode.value.toUpperCase() : null,
    }

    if (deliveryMode.value === 'relay' && relayOrderData.value) {
      orderPayload.relayId = relayOrderData.value.relay_id
      orderPayload.relayName = relayOrderData.value.relay_name
      orderPayload.relayAddress = relayOrderData.value.relay_address
      orderPayload.relayZipcode = relayOrderData.value.relay_zipcode
      orderPayload.relayCity = relayOrderData.value.relay_city
      orderPayload.relayCountry = relayOrderData.value.relay_country
    }

    const orderResponse = await createOrder(orderPayload)

    if (promo.isValid.value && promo.promoCodeId.value) {
      promo.apply(
        orderResponse.order_id,
        auth.user?.id ?? null,
        email.value,
      ).catch((err) => {
        console.warn('Erreur application code promo (non bloquant):', err)
      })
    }

    invokeOrderConfirmation(orderResponse.order_id).catch((err) => {
      console.warn('Erreur envoi email confirmation (non bloquant):', err)
    })

    if (orderResponse.tracking_token) {
      localStorage.setItem('fp-last-order-token', orderResponse.tracking_token)
    }
    localStorage.setItem('fp-last-order-id', orderResponse.order_id)
    localStorage.setItem('fp-last-payment-method', selectedPayment.value)
    localStorage.setItem('fp-last-order-total', finalTotal.value.toString())

    sessionStorage.removeItem('fp-checkout-form')
    cart.clearCart()

    // Tracker la commande complétée
    trackOrderComplete()

    router.push({
      path: '/checkout/confirmation',
      query: {
        orderId: orderResponse.order_id,
        method: selectedPayment.value,
      },
    })
  } catch (err: any) {
    console.error(err)
    toast.show(`Erreur : ${err.message || 'Impossible de créer la commande'}`, 'danger')
    currentStep.value = 2
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="less">
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.checkout {
  position: relative;
  min-height: 100vh;
  background: @neutral-50;

  // Background
  &__bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  &__bg-gradient {
    position: absolute;
    top: 0;
    right: 0;
    width: 60%;
    height: 60%;
    background: radial-gradient(
      ellipse at top right,
      rgba(var(--primary-500-rgb), 0.06) 0%,
      transparent 60%
    );
  }

  &__bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: linear-gradient(to bottom, black 0%, transparent 50%);
  }

  // Container
  &__container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 32px 80px;
  }

  // Header
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: white;
    border: 1px solid @neutral-200;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-700;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: @neutral-50;
      border-color: var(--primary-300);
      color: var(--primary-700);
      transform: translateX(-4px);
    }
  }

  &__secure-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: linear-gradient(
      135deg,
      rgba(var(--success-500-rgb), 0.1) 0%,
      rgba(var(--success-500-rgb), 0.05) 100%
    );
    border: 1px solid rgba(var(--success-500-rgb), 0.2);
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    color: @success-600;

    svg {
      color: @success-500;
    }
  }

  // Content layout
  &__content {
    display: grid;
    grid-template-columns: 1fr minmax(320px, 400px);
    gap: 32px;
    align-items: start;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

// Responsive
.respond-tablet({
  .checkout {
    &__content {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
});

.respond-mobile({
  .checkout {
    &__container {
      padding: 16px;
      padding-bottom: 100px;
    }

    &__header {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
      margin-bottom: 20px;
    }

    &__back {
      justify-content: center;
    }
  }
});
</style>
