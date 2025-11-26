<template>
  <div class="checkout-page">
    <PageHeader />
    <div class="checkout-page__content">
      <section
        class="checkout-card"
        v-motion="{
          initial: { opacity: 0, y: 20 },
          enter: { opacity: 1, y: 0, transition: { delay: 0.1, type: 'spring' } },
        }"
      >
        <BasicText
          size="h4"
          weight="bold"
          class="checkout-card__title"
        >
          Résumé de la commande
        </BasicText>
        <div class="checkout-items">
          <div
            v-for="item in cart.items"
            :key="item.cart_item_id!"
            class="checkout-item"
          >
            <div class="checkout-item__left">
              <img
                :src="item.product_image || defaultImage"
                :alt="item.product_name!"
                class="checkout-item__img"
              />
              <div class="checkout-item__info">
                <div
                  class="checkout-item__name-trigger"
                  @click="openProductModal(item.product_id!, $event)"
                >
                  <BasicText
                    weight="bold"
                    class="checkout-item__name interactive"
                  >
                    {{ item.product_name }}
                  </BasicText>
                  <BasicIconNext
                    name="Search"
                    :size="14"
                    class="checkout-item__icon"
                  />
                </div>
                <BasicText
                  v-if="item.product_dosage && !item.product_name?.includes(item.product_dosage)"
                  size="body-s"
                  weight="semibold"
                  color="primary-700"
                  class="checkout-item__dosage"
                >
                  Dosage : {{ item.product_dosage }}
                </BasicText>
                <div class="checkout-item__details">
                  <span>{{ item.quantity ?? 1 }} ×</span>
                  <span class="checkout-item__unit-price">
                    <template v-if="item.is_on_sale">
                      <span class="price-striked">{{ formatPrice(item.product_price) }}</span>
                      <span class="price-sale">{{ formatPrice(item.product_sale_price) }}</span>
                    </template>
                    <template v-else>{{ formatPrice(item.product_price) }}</template>
                  </span>
                </div>
              </div>
            </div>
            <BasicText
              weight="bold"
              class="checkout-item__total"
            >
              {{ formatPrice(getLineTotal(item)) }}
            </BasicText>
          </div>
        </div>
        <div class="checkout-summary">
          <div class="checkout-summary__row">
            <BasicText
              size="body-s"
              color="neutral-600"
            >
              Sous-total
            </BasicText>
            <BasicText
              size="body-s"
              color="neutral-800"
            >
              {{ formatPrice(cartSubtotal) }}
            </BasicText>
          </div>
          <div class="checkout-summary__row">
            <BasicText
              size="body-s"
              color="neutral-600"
            >
              Livraison
            </BasicText>
            <BasicText
              size="body-s"
              :color="shippingCost === 0 ? 'success-600' : 'neutral-800'"
            >
              {{ shippingCost === 0 ? 'Offerte' : formatPrice(shippingCost) }}
            </BasicText>
          </div>
          <div class="checkout-summary__divider"></div>
          <div class="checkout-summary__row total">
            <BasicText
              size="h5"
              weight="bold"
            >
              Total à payer
            </BasicText>
            <BasicText
              size="h4"
              weight="bold"
              color="primary-700"
            >
              {{ formatPrice(finalTotal) }}
            </BasicText>
          </div>
        </div>
      </section>

      <section
        class="checkout-card"
        v-motion="{
          initial: { opacity: 0, y: 20 },
          enter: { opacity: 1, y: 0, transition: { delay: 0.2, type: 'spring' } },
        }"
      >
        <div class="checkout-card__header-row">
          <BasicText
            size="h4"
            weight="bold"
            class="checkout-card__title mb-0"
          >
            Coordonnées de livraison
          </BasicText>

          <div
            v-if="auth.user"
            class="checkout-profile-toggle"
          >
            <BasicCheckbox
              v-model="useProfileAddress"
              label="Utiliser mon adresse enregistrée"
              size="small"
            />
          </div>
        </div>

        <div class="checkout-form">
          <BasicInput
            v-model="email"
            label="Adresse E-mail"
            input-type="form"
            placeholder="exemple@email.com"
            :readonly="!!auth.user"
            required
          />

          <BasicInput
            v-model="fullName"
            label="Nom complet"
            input-type="form"
            placeholder="Prénom et Nom"
            required
          />

          <div class="checkout-form__divider"></div>

          <BasicInput
            v-model="address"
            label="Adresse"
            input-type="form"
            placeholder="N° et nom de rue"
            required
          />

          <div class="checkout-form__row">
            <BasicInput
              v-model="zip"
              label="Code postal"
              input-type="form"
              placeholder="Ex: 75001"
              required
            />
            <BasicInput
              v-model="city"
              label="Ville"
              input-type="form"
              placeholder="Ex: Paris"
              required
            />
          </div>
          <BasicInput
            v-model="country"
            label="Pays"
            input-type="form"
            placeholder="France"
            required
          />
        </div>
      </section>

      <section
        class="checkout-card"
        v-motion="{
          initial: { opacity: 0, y: 20 },
          enter: { opacity: 1, y: 0, transition: { delay: 0.3, type: 'spring' } },
        }"
      >
        <BasicText
          size="h4"
          weight="bold"
          class="checkout-card__title"
        >
          Méthode de paiement
        </BasicText>
        <div class="checkout-payment__methods">
          <div
            v-for="method in paymentMethods"
            :key="method.value"
            :class="[
              'payment-method',
              { 'payment-method--active': selectedPayment === method.value },
            ]"
            @click="selectedPayment = method.value as PaymentProvider"
          >
            <div class="payment-method__icon"><component :is="method.icon" /></div>
            <div class="payment-method__info">
              <BasicText weight="bold">{{ method.label }}</BasicText>
              <BasicText
                size="body-s"
                color="neutral-500"
              >
                {{ method.desc }}
              </BasicText>
            </div>
            <div class="payment-method__radio"><div class="radio-circle"></div></div>
          </div>
        </div>
      </section>

      <BasicButton
        label="Valider et payer"
        type="primary"
        variant="filled"
        width="full"
        size="large"
        class="checkout-submit-btn"
        :disabled="cart.items.length === 0"
        @click="submitOrder"
      />
    </div>

    <teleport to="#app">
      <ProductModalCheckout
        v-if="selectedProductId"
        v-model="isModalVisible"
        :product-id="selectedProductId"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import ProductModalCheckout from '@/features/checkout/modale/ProductModalCheckout.vue'
  import {
    processPayment,
    type PaymentProvider,
  } from '@/features/checkout/paiement/service/paymentService'
  import { useManualSablier } from '@/features/interface/sablier/useManualSablier'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import { createOrder } from '@/supabase/api/ordersApi'
  import type { CartView } from '@/supabase/types/supabase.types'
  import BasicCheckbox from '@designSystem/components/basic/checkbox/BasicCheckbox.vue'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, h, onMounted, ref, watch, watchEffect } from 'vue'

  const auth = useAuthStore()
  const cart = useCartStore()
  const toast = useToastStore()
  const { withSablier } = useManualSablier()

  // 🆕 Switch pour utiliser l'adresse du profil (Défaut: true si connecté)
  const useProfileAddress = ref(true)

  // Champs du formulaire (valeurs par défaut)
  const email = ref('')
  const fullName = ref('')
  const address = ref('')
  const zip = ref('')
  const city = ref('')
  const country = ref('France')

  const isModalVisible = ref(false)
  const selectedProductId = ref<string | null>(null)

  // --- LOGIQUE DE REMPLISSAGE ---

  function fillFromProfile() {
    if (!auth.user || !auth.profile) return

    // Email et Nom toujours synchronisés avec le compte
    email.value = auth.user.email || ''
    fullName.value = auth.profile.full_name || ''

    // Adresse synchronisée seulement si le switch est actif
    if (useProfileAddress.value) {
      address.value = auth.profile.address || ''
      // ✅ Ajout des champs Zip et Ville depuis le profil
      zip.value = auth.profile.zip || ''
      city.value = auth.profile.city || ''
      country.value = auth.profile.country || 'France'
    }
  }

  // 1. Initialisation : Profil ou Sauvegarde locale
  onMounted(() => {
    // On tente de récupérer une sauvegarde locale (cas du refresh)
    const saved = localStorage.getItem('fp-checkout-form')

    if (saved) {
      try {
        const data = JSON.parse(saved)
        // On restaure seulement si les champs ne sont pas vides,
        // ou si l'utilisateur n'est pas connecté (priorité profil si connecté)
        if (!auth.user || !useProfileAddress.value) {
          email.value = data.email || ''
          fullName.value = data.fullName || ''
          address.value = data.address || ''
          zip.value = data.zip || ''
          city.value = data.city || ''
          country.value = data.country || 'France'
        }
      } catch (e) {
        /* ignore */
      }
    }

    // Si connecté et switch actif, on force le profil (écrase le local storage potentiellement obsolète)
    if (auth.user && useProfileAddress.value) {
      fillFromProfile()
    }
  })

  // 2. Surveillance du profil (si chargement asynchrone)
  watchEffect(() => {
    if (auth.user && useProfileAddress.value) {
      fillFromProfile()
    }
  })

  // 3. Gestion du switch ON/OFF
  watch(useProfileAddress, (isUsing) => {
    if (isUsing) {
      fillFromProfile()
      toast.show('Adresse du profil chargée', 'info')
    } else {
      // Si on décoche, on vide l'adresse pour permettre une saisie "Autre"
      // On garde Nom/Email car c'est toujours le même utilisateur
      address.value = ''
      zip.value = ''
      city.value = ''
      country.value = 'France'
    }
  })

  // 4. 🆕 SAUVEGARDE AUTOMATIQUE (Auto-save)
  // Sauvegarde dans le localStorage à chaque frappe pour résister au refresh
  watch(
    [email, fullName, address, zip, city, country],
    () => {
      const dataToSave = {
        email: email.value,
        fullName: fullName.value,
        address: address.value,
        zip: zip.value,
        city: city.value,
        country: country.value,
      }
      localStorage.setItem('fp-checkout-form', JSON.stringify(dataToSave))
    },
    { deep: true },
  )

  // --- Icons ---
  const PayPalIcon = {
    render: () =>
      h('svg', { viewBox: '0 0 48 48', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
        h('circle', { cx: '24', cy: '24', r: '20', fill: '#0070BA' }),
        h('path', {
          d: 'M32.33 18.1C32.31 18.24 32.28 18.39 32.25 18.54C31.27 23.59 27.9 25.33 23.61 25.33H21.42C20.89 25.33 20.45 25.71 20.37 26.23L19.25 33.34L18.93 35.35C18.88 35.69 19.14 36 19.48 36H23.36C23.82 36 24.21 35.67 24.29 35.21L24.32 35.02L25.06 30.38L25.1 30.12C25.17 29.67 25.56 29.33 26.02 29.33H26.61C30.37 29.33 33.31 27.81 34.17 23.39C34.53 21.54 34.34 20 33.39 18.92C33.11 18.59 32.75 18.32 32.33 18.1Z',
          fill: 'white',
          'fill-opacity': '0.6',
        }),
        h('path', {
          d: 'M31.3 17.69C31.15 17.64 31 17.6 30.84 17.57C30.68 17.53 30.51 17.5 30.34 17.47C29.75 17.38 29.11 17.33 28.41 17.33H22.57C22.42 17.33 22.29 17.37 22.16 17.43C21.89 17.56 21.69 17.81 21.65 18.12L20.4 26L20.37 26.23C20.45 25.71 20.89 25.33 21.42 25.33H23.61C27.9 25.33 31.27 23.59 32.25 18.53C32.28 18.39 32.31 18.24 32.33 18.1C32.08 17.97 31.81 17.85 31.52 17.76C31.45 17.73 31.38 17.71 31.3 17.69Z',
          fill: 'white',
          'fill-opacity': '0.8',
        }),
        h('path', {
          d: 'M21.65 18.12C21.69 17.81 21.9 17.56 22.16 17.43C22.29 17.37 22.42 17.33 22.57 17.33H28.41C29.11 17.33 29.75 17.38 30.34 17.48C30.51 17.5 30.68 17.53 30.84 17.57C31 17.6 31.15 17.64 31.3 17.69C31.38 17.71 31.45 17.73 31.52 17.76C31.81 17.85 32.08 17.97 32.33 18.1C32.62 16.23 32.33 14.96 31.32 13.81C30.21 12.54 28.2 12 25.63 12H18.17C17.64 12 17.2 12.38 17.12 12.9L14.01 32.6C13.95 32.99 14.25 33.34 14.64 33.34H19.25L20.4 26L21.65 18.12Z',
          fill: 'white',
        }),
      ]),
  }
  const StripeIcon = {
    render: () =>
      h('svg', { viewBox: '10 4 28 28', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
        h('path', {
          d: 'M19.5 12.5C19.5 10.8 21.2 9.5 23.5 9.5C25.5 9.5 27.2 10.2 28.5 11.1L29.9 6.9C28.2 6.1 26 5.5 23.5 5.5C17.5 5.5 13.5 9 13.5 13.6C13.5 20.6 23.2 21.3 23.2 24.6C23.2 26.1 21.8 27 19.5 27C17 27 15 25.9 13.8 25L12.2 29.5C14.1 30.5 16.8 31 19.5 31C26 31 30 27.5 30 22.6C30 15.6 19.5 14.9 19.5 12.5Z',
          fill: '#635BFF',
        }),
      ]),
  }

  const FREE_SHIPPING_THRESHOLD = 100
  const FLAT_SHIPPING_RATE = 9.9
  const cartSubtotal = computed(() => cart.totalPrice)
  const shippingCost = computed(() =>
    cartSubtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE,
  )
  const finalTotal = computed(() => cartSubtotal.value + shippingCost.value)

  const paymentMethods = [
    {
      label: 'Carte bancaire (Stripe)',
      value: 'stripe',
      desc: 'Paiement sécurisé via Stripe',
      icon: StripeIcon,
    },
    {
      label: 'PayPal',
      value: 'paypal',
      desc: 'Payer avec votre compte PayPal ou carte',
      icon: PayPalIcon,
    },
  ]
  const selectedPayment = ref<PaymentProvider>('paypal')

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

  function openProductModal(productId?: string, event?: MouseEvent) {
    if (!productId || !event) return
    const target = event.currentTarget as HTMLElement
    if (target) {
      target.style.opacity = '0.6'
      setTimeout(() => (target.style.opacity = '1'), 200)
    }
    setTimeout(() => {
      selectedProductId.value = productId
      isModalVisible.value = true
    }, 150)
  }

  async function submitOrder() {
    await withSablier(async () => {
      // Validation
      if (!cart.items.length) {
        toast.show('Votre panier est vide.', 'warning')
        return
      }
      if (!email.value || !fullName.value || !address.value || !zip.value || !city.value) {
        toast.show('Veuillez remplir toutes les coordonnées.', 'warning')
        return
      }

      try {
        const orderItemsPayload = cart.items.map((item) => ({
          product_id: item.product_id!,
          quantity: item.quantity ?? 1,
          product_price: item.is_on_sale
            ? (item.product_sale_price ?? 0)
            : (item.product_price ?? 0),
        }))

        const orderResponse = await createOrder({
          userId: auth.user?.id ?? null,
          email: email.value,
          fullName: fullName.value,
          address: address.value,
          zip: zip.value,
          city: city.value,
          country: country.value,
          paymentMethod: selectedPayment.value,
          subtotal: cartSubtotal.value,
          shippingCost: shippingCost.value,
          taxAmount: 0,
          discountAmount: 0,
          totalAmount: finalTotal.value,
          items: orderItemsPayload,
        })

        if (orderResponse.tracking_token) {
          localStorage.setItem('fp-last-order-token', orderResponse.tracking_token)
        }
        localStorage.setItem('fp-last-order-id', orderResponse.order_id)

        // Une fois la commande validée, on vide le formulaire de secours
        localStorage.removeItem('fp-checkout-form')

        await processPayment(
          finalTotal.value,
          selectedPayment.value,
          email.value,
          orderResponse.order_id,
        )
      } catch (err: any) {
        console.error(err)
        toast.show(`Erreur : ${err.message || 'Impossible de créer la commande'}`, 'danger')
      }
    })
  }
</script>

<style scoped lang="less">
  .checkout-page {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 30px 20px;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;

    .card-shadow(@shadow) {
      box-shadow: @shadow;
      transition: all 0.25s ease;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .checkout-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 18px;
      padding: 28px;
      .card-shadow(0 4px 16px rgba(0, 0, 0, 0.04));

      &__header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid @neutral-100;
        flex-wrap: wrap;
        gap: 10px;
      }

      &__title {
        color: @neutral-900;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid @neutral-100;

        &.mb-0 {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
      }
    }

    .checkout-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .checkout-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: white;
      border-radius: 12px;
      border: 1px solid @neutral-200;
      transition: border-color 0.2s;

      &:hover {
        border-color: var(--primary-200);
      }

      &__left {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      &__img {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        object-fit: cover;
        border: 1px solid @neutral-100;
        flex-shrink: 0;
      }
      &__info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      &__name-trigger {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: opacity 0.2s;
        &:hover .checkout-item__name {
          color: var(--primary-600);
        }
      }
      &__name {
        font-size: 15px;
        color: @neutral-800;
      }
      &__icon {
        color: @neutral-400;
      }
      &__dosage {
        margin-top: -2px;
      }
      &__details {
        font-size: 13px;
        color: @neutral-500;
        display: flex;
        gap: 6px;
        align-items: baseline;
      }
      &__unit-price {
        display: flex;
        gap: 6px;
        .price-striked {
          text-decoration: line-through;
          color: @neutral-400;
          font-size: 0.9em;
        }
        .price-sale {
          color: @danger-600;
          font-weight: 600;
        }
      }
      &__total {
        font-size: 15px;
        color: @neutral-900;
      }
    }

    .checkout-summary {
      background: @neutral-50;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      &__row {
        display: flex;
        justify-content: space-between;
        font-size: 15px;
        &.total {
          margin-top: 6px;
          align-items: center;
        }
      }
      &__divider {
        height: 1px;
        background: @neutral-200;
        margin: 4px 0;
      }
    }

    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 16px;

      &__divider {
        height: 1px;
        background: @neutral-100;
        margin: 4px 0;
      }

      &__row {
        display: flex;
        gap: 16px;
        @media (max-width: 600px) {
          flex-direction: column;
        }
      }
    }

    /* Toggle Switch Style (si BasicCheckbox ne suffit pas, on peut customiser) */
    .checkout-profile-toggle {
      display: flex;
      align-items: center;
      background: @neutral-50;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid @neutral-200;
    }

    .checkout-payment__methods {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .payment-method {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        border-color: var(--primary-300);
        background: var(--primary-50);
      }
      &--active {
        border-color: var(--primary-500);
        background: var(--primary-50);
        box-shadow: 0 0 0 2px rgba(var(--primary-500-rgb), 0.1);
        .radio-circle {
          border-color: var(--primary-600);
          &::after {
            transform: scale(1);
          }
        }
      }
      &__icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: @neutral-100;
        border-radius: 8px;
        margin-right: 16px;
        svg {
          width: 24px;
          height: 24px;
        }
      }
      &__info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      &__radio {
        .radio-circle {
          width: 20px;
          height: 20px;
          border: 2px solid @neutral-300;
          border-radius: 50%;
          position: relative;
          transition: all 0.2s;
          &::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 10px;
            height: 10px;
            background: var(--primary-600);
            border-radius: 50%;
            transform: scale(0);
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
      }
    }

    .checkout-submit-btn {
      margin-top: 10px;
      box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.3);
      &:hover:not(:disabled) {
        box-shadow: 0 6px 16px rgba(var(--primary-500-rgb), 0.4);
        transform: translateY(-2px);
      }
    }

    @media (max-width: 600px) {
      padding: 20px 16px;
      .checkout-card {
        padding: 20px;
      }
      .checkout-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        &__left {
          width: 100%;
        }
        &__total {
          align-self: flex-end;
        }
      }
    }
  }
</style>
