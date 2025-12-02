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
        <button
          class="checkout__back"
          @click="$router.push('/catalogue')"
        >
          <BasicIconNext name="ArrowLeft" :size="20" />
          <span>{{ t('cart.continueShopping') }}</span>
        </button>

        <div class="checkout__secure-badge">
          <BasicIconNext name="ShieldCheck" :size="16" />
          <span>{{ t('checkout.payment.securePayment') }}</span>
        </div>
      </header>

      <!-- Progress Steps -->
      <div class="checkout__steps">
        <div
          class="checkout__step"
          :class="{
            'checkout__step--active': currentStep >= 1,
            'checkout__step--done': currentStep > 1,
          }"
        >
          <div class="checkout__step-number">
            <BasicIconNext v-if="currentStep > 1" name="Check" :size="14" :stroke-width="3" />
            <span v-else>1</span>
          </div>
          <span class="checkout__step-label">{{ t('checkout.steps.cart') }}</span>
        </div>
        <div
          class="checkout__step-line"
          :class="{ 'checkout__step-line--active': currentStep > 1 }"
        ></div>
        <div
          class="checkout__step"
          :class="{
            'checkout__step--active': currentStep >= 2,
            'checkout__step--done': currentStep > 2,
          }"
        >
          <div class="checkout__step-number">
            <BasicIconNext v-if="currentStep > 2" name="Check" :size="14" :stroke-width="3" />
            <span v-else>2</span>
          </div>
          <span class="checkout__step-label">{{ t('checkout.steps.shipping') }}</span>
        </div>
        <div
          class="checkout__step-line"
          :class="{ 'checkout__step-line--active': currentStep > 2 }"
        ></div>
        <div
          class="checkout__step"
          :class="{ 'checkout__step--active': currentStep >= 3 }"
        >
          <div class="checkout__step-number">3</div>
          <span class="checkout__step-label">{{ t('checkout.steps.payment') }}</span>
        </div>
      </div>

      <!-- Main Content -->
      <div class="checkout__content">
        <!-- Left Column -->
        <div class="checkout__main">
          <!-- Cart Summary -->
          <section class="checkout__section">
            <div class="checkout__section-header">
              <div class="checkout__section-icon">
                <BasicIconNext name="ShoppingCart" :size="20" />
              </div>
              <div>
                <h2 class="checkout__section-title">{{ t('cart.title') }}</h2>
                <p class="checkout__section-subtitle">
                  {{ cart.items.length }} {{ cart.items.length > 1 ? t('cart.items') : t('cart.item') }}
                </p>
              </div>
            </div>

            <div class="checkout__items">
              <div
                v-for="item in cart.items"
                class="checkout-item"
              >
                <div class="checkout-item__image">
                  <img
                    :src="item.product_image || defaultImage"
                    :alt="item.product_name!"
                  />
                  <span
                    v-if="item.is_on_sale"
                    class="checkout-item__badge"
                  >
                    -{{
                      Math.round(
                        (1 - (item.product_sale_price ?? 0) / (item.product_price ?? 1)) * 100,
                      )
                    }}%
                  </span>
                </div>

                <div class="checkout-item__details">
                  <div class="checkout-item__top">
                    <div>
                      <h3 class="checkout-item__name">{{ item.product_name }}</h3>
                      <p
                        v-if="item.product_dosage"
                        class="checkout-item__dosage"
                      >
                        {{ item.product_dosage }}
                      </p>
                    </div>
                    <button
                      class="checkout-item__remove"
                      @click="cart.removeFromCart(item.product_id!)"
                      title="Supprimer"
                    >
                      <BasicIconNext name="X" :size="18" />
                    </button>
                  </div>

                  <div class="checkout-item__bottom">
                    <div class="checkout-item__quantity">
                      <button
                        class="checkout-item__qty-btn"
                        @click="updateQuantity(item, -1)"
                        :disabled="(item.quantity ?? 1) <= 1"
                      >
                        <BasicIconNext name="Minus" :size="14" />
                      </button>
                      <span class="checkout-item__qty-value">{{ item.quantity ?? 1 }}</span>
                      <button
                        class="checkout-item__qty-btn"
                        @click="updateQuantity(item, 1)"
                      >
                        <BasicIconNext name="Plus" :size="14" />
                      </button>
                    </div>

                    <div class="checkout-item__price">
                      <span
                        v-if="item.is_on_sale"
                        class="checkout-item__price-old"
                      >
                        {{ formatPrice((item.product_price ?? 0) * (item.quantity ?? 1)) }}
                      </span>
                      <span
                        class="checkout-item__price-current"
                        :class="{ 'checkout-item__price-current--sale': item.is_on_sale }"
                      >
                        {{ formatPrice(getLineTotal(item)) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div
                v-if="cart.items.length === 0"
                class="checkout__empty"
              >
                <div class="checkout__empty-icon">
                  <BasicIconNext name="ShoppingCart" :size="48" />
                </div>
                <h3>{{ t('cart.empty') }}</h3>
                <p>{{ t('cart.emptyText') }}</p>
                <button
                  class="checkout__empty-btn"
                  @click="$router.push('/catalogue')"
                >
                  {{ t('catalogue.title') }}
                </button>
              </div>
            </div>
          </section>
          <!-- Shipping Info - NOUVELLE VERSION AVEC MONDIAL RELAY -->
          <section class="checkout__section">
            <div class="checkout__section-header">
              <div class="checkout__section-icon">
                <BasicIconNext name="Truck" :size="20" />
              </div>
              <div>
                <h2 class="checkout__section-title">{{ t('checkout.steps.shipping') }}</h2>
                <p class="checkout__section-subtitle">{{ t('checkout.shipping.whereToDeliver') }}</p>
              </div>
            </div>

            <!-- Mode de livraison -->
            <div class="checkout__delivery-mode">
              <button
                class="checkout__delivery-option"
                :class="{ 'checkout__delivery-option--active': deliveryMode === 'relay' }"
                @click="deliveryMode = 'relay'"
                type="button"
              >
                <div class="checkout__delivery-radio">
                  <div class="checkout__delivery-radio-inner"></div>
                </div>
                <div class="checkout__delivery-icon checkout__delivery-icon--relay">
                  <BasicIconNext name="MapPin" :size="24" />
                </div>
                <div class="checkout__delivery-content">
                  <span class="checkout__delivery-title">{{ t('checkout.shipping.relay') }}</span>
                  <span class="checkout__delivery-desc">Mondial Relay • 48-72h</span>
                </div>
                <div class="checkout__delivery-price checkout__delivery-price--free">{{ t('cart.freeShipping') }}</div>
              </button>

              <button
                class="checkout__delivery-option"
                :class="{ 'checkout__delivery-option--active': deliveryMode === 'home' }"
                @click="deliveryMode = 'home'"
                type="button"
              >
                <div class="checkout__delivery-radio">
                  <div class="checkout__delivery-radio-inner"></div>
                </div>
                <div class="checkout__delivery-icon checkout__delivery-icon--home">
                  <BasicIconNext name="Home" :size="24" />
                </div>
                <div class="checkout__delivery-content">
                  <span class="checkout__delivery-title">{{ t('checkout.shipping.home') }}</span>
                  <span class="checkout__delivery-desc">Colissimo • 48-72h</span>
                </div>
                <div class="checkout__delivery-price">
                  {{
                    cartSubtotal >= FREE_SHIPPING_THRESHOLD
                      ? t('cart.freeShipping')
                      : formatPrice(FLAT_SHIPPING_RATE)
                  }}
                </div>
              </button>
            </div>

            <!-- Sélecteur Point Relais Mondial Relay -->
            <div
              v-if="deliveryMode === 'relay'"
              class="checkout__relay-section"
            >
              <RelaySelector
                v-model="selectedRelay"
                :brand-id="MONDIAL_RELAY_BRAND_ID"
                :default-postcode="zip"
                default-country="FR"
                :nb-results="10"
                :allow-geolocate="true"
                button-label="📍 Choisir mon point relais"
                @select="handleRelaySelect"
                @order-data="handleRelayOrderData"
                @error="handleRelayError"
              />
            </div>

            <!-- Formulaire adresse (pour domicile OU infos de contact pour relay) -->
            <div class="checkout__form">
              <!-- Toggle adresse profil (seulement si connecté ET mode domicile) -->
              <div
                v-if="auth.user && deliveryMode === 'home'"
                class="checkout__address-toggle"
              >
                <button
                  class="checkout__toggle-btn"
                  :class="{ 'checkout__toggle-btn--active': useProfileAddress }"
                  @click="useProfileAddress = true"
                  type="button"
                >
                  <BasicIconNext name="User" :size="18" />
                  Mon adresse
                </button>
                <button
                  class="checkout__toggle-btn"
                  :class="{ 'checkout__toggle-btn--active': !useProfileAddress }"
                  @click="useProfileAddress = false"
                  type="button"
                >
                  <BasicIconNext name="MapPin" :size="18" />
                  Autre adresse
                </button>
              </div>

              <!-- Champs email et nom (toujours visibles) -->
              <div class="checkout__form-row">
                <div class="checkout__field">
                  <label class="checkout__label">
                    <BasicIconNext name="Mail" :size="16" />
                    Email
                  </label>
                  <input
                    v-model="email"
                    type="email"
                    class="checkout__input"
                    placeholder="votre@email.com"
                    :readonly="!!auth.user"
                  />
                </div>
                <div class="checkout__field">
                  <label class="checkout__label">
                    <BasicIconNext name="User" :size="16" />
                    Nom complet
                  </label>
                  <input
                    v-model="fullName"
                    type="text"
                    class="checkout__input"
                    placeholder="Prénom Nom"
                  />
                </div>
              </div>

              <!-- Champs adresse (masqués si mode relay) -->
              <template v-if="deliveryMode === 'home'">
                <div class="checkout__field">
                  <label class="checkout__label">
                    <BasicIconNext name="MapPin" :size="16" />
                    Adresse
                  </label>
                  <input
                    v-model="address"
                    type="text"
                    class="checkout__input"
                    placeholder="Numéro et nom de rue"
                  />
                </div>

                <div class="checkout__form-row checkout__form-row--3">
                  <div class="checkout__field">
                    <label class="checkout__label">{{ t('checkout.shipping.postalCode') }}</label>
                    <input
                      v-model="zip"
                      type="text"
                      class="checkout__input"
                      placeholder="75001"
                    />
                  </div>
                  <div class="checkout__field checkout__field--grow">
                    <label class="checkout__label">{{ t('checkout.shipping.city') }}</label>
                    <input
                      v-model="city"
                      type="text"
                      class="checkout__input"
                      placeholder="Paris"
                    />
                  </div>
                  <div class="checkout__field">
                    <label class="checkout__label">{{ t('checkout.shipping.country') }}</label>
                    <select
                      v-model="country"
                      class="checkout__input checkout__select"
                    >
                      <option value="France">🇫🇷 France</option>
                      <option value="Belgique">🇧🇪 Belgique</option>
                      <option value="Suisse">🇨🇭 Suisse</option>
                      <option value="Luxembourg">🇱🇺 Luxembourg</option>
                      <option value="Canada">🇨🇦 Canada</option>
                    </select>
                  </div>
                </div>
              </template>

              <!-- Code postal pour recherche relay (si mode relay et pas encore sélectionné) -->
              <div
                v-if="deliveryMode === 'relay' && !selectedRelay"
                class="checkout__field"
              >
                <label class="checkout__label">
                  <BasicIconNext name="Search" :size="16" />
                  Code postal (pour la recherche)
                </label>
                <input
                  v-model="zip"
                  type="text"
                  class="checkout__input"
                  placeholder="Entrez votre code postal pour trouver les points relais"
                />
              </div>
            </div>
          </section>
          <!-- Payment Method (inchangé) -->
          <section class="checkout__section">
            <div class="checkout__section-header">
              <div class="checkout__section-icon">
                <BasicIconNext name="CreditCard" :size="20" />
              </div>
              <div>
                <h2 class="checkout__section-title">{{ t('checkout.steps.payment') }}</h2>
                <p class="checkout__section-subtitle">{{ t('checkout.payment.method') }}</p>
              </div>
            </div>

            <div class="checkout__payment-methods">
              <!-- Méthodes disponibles -->
              <div class="payment-methods__available">
                <!-- Stripe / Carte bancaire -->
                <button
                  class="payment-card"
                  :class="{ 'payment-card--active': selectedPayment === 'stripe' }"
                  @click="selectedPayment = 'stripe'"
                  type="button"
                >
                  <div class="payment-card__radio">
                    <div class="payment-card__radio-inner"></div>
                  </div>
                  <div class="payment-card__icon payment-card__icon--stripe">
                    <BasicIconNext name="stripe" :size="40" />
                  </div>
                  <div class="payment-card__content">
                    <span class="payment-card__title">{{ t('checkout.payment.card') }}</span>
                    <span class="payment-card__desc">Visa, Mastercard, Amex</span>
                  </div>
                  <div class="payment-card__cards">
                    <BasicIconNext name="visa" :size="32" class="payment-card__card-icon" />
                    <BasicIconNext name="mastercard" :size="32" class="payment-card__card-icon" />
                  </div>
                </button>

                <!-- PayPal -->
                <button
                  class="payment-card"
                  :class="{ 'payment-card--active': selectedPayment === 'paypal' }"
                  @click="selectedPayment = 'paypal'"
                  type="button"
                >
                  <div class="payment-card__radio">
                    <div class="payment-card__radio-inner"></div>
                  </div>
                  <div class="payment-card__icon payment-card__icon--paypal">
                    <BasicIconNext name="paypal" :size="40" />
                  </div>
                  <div class="payment-card__content">
                    <span class="payment-card__title">PayPal</span>
                    <span class="payment-card__desc">{{ t('checkout.payment.paypalSecure') }}</span>
                  </div>
                </button>
              </div>

              <!-- Section Bientôt disponible (identique à l'original, je le raccourcis ici) -->
              <div class="payment-methods__coming-soon">
                <button
                  class="payment-methods__coming-header"
                  @click="showComingSoon = !showComingSoon"
                  type="button"
                >
                  <div class="payment-methods__coming-left">
                    <BasicIconNext name="Clock" :size="16" />
                    <span>{{ t('checkout.payment.otherMethods') }}</span>
                    <span class="payment-methods__coming-badge">{{ t('common.comingSoon') }}</span>
                  </div>
                  <BasicIconNext
                    name="ChevronDown"
                    :size="20"
                    class="payment-methods__coming-chevron"
                    :class="{ 'payment-methods__coming-chevron--open': showComingSoon }"
                  />
                </button>
                <!-- Contenu collapsible identique à l'original -->
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column - Order Summary -->
        <aside class="checkout__sidebar">
          <div class="checkout__summary">
            <h3 class="checkout__summary-title">{{ t('checkout.summary.title') }}</h3>

            <div class="checkout__summary-rows">
              <div class="checkout__summary-row">
                <span>{{ t('cart.subtotal') }}</span>
                <span>{{ formatPrice(cartSubtotal) }}</span>
              </div>

              <div class="checkout__summary-row">
                <span>{{ t('cart.shipping') }}</span>
                <span :class="{ 'checkout__summary-free': shippingCost === 0 }">
                  {{ shippingCost === 0 ? t('cart.freeShipping') : formatPrice(shippingCost) }}
                </span>
              </div>

              <!-- Info mode livraison -->
              <div
                v-if="deliveryMode === 'relay'"
                class="checkout__summary-delivery"
              >
                <BasicIconNext name="MapPin" :size="16" />
                <span v-if="selectedRelay">{{ selectedRelay.name }}</span>
                <span
                  v-else
                  class="checkout__summary-delivery--pending"
                >
                  Point relais à sélectionner
                </span>
              </div>

              <div
                v-if="deliveryMode === 'home' && cartSubtotal < FREE_SHIPPING_THRESHOLD"
                class="checkout__shipping-progress"
              >
                <div class="checkout__shipping-bar">
                  <div
                    class="checkout__shipping-fill"
                    :style="{ width: `${(cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }"
                  ></div>
                </div>
                <p class="checkout__shipping-text">
                  Plus que
                  <strong>{{ formatPrice(FREE_SHIPPING_THRESHOLD - cartSubtotal) }}</strong>
                  pour la livraison offerte
                </p>
              </div>

              <div class="checkout__summary-divider"></div>

              <div class="checkout__summary-row checkout__summary-row--total">
                <span>{{ t('cart.total') }}</span>
                <span>{{ formatPrice(finalTotal) }}</span>
              </div>
            </div>

            <button
              class="checkout__submit"
              :disabled="!canSubmit"
              @click="submitOrder"
            >
              <BasicIconNext v-if="isSubmitting" name="Loader2" :size="20" class="checkout__submit-spinner" />
              <template v-else>
                <BasicIconNext name="Shield" :size="20" />
                Payer {{ formatPrice(finalTotal) }}
              </template>
            </button>

            <!-- Trust Badges -->
            <div class="checkout__trust">
              <div class="checkout__trust-item">
                <BasicIconNext name="Lock" :size="20" />
                <span>{{ t('checkout.payment.securePayment') }}</span>
              </div>
              <div class="checkout__trust-item">
                <BasicIconNext name="Shield" :size="20" />
                <span>{{ t('checkout.payment.sslProtected') }}</span>
              </div>
              <div class="checkout__trust-item">
                <BasicIconNext name="CheckCircle2" :size="20" />
                <span>{{ t('checkout.payment.satisfaction') }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { processPayment, type PaymentProvider } from '@/api/external/payment'
  import { createOrder } from '@/api/supabase/orders'
  import type { CartView } from '@/supabase/types/supabase.types'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, watch, watchEffect } from 'vue'
  import { useI18n } from 'vue-i18n'
  import RelaySelector from '../livraison/mondial-relay/RelaySelector.vue'
  import type { OrderRelayData, RelayPoint } from '../livraison/mondial-relay/relay'

  const { t } = useI18n()
  const auth = useAuthStore()
  const cart = useCartStore()
  const toast = useToastStore()

  // State
  const currentStep = ref(2)
  const isSubmitting = ref(false)
  const useProfileAddress = ref(true)
  const showComingSoon = ref(false)
  const selectedPayment = ref<PaymentProvider>('stripe')

  // 🆕 State Mondial Relay
  const deliveryMode = ref<'relay' | 'home'>('relay')
  const selectedRelay = ref<RelayPoint | null>(null)
  const relayOrderData = ref<OrderRelayData | null>(null)

  // 🆕 Brand ID Mondial Relay (à remplacer par le vrai en prod)
  const MONDIAL_RELAY_BRAND_ID = 'BDTEST'

  // Form fields
  const email = ref('')
  const fullName = ref('')
  const address = ref('')
  const zip = ref('')
  const city = ref('')
  const country = ref('France')

  // Constants
  const FREE_SHIPPING_THRESHOLD = 100
  const FLAT_SHIPPING_RATE = 9.9

  // Computed
  const cartSubtotal = computed(() => cart.totalPrice)

  // 🆕 Frais de livraison adaptatifs
  const shippingCost = computed(() => {
    // Point relais = toujours gratuit
    if (deliveryMode.value === 'relay') return 0
    // Domicile = gratuit si > seuil
    return cartSubtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE
  })

  const finalTotal = computed(() => cartSubtotal.value + shippingCost.value)

  // 🆕 Validation du formulaire
  const canSubmit = computed(() => {
    if (cart.items.length === 0) return false
    if (!email.value || !fullName.value) return false
    if (isSubmitting.value) return false

    if (deliveryMode.value === 'relay') {
      // En mode relay, il faut avoir sélectionné un point
      return selectedRelay.value !== null
    } else {
      // En mode domicile, il faut l'adresse complète
      return !!(address.value && zip.value && city.value)
    }
  })

  // Methods
  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
      Number(value),
    )
  }

  function getLineTotal(item: CartView) {
    const qty = item.quantity ?? 1
    const price = item.is_on_sale
      ? (item.product_sale_price ?? item.product_price ?? 0)
      : (item.product_price ?? 0)
    return price * qty
  }

  function updateQuantity(item: CartView, delta: number) {
    const newQty = (item.quantity ?? 1) + delta
    if (newQty >= 1 && item.product_id) {
      cart.updateQuantity(item.product_id, newQty)
    }
  }

  // 🆕 Handlers Mondial Relay
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

  // Reset relay quand on change de mode
  watch(deliveryMode, (mode) => {
    if (mode === 'home') {
      selectedRelay.value = null
      relayOrderData.value = null
    }
  })

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

  onMounted(() => {
    // OpSec: sessionStorage pour donnees sensibles (efface a la fermeture)
    const saved = sessionStorage.getItem('fp-checkout-form')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (!auth.user || !useProfileAddress.value) {
          email.value = data.email || ''
          fullName.value = data.fullName || ''
          address.value = data.address || ''
          zip.value = data.zip || ''
          city.value = data.city || ''
          country.value = data.country || 'France'
        }
        // Restaurer le mode de livraison
        if (data.deliveryMode) {
          deliveryMode.value = data.deliveryMode
        }
      } catch (e) {
        /* ignore */
      }
    }
    if (auth.user && useProfileAddress.value) {
      fillFromProfile()
    }
  })

  watchEffect(() => {
    if (auth.user && useProfileAddress.value) {
      fillFromProfile()
    }
  })

  watch(useProfileAddress, (isUsing) => {
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

  // Sauvegarder le formulaire (OpSec: sessionStorage)
  watch(
    [email, fullName, address, zip, city, country, deliveryMode],
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
        }),
      )
    },
    { deep: true },
  )

  async function submitOrder() {
    if (isSubmitting.value || !canSubmit.value) return

    if (selectedPayment.value !== 'stripe' && selectedPayment.value !== 'paypal') {
      toast.show('Cette méthode de paiement sera bientôt disponible', 'info')
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

      // 🆕 Préparer les données avec relay si applicable
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
        discountAmount: 0,
        totalAmount: finalTotal.value,
        items: orderItemsPayload,
      }

      // 🆕 Ajouter les données relay si en mode point relais
      if (deliveryMode.value === 'relay' && relayOrderData.value) {
        orderPayload.relayId = relayOrderData.value.relay_id
        orderPayload.relayName = relayOrderData.value.relay_name
        orderPayload.relayAddress = relayOrderData.value.relay_address
        orderPayload.relayZipcode = relayOrderData.value.relay_zipcode
        orderPayload.relayCity = relayOrderData.value.relay_city
        orderPayload.relayCountry = relayOrderData.value.relay_country
      }

      const orderResponse = await createOrder(orderPayload)

      // Order tokens peuvent rester en localStorage (non sensibles, utiles pour tracking)
      if (orderResponse.tracking_token) {
        localStorage.setItem('fp-last-order-token', orderResponse.tracking_token)
      }
      localStorage.setItem('fp-last-order-id', orderResponse.order_id)
      // Nettoyer les donnees sensibles du formulaire
      sessionStorage.removeItem('fp-checkout-form')

      await processPayment(
        finalTotal.value,
        selectedPayment.value,
        email.value,
        orderResponse.order_id,
      )
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
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);
  @bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  .checkout {
    position: relative;
    min-height: 100vh;
    background: @neutral-50;

    // ============================================
    // BACKGROUND
    // ============================================
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

    // ============================================
    // CONTAINER
    // ============================================
    &__container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 32px 80px;
    }

    // ============================================
    // HEADER
    // ============================================
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
      font-family: @font-body;
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

      svg {
        transition: transform 0.2s @ease;
      }

      &:hover svg {
        transform: translateX(-2px);
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
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @success-600;

      svg {
        color: @success-500;
      }
    }

    // ============================================
    // STEPS
    // ============================================
    &__steps {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: 40px;
      padding: 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
    }

    &__step {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      opacity: 0.4;
      transition: all 0.3s @ease;

      &--active {
        opacity: 1;
      }

      &--done {
        opacity: 1;

        .checkout__step-number {
          background: @success-500;
          border-color: @success-500;
          color: @white;
        }
      }
    }

    &__step-number {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @neutral-100;
      border: 2px solid @neutral-200;
      border-radius: 50%;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 600;
      color: @neutral-500;
      transition: all 0.3s @ease;

      .checkout__step--active & {
        background: var(--primary-500);
        border-color: var(--primary-500);
        color: white;
      }
    }

    &__step-label {
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: @neutral-600;

      .checkout__step--active & {
        color: @neutral-900;
        font-weight: 600;
      }
    }

    &__step-line {
      width: 60px;
      height: 2px;
      background: @neutral-200;
      margin: 0 8px;
      transition: background 0.3s @ease;

      &--active {
        background: var(--primary-500);
      }
    }

    // ============================================
    // CONTENT LAYOUT
    // ============================================
    &__content {
      display: grid;
      grid-template-columns: 1fr minmax(320px, 380px);
      gap: 32px;
      align-items: start;
    }

    &__main {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    // ============================================
    // SECTIONS
    // ============================================
    &__section {
      background: white;
      border-radius: 20px;
      padding: 28px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
    }

    &__section-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid @neutral-100;
    }

    &__section-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.1) 0%,
        rgba(var(--primary-500-rgb), 0.05) 100%
      );
      border-radius: 14px;
      color: var(--primary-600);
    }

    &__section-title {
      font-family: @font-display;
      font-size: 20px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0;
    }

    &__section-subtitle {
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-500;
      margin: 4px 0 0;
    }

    // ============================================
    // CART ITEMS
    // ============================================
    &__items {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 24px;
      text-align: center;

      &-icon {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: @neutral-100;
        border-radius: 50%;
        color: @neutral-400;
        margin-bottom: 20px;
      }

      h3 {
        font-family: @font-display;
        font-size: 18px;
        font-weight: 600;
        color: @neutral-800;
        margin: 0 0 8px;
      }

      p {
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-500;
        margin: 0 0 20px;
      }

      &-btn {
        padding: 12px 24px;
        background: var(--primary-500);
        border: none;
        border-radius: 10px;
        font-family: @font-body;
        font-size: 14px;
        font-weight: 600;
        color: white;
        cursor: pointer;
        transition: all 0.2s @ease;

        &:hover {
          background: var(--primary-600);
          transform: translateY(-2px);
        }
      }
    }

    // ============================================
    // ADDRESS TOGGLE
    // ============================================
    &__address-toggle {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    &__toggle-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 20px;
      background: @neutral-50;
      border: 2px solid @neutral-200;
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: @neutral-600;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        border-color: @neutral-300;
        background: white;
      }

      &--active {
        background: rgba(var(--primary-500-rgb), 0.05);
        border-color: var(--primary-500);
        color: var(--primary-700);

        svg {
          color: var(--primary-500);
        }
      }
    }

    // ============================================
    // FORM
    // ============================================
    &__form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;

      &--3 {
        display: grid;
        grid-template-columns: 120px 1fr 160px;

        @media (max-width: 640px) {
          display: flex;
          flex-direction: column;
        }
      }
    }

    &__field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;

      &--grow {
        flex: 1000;
      }
    }

    &__label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @neutral-700;

      svg {
        color: @neutral-400;
      }
    }

    &__input {
      width: auto;
      padding: 14px 16px;
      background: @neutral-50;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-900;
      transition: all 0.2s @ease;

      &::placeholder {
        color: @neutral-400;
      }

      &:focus {
        outline: none;
        background: white;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
      }

      &:read-only {
        background: @neutral-100;
        color: @neutral-600;
        cursor: not-allowed;
      }
    }

    &__select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 40px;
      cursor: pointer;
    }

    // ============================================
    // PAYMENT METHODS
    // ============================================
    &__payment-methods {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    // ============================================
    // SIDEBAR
    // ============================================
    &__sidebar {
      position: sticky;
      top: 24px;
    }

    &__summary {
      background: white;
      border-radius: 20px;
      padding: 28px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.04);
      border: 1px solid @neutral-100;
    }

    &__summary-title {
      font-family: @font-display;
      font-size: 18px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0 0 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid @neutral-100;
    }

    &__summary-rows {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    &__summary-row {
      display: flex;
      justify-content: space-between;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-600;

      &--total {
        padding-top: 16px;
        font-size: 18px;
        font-weight: 700;
        color: @neutral-900;

        span:last-child {
          color: var(--primary-700);
          font-size: 22px;
        }
      }
    }

    &__summary-free {
      color: @success-500;
      font-weight: 600;
    }

    &__summary-divider {
      height: 1px;
      background: @neutral-100;
      margin: 8px 0;
    }

    &__shipping-progress {
      padding: 16px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.05) 0%,
        rgba(var(--primary-500-rgb), 0.02) 100%
      );
      border-radius: 12px;
      margin-top: 8px;
    }

    &__shipping-bar {
      height: 6px;
      background: @neutral-200;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 10px;
    }

    &__shipping-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
      border-radius: 3px;
      transition: width 0.3s @ease;
    }

    &__shipping-text {
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-600;
      margin: 0;
      text-align: center;

      strong {
        color: var(--primary-700);
        font-weight: 600;
      }
    }

    &__submit {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 18px 24px;
      margin-top: 24px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border: none;
      border-radius: 14px;
      font-family: @font-body;
      font-size: 16px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.25s @ease;
      box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.3);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.4);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        background: @neutral-300;
        box-shadow: none;
        cursor: not-allowed;
      }

      &-spinner {
        animation: spin 1s linear infinite;
      }
    }

    &__trust {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid @neutral-100;
    }

    &__trust-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;

      svg {
        color: @success-500;
      }
    }
  }

  // ============================================
  // CHECKOUT ITEM
  // ============================================
  .checkout-item {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: @neutral-50;
    border: 1px solid @neutral-100;
    border-radius: 16px;
    transition: all 0.2s @ease;

    &:hover {
      border-color: @neutral-200;
      background: white;
    }

    &__image {
      position: relative;
      width: 80px;
      height: 80px;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
        background: white;
        border: 1px solid @neutral-100;
      }
    }

    &__badge {
      position: absolute;
      top: -6px;
      left: -6px;
      padding: 4px 8px;
      background: @danger-500;
      border-radius: 6px;
      font-family: @font-body;
      font-size: 10px;
      font-weight: 700;
      color: @white;
    }

    &__details {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
    }

    &__top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    &__name {
      font-family: @font-display;
      font-size: 15px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__dosage {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
      margin: 2px 0 0;
    }

    &__remove {
      padding: 6px;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: @neutral-400;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: @danger-50;
        color: @danger-500;
      }
    }

    &__bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
    }

    &__quantity {
      display: flex;
      align-items: center;
      gap: 4px;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      padding: 4px;
    }

    &__qty-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: @neutral-600;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover:not(:disabled) {
        background: @neutral-100;
        color: @neutral-900;
      }

      &:disabled {
        color: @neutral-300;
        cursor: not-allowed;
      }
    }

    &__qty-value {
      min-width: 32px;
      text-align: center;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: @neutral-900;
    }

    &__price {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
    }

    &__price-old {
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-400;
      text-decoration: line-through;
    }

    &__price-current {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 700;
      color: @neutral-900;

      &--sale {
        color: @danger-500;
      }
    }
  }

  // ============================================
  // PAYMENT CARD
  // ============================================

  // ============================================
  // PAYMENT METHODS - Structure optimisée
  // ============================================
  .payment-methods__available {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  // ============================================
  // SECTION "BIENTÔT DISPONIBLE" - Collapsible
  // ============================================
  .payment-methods__coming-soon {
    margin-top: 16px;
    border: 1px solid @neutral-200;
    border-radius: 14px;
    overflow: hidden;
    background: @neutral-50;
  }

  .payment-methods__coming-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 14px 18px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s @ease;

    &:hover {
      background: @neutral-100;
    }
  }

  .payment-methods__coming-left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: @neutral-600;

    svg {
      color: @neutral-400;
    }
  }

  .payment-methods__coming-badge {
    padding: 3px 8px;
    background: linear-gradient(
      135deg,
      var(--primary-100) 0%,
      rgba(var(--primary-500-rgb), 0.1) 100%
    );
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    color: var(--primary-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .payment-methods__coming-chevron {
    color: @neutral-400;
    transition: transform 0.25s @ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  .payment-methods__coming-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 12px 12px;
  }

  // ============================================
  // PAYMENT CARD - État désactivé
  // ============================================
  .payment-card--disabled {
    padding: 14px 18px;
    background: white;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    opacity: 0.7;
    cursor: not-allowed;
    display: flex;
    align-items: center;
    gap: 14px;

    &:hover {
      transform: none;
      box-shadow: none;
      background: white;
    }

    .payment-card__icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
    }

    .payment-card__title {
      font-size: 14px;
      color: @neutral-700;
    }

    .payment-card__desc {
      font-size: 12px;
      color: @neutral-400;
    }
  }

  // ============================================
  // BNPL Preview (pour les méthodes désactivées)
  // ============================================
  .payment-card__bnpl-preview {
    margin-left: auto;
    padding: 6px 10px;
    background: @neutral-100;
    border-radius: 8px;

    span {
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: @neutral-500;
    }
  }

  // ============================================
  // Mini divider (dans la section collapsible)
  // ============================================
  .payment-methods__divider-mini {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 8px 0 4px;
    padding: 0 6px;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: @neutral-200;
    }

    span {
      font-family: @font-body;
      font-size: 10px;
      font-weight: 600;
      color: @neutral-400;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
  }

  // ============================================
  // Animation slide pour le collapse
  // ============================================
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s @ease;
    overflow: hidden;
  }

  .slide-enter-from,
  .slide-leave-to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }

  .slide-enter-to,
  .slide-leave-from {
    opacity: 1;
    max-height: 500px;
  }

  // ============================================
  // PAYMENT CARD - Icônes (garder les existants + ajouts)
  // ============================================
  .payment-card {
    &__icon--google {
      background: white;
      border: 1px solid @neutral-200;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    &__icon--klarna {
      background: #ffb3c7;
      box-shadow: 0 2px 8px rgba(255, 179, 199, 0.3);
    }

    &__icon--alma {
      background: #fa5022;
      box-shadow: 0 2px 8px rgba(250, 80, 34, 0.3);
    }

    &__icon--afterpay {
      background: #b2fce4;
      box-shadow: 0 2px 8px rgba(178, 252, 228, 0.3);
    }
  }

  // ============================================
  // RESPONSIVE
  // ============================================
  @media (max-width: 768px) {
    .payment-methods__coming-header {
      padding: 12px 14px;
    }

    .payment-methods__coming-content {
      padding: 0 8px 8px;
    }

    .payment-card--disabled {
      padding: 12px 14px;
      gap: 12px;

      .payment-card__icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
      }

      .payment-card__bnpl-preview {
        display: none;
      }
    }

    .payment-methods__divider-mini {
      margin: 4px 0;
    }
  }
  .payment-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background: white;
    border: 2px solid @neutral-200;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.25s @ease;
    text-align: left;

    &:hover {
      border-color: @neutral-300;
      background: @neutral-50;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    &--active {
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.04) 0%,
        rgba(var(--primary-500-rgb), 0.02) 100%
      );
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.1);

      .payment-card__radio-inner {
        transform: scale(1);
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow:
          0 0 0 4px rgba(var(--primary-500-rgb), 0.1),
          0 4px 16px rgba(0, 0, 0, 0.06);
      }
    }

    &__radio {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid @neutral-300;
      border-radius: 50%;
      flex-shrink: 0;
      transition: all 0.25s @ease;

      .payment-card--active & {
        border-color: var(--primary-500);
      }
    }

    &__radio-inner {
      width: 12px;
      height: 12px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border-radius: 50%;
      transform: scale(0);
      transition: transform 0.25s @bounce;
    }

    &__icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      flex-shrink: 0;
      overflow: hidden;

      svg {
        width: 100%;
        height: 100%;
      }

      &--stripe {
        background: #635bff;
        box-shadow: 0 2px 8px rgba(99, 91, 255, 0.3);
      }

      &--paypal {
        background: #003087;
        box-shadow: 0 2px 8px rgba(0, 48, 135, 0.3);
      }

      &--apple {
        background: #000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
    }

    &__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    &__title {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: @neutral-900;
    }

    &__desc {
      font-family: @font-body;
      font-size: 13px;
      color: @neutral-500;
    }

    &__cards {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    &__card-icon {
      height: 28px;
      width: auto;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    &__paypal-logo {
      flex-shrink: 0;

      svg {
        height: 24px;
        width: auto;
      }
    }

    &__apple-badge {
      flex-shrink: 0;
      padding: 6px 12px;
      background: linear-gradient(135deg, @neutral-100 0%, @neutral-50 100%);
      border: 1px solid @neutral-200;
      border-radius: 20px;

      span {
        font-family: @font-body;
        font-size: 11px;
        font-weight: 600;
        color: @neutral-500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  }

  // ============================================
  // ANIMATIONS
  // ============================================
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  // ============================================
  // RESPONSIVE
  // ============================================
  @media (max-width: 1100px) {
    .checkout {
      &__content {
        grid-template-columns: 1fr;
      }

      &__sidebar {
        position: static;
        order: -1;
      }
    }
  }

  @media (max-width: 768px) {
    .checkout {
      // Bouton sticky en bas sur mobile
      &__sidebar {
        .checkout__submit {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          margin: 0;
          border-radius: 0;
          padding: 18px 24px;
          z-index: 100;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
        }

        // Masquer les trust badges en mobile pour alléger
        .checkout__trust {
          display: none;
        }

        // Ajouter du padding en bas pour compenser le bouton sticky
        .checkout__summary {
          padding-bottom: 80px;
        }
      }

      &__container {
        padding: 16px;
        padding-bottom: 100px; // Extra padding pour le bouton sticky
      }

      &__header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      &__back {
        justify-content: center;
      }

      &__steps {
        padding: 16px 12px;
        overflow-x: auto;
      }

      &__step-label {
        display: none;
      }

      &__step-line {
        width: 40px;
      }

      &__section {
        padding: 20px;
      }

      &__form-row,
      &__form-row--3 {
        grid-template-columns: 1fr;
      }

      &__address-toggle {
        flex-direction: column;
      }
    }

    .checkout-item {
      flex-direction: column;
      gap: 12px;

      &__image {
        width: 100%;
        height: 120px;

        img {
          object-fit: contain;
        }
      }

      &__bottom {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }

      &__quantity {
        justify-content: center;
      }

      &__price {
        align-items: center;
      }
    }

    .payment-card {
      flex-wrap: wrap;
      padding: 16px;

      &__cards {
        width: 100%;
        justify-content: flex-start;
        margin-top: 8px;
        padding-top: 12px;
        border-top: 1px solid @neutral-100;
      }

      &__paypal-logo,
      &__apple-badge {
        margin-left: auto;
      }
    }
  }

  // ============================================
  // PAYMENT METHODS DIVIDER
  // ============================================
  .payment-methods__divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 20px 0 12px;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, @neutral-200, transparent);
    }

    span {
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: @neutral-400;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
  }

  // ============================================
  // PAYMENT CARD - Ajouts pour les nouveaux providers
  // ============================================
  .payment-card {
    // ... (garder les styles existants)

    // Google Pay icon
    &__icon--google {
      background: white;
      border: 1px solid @neutral-200;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    // Klarna icon
    &__icon--klarna {
      background: #ffb3c7;
      box-shadow: 0 2px 8px rgba(255, 179, 199, 0.4);
    }

    // Alma icon
    &__icon--alma {
      background: #fa5022;
      box-shadow: 0 2px 8px rgba(250, 80, 34, 0.4);
    }

    // Afterpay icon
    &__icon--afterpay {
      background: #b2fce4;
      box-shadow: 0 2px 8px rgba(178, 252, 228, 0.4);
    }

    // Google Pay logo
    &__google-logo {
      flex-shrink: 0;

      svg {
        height: 20px;
        width: auto;
      }
    }

    // Badge "Bientôt" unifié
    &__coming-badge {
      flex-shrink: 0;
      padding: 6px 12px;
      background: linear-gradient(135deg, @neutral-100 0%, @neutral-50 100%);
      border: 1px solid @neutral-200;
      border-radius: 20px;

      span {
        font-family: @font-body;
        font-size: 11px;
        font-weight: 600;
        color: @neutral-500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    // BNPL specific styles
    &--bnpl {
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 20px;
        right: 20px;
        height: 3px;
        background: linear-gradient(90deg, #ffb3c7, #fa5022, #b2fce4);
        border-radius: 0 0 3px 3px;
        opacity: 0;
        transition: opacity 0.25s @ease;
      }

      &.payment-card--active::before {
        opacity: 1;
      }
    }

    // BNPL info (montant par échéance)
    &__bnpl-info {
      flex-shrink: 0;
      padding: 8px 14px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.08) 0%,
        rgba(var(--primary-500-rgb), 0.04) 100%
      );
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
      border-radius: 10px;
    }

    &__bnpl-amount {
      font-family: @font-display;
      font-size: 14px;
      font-weight: 700;
      color: var(--primary-700);
    }
  }

  // ============================================
  // RESPONSIVE - Ajouts pour les nouveaux éléments
  // ============================================
  @media (max-width: 768px) {
    .payment-methods__divider {
      margin: 16px 0 8px;

      span {
        font-size: 11px;
      }
    }

    .payment-card {
      &__google-logo {
        display: none;
      }

      &__bnpl-info {
        width: 100%;
        margin-top: 8px;
        padding-top: 12px;
        border-top: 1px solid @neutral-100;
        background: transparent;
        border: none;
        border-radius: 0;
        text-align: center;
      }

      &__coming-badge {
        margin-left: auto;
      }
    }
  }

  // ============================================
  // DELIVERY MODE SELECTOR (NOUVEAU)
  // ============================================
  .checkout__delivery-mode {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  .checkout__delivery-option {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px;
    background: white;
    border: 2px solid @neutral-200;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.25s @ease;
    text-align: left;

    &:hover {
      border-color: @neutral-300;
      background: @neutral-50;
    }

    &--active {
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.04) 0%,
        rgba(var(--primary-500-rgb), 0.02) 100%
      );
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.1);

      .checkout__delivery-radio-inner {
        transform: scale(1);
      }
    }
  }

  .checkout__delivery-radio {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid @neutral-300;
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.25s @ease;

    .checkout__delivery-option--active & {
      border-color: var(--primary-500);
    }
  }

  .checkout__delivery-radio-inner {
    width: 10px;
    height: 10px;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.25s @bounce;
  }

  .checkout__delivery-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    flex-shrink: 0;

    &--relay {
      background: linear-gradient(135deg, @success-500 0%, @success-600 100%);
      color: @white;
    }

    &--home {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      color: white;
    }
  }

  .checkout__delivery-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .checkout__delivery-title {
    font-family: @font-display;
    font-size: 15px;
    font-weight: 600;
    color: @neutral-900;
  }

  .checkout__delivery-desc {
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;
  }

  .checkout__delivery-price {
    font-family: @font-display;
    font-size: 14px;
    font-weight: 600;
    color: @neutral-700;
    padding: 6px 12px;
    background: @neutral-100;
    border-radius: 8px;

    &--free {
      background: linear-gradient(
        135deg,
        rgba(var(--success-500-rgb), 0.1) 0%,
        rgba(var(--success-500-rgb), 0.05) 100%
      );
      color: @success-600;
    }
  }

  // ============================================
  // RELAY SECTION
  // ============================================
  .checkout__relay-section {
    margin-bottom: 24px;
    padding: 20px;
    background: linear-gradient(135deg, rgba(var(--success-500-rgb), 0.04) 0%, rgba(var(--success-500-rgb), 0.02) 100%);
    border: 1px dashed rgba(var(--success-500-rgb), 0.3);
    border-radius: 16px;
  }

  // ============================================
  // SUMMARY DELIVERY INFO
  // ============================================
  .checkout__summary-delivery {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: linear-gradient(135deg, rgba(var(--success-500-rgb), 0.08) 0%, rgba(var(--success-500-rgb), 0.04) 100%);
    border-radius: 10px;
    font-family: @font-body;
    font-size: 13px;
    color: @success-600;

    svg {
      flex-shrink: 0;
    }

    &--pending {
      color: @neutral-500;
      font-style: italic;
    }
  }

  // ============================================
  // RESPONSIVE UPDATES
  // ============================================
  @media (max-width: 768px) {
    .checkout__delivery-mode {
      flex-direction: column;
      gap: 12px;
    }

    .checkout__delivery-option {
      padding: 16px;
    }

    .checkout__delivery-icon {
      width: 40px;
      height: 40px;
    }
  }
</style>
