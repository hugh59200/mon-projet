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
                    <template v-else>
                      {{ formatPrice(item.product_price) }}
                    </template>
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
        <BasicText
          size="h4"
          weight="bold"
          class="checkout-card__title"
        >
          Adresse de livraison
        </BasicText>

        <div class="checkout-form">
          <BasicInput
            v-model="fullName"
            label="Nom complet"
            input-type="form"
            placeholder="Prénom et Nom"
          />
          <BasicInput
            v-model="address"
            label="Adresse"
            input-type="form"
            placeholder="N° et nom de rue"
          />
          <div class="checkout-form__row">
            <BasicInput
              v-model="zip"
              label="Code postal"
              input-type="form"
              placeholder="Ex: 75001"
            />
            <BasicInput
              v-model="city"
              label="Ville"
              input-type="form"
              placeholder="Ex: Paris"
            />
          </div>
          <BasicInput
            v-model="country"
            label="Pays"
            input-type="form"
            placeholder="France"
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
            <div class="payment-method__icon">
              <component :is="method.icon" />
            </div>
            <div class="payment-method__info">
              <BasicText weight="bold">{{ method.label }}</BasicText>
              <BasicText
                size="body-s"
                color="neutral-500"
              >
                {{ method.desc }}
              </BasicText>
            </div>
            <div class="payment-method__radio">
              <div class="radio-circle"></div>
            </div>
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
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, h, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const auth = useAuthStore()
  const cart = useCartStore()
  const toast = useToastStore()
  const router = useRouter()
  const { withSablier } = useManualSablier()

  const fullName = ref(auth.profile?.full_name || '')
  const address = ref('')
  const zip = ref('')
  const city = ref('')
  const country = ref('France')

  const isModalVisible = ref(false)
  const selectedProductId = ref<string | null>(null)

  // --- 🎨 ICÔNES CUSTOM ---
  const PayPalIcon = {
    render: () =>
      h('svg', { viewBox: '0 0 48 48', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
        h('circle', { cx: '24', cy: '24', r: '20', fill: '#0070BA' }),
        h('path', {
          d: 'M32.3305 18.0977C32.3082 18.24 32.2828 18.3856 32.2542 18.5351C31.2704 23.5861 27.9046 25.331 23.606 25.331H21.4173C20.8916 25.331 20.4486 25.7127 20.3667 26.2313L19.2461 33.3381L18.9288 35.3527C18.8755 35.693 19.1379 36 19.4815 36H23.3634C23.8231 36 24.2136 35.666 24.286 35.2127L24.3241 35.0154L25.055 30.3772L25.1019 30.1227C25.1735 29.6678 25.5648 29.3338 26.0245 29.3338H26.6051C30.3661 29.3338 33.3103 27.8068 34.1708 23.388C34.5303 21.5421 34.3442 20.0008 33.393 18.9168C33.1051 18.59 32.748 18.3188 32.3305 18.0977Z',
          fill: 'white',
          'fill-opacity': '0.6',
        }),
        h('path', {
          d: 'M31.3009 17.6871C31.1506 17.6434 30.9955 17.6036 30.8364 17.5678C30.6766 17.5328 30.5127 17.5018 30.3441 17.4748C29.754 17.3793 29.1074 17.334 28.4147 17.334H22.5676C22.4237 17.334 22.2869 17.3666 22.1644 17.4254C21.8948 17.5551 21.6944 17.8104 21.6459 18.1229L20.402 26.0013L20.3662 26.2311C20.4481 25.7126 20.8911 25.3308 21.4168 25.3308H23.6055C27.9041 25.3308 31.2699 23.5851 32.2537 18.5349C32.2831 18.3854 32.3078 18.2398 32.33 18.0975C32.0811 17.9655 31.8115 17.8525 31.5212 17.7563C31.4496 17.7324 31.3757 17.7094 31.3009 17.6871Z',
          fill: 'white',
          'fill-opacity': '0.8',
        }),
        h('path', {
          d: 'M21.6461 18.1231C21.6946 17.8105 21.895 17.5552 22.1646 17.4264C22.2879 17.3675 22.4239 17.3349 22.5678 17.3349H28.4149C29.1077 17.3349 29.7542 17.3803 30.3444 17.4757C30.513 17.5027 30.6768 17.5338 30.8367 17.5687C30.9957 17.6045 31.1508 17.6443 31.3011 17.688C31.3759 17.7103 31.4498 17.7334 31.5222 17.7564C31.8125 17.8527 32.0821 17.9664 32.331 18.0976C32.6237 16.231 32.3287 14.9601 31.3194 13.8093C30.2068 12.5424 28.1986 12 25.629 12H18.169C17.6441 12 17.1963 12.3817 17.1152 12.9011L14.0079 32.5969C13.9467 32.9866 14.2473 33.3381 14.6402 33.3381H19.2458L20.4022 26.0014L21.6461 18.1231Z',
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

  // --- 💰 LOGIQUE FINANCIÈRE ---
  const FREE_SHIPPING_THRESHOLD = 100
  const FLAT_SHIPPING_RATE = 9.9

  const cartSubtotal = computed(() => cart.totalPrice)

  const shippingCost = computed(() => {
    return cartSubtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE
  })

  const finalTotal = computed(() => {
    return cartSubtotal.value + shippingCost.value
  })

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

  // ✅ Helper pour calculer le total ligne (avec prix promo si applicable)
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
    if (!target) return

    target.style.opacity = '0.6'
    setTimeout(() => (target.style.opacity = '1'), 200)

    setTimeout(() => {
      selectedProductId.value = productId
      isModalVisible.value = true
    }, 150)
  }

  async function submitOrder() {
    await withSablier(async () => {
      if (!auth.user) {
        toast.show('Veuillez vous connecter.', 'danger')
        router.push('/auth/login')
        return
      }

      if (!cart.items.length) {
        toast.show('Votre panier est vide.', 'warning')
        return
      }

      try {
        // ✅ Payload cohérent V2 : On envoie le prix qui correspond à ce que l'utilisateur voit
        const orderItemsPayload = cart.items.map((item) => ({
          product_id: item.product_id!,
          quantity: item.quantity ?? 1,
          product_price: item.is_on_sale
            ? (item.product_sale_price ?? 0)
            : (item.product_price ?? 0),
        }))

        const newOrder = await createOrder({
          userId: auth.user.id,
          email: auth.user.email ?? '',
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

        await processPayment(
          finalTotal.value,
          selectedPayment.value,
          auth.user.email,
          newOrder.order_id!,
        )

        if (selectedPayment.value === 'stripe' || selectedPayment.value === 'paypal') {
          return
        }
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

      &__title {
        margin-bottom: 20px;
        color: @neutral-900;
        padding-bottom: 12px;
        border-bottom: 1px solid @neutral-100;
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
          color: var(--danger-600);
          font-weight: 600;
        }
      }

      &__total {
        font-size: 15px;
        color: @neutral-900;
      }
    }

    // --- RÉSUMÉ ---
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

    // --- 2. FORMULAIRE ---
    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 16px;

      &__row {
        display: flex;
        gap: 16px;
        @media (max-width: 600px) {
          flex-direction: column;
        }
      }
    }

    // --- 3. PAIEMENT ---
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

    // --- BOUTON ---
    .checkout-submit-btn {
      margin-top: 10px;
      box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.3);

      &:hover:not(:disabled) {
        box-shadow: 0 6px 16px rgba(var(--primary-500-rgb), 0.4);
        transform: translateY(-2px);
      }
    }

    // --- RESPONSIVE ---
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
