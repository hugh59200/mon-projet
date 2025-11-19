<template>
  <div class="checkout">
    <BasicText
      size="h4"
      weight="bold"
      class="checkout__title"
    >
      Paiement de votre commande
    </BasicText>

    <div class="checkout__cart">
      <BasicText
        size="h5"
        weight="bold"
      >
        Résumé du panier
      </BasicText>

      <div
        v-for="item in cart.items"
        :key="item.cart_item_id!"
        class="checkout__item"
      >
        <div class="checkout__item-left">
          <img
            :src="item.product_image || defaultImage"
            :alt="item.product_name!"
            class="checkout__item-img"
          />
          <div class="checkout__item-info">
            <div
              class="checkout__item-name-trigger"
              @click="openProductModal(item.product_id!, $event)"
            >
              <BasicText
                weight="bold"
                class="checkout__item-name checkout__item-name--interactive"
              >
                {{ item.product_name }}
              </BasicText>
              <BasicIconNext
                name="Search"
                :size="16"
                class="checkout__item-name-icon"
              />
            </div>
            <div class="checkout__item-line">
              <span>{{ item.quantity ?? 1 }} ×</span>
              <span class="checkout__item-line-price">
                {{ formatPrice(item.product_price) }}
              </span>
            </div>
          </div>
        </div>
        <BasicText
          weight="bold"
          class="checkout__item-price"
        >
          {{ formatPrice((item.product_price ?? 0) * (item.quantity ?? 1)) }}
        </BasicText>
      </div>

      <div class="checkout__summary">
        <div class="checkout__summary-row">
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
        <div class="checkout__summary-row">
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
      </div>

      <div class="checkout__total">
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

    <div class="checkout__infos">
      <BasicText
        size="h5"
        weight="bold"
      >
        Adresse de livraison
      </BasicText>

      <div class="checkout__form">
        <BasicInput
          v-model="fullName"
          label="Nom complet"
          input-type="form"
          placeholder="Votre nom complet"
        />
        <BasicInput
          v-model="address"
          label="Adresse"
          input-type="form"
          placeholder="Adresse complète"
        />
        <div class="checkout__row">
          <BasicInput
            v-model="zip"
            label="Code postal"
            input-type="form"
            placeholder="59000"
          />
          <BasicInput
            v-model="city"
            label="Ville"
            input-type="form"
            placeholder="Lille"
          />
        </div>
        <BasicInput
          v-model="country"
          label="Pays"
          input-type="form"
          placeholder="France"
        />
      </div>
    </div>

    <div class="checkout__payment">
      <BasicText
        size="h5"
        weight="bold"
      >
        Méthode de paiement
      </BasicText>

      <div class="checkout__methods">
        <div
          v-for="method in paymentMethods"
          :key="method.value"
          :class="[
            'checkout__method',
            { 'checkout__method--active': selectedPayment === method.value },
          ]"
          @click="selectedPayment = method.value as PaymentProvider"
        >
          <div class="checkout__method-icon">
            <component :is="method.icon" />
          </div>
          <div class="checkout__method-info">
            <BasicText weight="bold">{{ method.label }}</BasicText>
            <BasicText
              size="body-s"
              color="neutral-500"
            >
              {{ method.desc }}
            </BasicText>
          </div>
        </div>
      </div>
    </div>

    <BasicButton
      label="Valider et payer"
      type="primary"
      variant="filled"
      width="full"
      size="large"
      class="checkout__submit"
      :disabled="cart.items.length === 0"
      @click="submitOrder"
    />

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
  import {
    processPayment,
    type PaymentProvider,
  } from '@/features/checkout/paiement/service/paymentService'
  import { useManualSablier } from '@/features/interface/sablier/useManualSablier'
  import { createOrder } from '@/supabase/api/ordersApi' // ✅ IMPORT V2
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, h, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import ProductModalCheckout from './modale/ProductModalCheckout.vue'

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

  // 1. PayPal (Ton SVG)
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

  // 2. Stripe (Version Zoomée pour alignement optique)
  const StripeIcon = {
    // 🔍 Modification ici : viewBox "10 4 28 28" au lieu de "0 0 48 48"
    render: () =>
      h('svg', { viewBox: '10 4 28 28', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
        h('path', {
          d: 'M19.5 12.5C19.5 10.8 21.2 9.5 23.5 9.5C25.5 9.5 27.2 10.2 28.5 11.1L29.9 6.9C28.2 6.1 26 5.5 23.5 5.5C17.5 5.5 13.5 9 13.5 13.6C13.5 20.6 23.2 21.3 23.2 24.6C23.2 26.1 21.8 27 19.5 27C17 27 15 25.9 13.8 25L12.2 29.5C14.1 30.5 16.8 31 19.5 31C26 31 30 27.5 30 22.6C30 15.6 19.5 14.9 19.5 12.5Z',
          fill: '#635BFF',
        }),
      ]),
  }

  // --- 💰 LOGIQUE FINANCIÈRE V2.0 ---
  const FREE_SHIPPING_THRESHOLD = 100
  const FLAT_SHIPPING_RATE = 9.9

  const cartSubtotal = computed(() => cart.totalPrice)

  const shippingCost = computed(() => {
    return cartSubtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE
  })

  const finalTotal = computed(() => {
    return cartSubtotal.value + shippingCost.value
  })

  // ----------------------------------

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

  function openProductModal(productId?: string, event?: MouseEvent) {
    if (!productId || !event) return
    const target = event.currentTarget as HTMLElement
    if (!target) return

    const ripple = document.createElement('span')
    ripple.className = 'checkout__ripple'
    ripple.style.left = `${event.offsetX}px`
    ripple.style.top = `${event.offsetY}px`
    target.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)

    setTimeout(() => {
      selectedProductId.value = productId
      isModalVisible.value = true
    }, 150)
  }

  async function submitOrder() {
    await withSablier(async () => {
      // 1. Validations de base
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
        // 2. Préparation du payload pour l'API V2
        const orderItemsPayload = cart.items.map((item) => ({
          product_id: item.product_id!,
          quantity: item.quantity ?? 1,
          product_price: item.product_price ?? 0,
        }))

        // 3. Appel API centralisé (createOrder)
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

        // 4. Traitement du Paiement
        await processPayment(
          finalTotal.value,
          selectedPayment.value,
          auth.user.email,
          newOrder.order_id!,
        )

        // 🛑 STOP IMPÉRATIF POUR REDIRECTION (Stripe/PayPal)
        // On ne veut pas de code après qui redirige localement
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
  .checkout {
    max-width: 800px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 20px 100px;
    box-sizing: border-box;

    > div {
      background: color-mix(in srgb, @neutral-200 82%, transparent);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid color-mix(in srgb, @neutral-300 40%, transparent);
      box-shadow:
        0 4px 14px color-mix(in srgb, @neutral-900 6%, transparent),
        inset 0 0 0 1px color-mix(in srgb, @neutral-50 45%, transparent);
    }

    &__title {
      text-align: center;
    }

    &__cart,
    &__infos,
    &__payment {
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* --- ITEMS --- */
    &__item {
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid @neutral-100;
      padding: 12px 16px;
      border-radius: 8px;
      transition: all 0.25s ease;

      &-left {
        display: flex;
        align-items: center;
        gap: 14px;
        flex: 1;
        min-width: 0;
      }

      &-img {
        width: 58px;
        height: 58px;
        object-fit: cover;
        border-radius: 10px;
        border: 1px solid color-mix(in srgb, @neutral-300 40%, transparent);
        flex-shrink: 0;
      }

      &-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .checkout__item-name-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          position: relative;

          .checkout__item-name {
            color: @neutral-700;
            transition: color 0.2s ease;

            &--interactive:hover {
              text-decoration: underline;
            }
          }
          .checkout__item-name-icon {
            color: color-mix(in srgb, @neutral-700 70%, transparent);
            transition: color 0.2s ease;
          }
          &:hover .checkout__item-name-icon {
            color: @neutral-600;
          }
        }

        .checkout__item-line {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: color-mix(in srgb, @neutral-600 90%, transparent);

          &-price {
            color: color-mix(in srgb, @neutral-500 80%, transparent);
            font-size: 13px;
          }
        }
      }

      &-price {
        width: 80px;
        text-align: right;
        font-weight: 600;
        color: @neutral-900;
        font-size: 14px;
      }
    }

    /* 🌊 Effet ripple au clic */
    &__ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(var(--primary-500-rgb), 0.25);
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      width: 150px;
      height: 150px;
      pointer-events: none;
      opacity: 0.8;
    }

    @keyframes ripple {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }

    /* ✅ NOUVEAU : Résumé Financier */
    &__summary {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 0;
      border-bottom: 1px solid @neutral-100;

      &-row {
        display: flex;
        justify-content: space-between;
        padding: 0 16px;
      }
    }

    /* --- TOTAL --- */
    &__total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px 0 16px;
    }

    /* --- FORMULAIRE --- */
    &__form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__row {
      display: flex;
      gap: 12px;
      @media (max-width: 700px) {
        flex-direction: column;
      }
    }

    /* --- MÉTHODES DE PAIEMENT --- */
    &__methods {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &__method {
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        border-color: var(--primary-400);
        background: rgba(var(--primary-50-rgb), 0.4);
      }

      &--active {
        border-color: var(--primary-600);
        background: rgba(var(--primary-100-rgb), 0.6);
        box-shadow: 0 2px 8px rgba(var(--primary-400-rgb), 0.25);
      }

      &-icon {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: @neutral-100;
        border-radius: 8px;

        svg {
          width: 20px;
          height: 20px;
        }
      }

      &-info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }
    }

    /* --- BOUTON --- */
    &__submit {
      margin-top: 20px;
      transition: all 0.25s ease-in-out;
      border-radius: 10px;
      box-shadow: 0 3px 10px rgba(var(--primary-400-rgb), 0.25);
      font-weight: 600;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(var(--primary-500-rgb), 0.3);
      }
      &:active {
        transform: scale(0.98);
        box-shadow: 0 2px 6px rgba(var(--primary-500-rgb), 0.25);
      }
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    @media (max-width: 700px) {
      &__cart,
      &__infos,
      &__payment {
        padding: 18px;
        gap: 14px;
      }
      &__item {
        padding: 10px 12px;
        &-img {
          width: 52px;
          height: 52px;
        }
        &-price {
          font-size: 13px;
        }
      }
      &__submit {
        padding: 12px 0;
        font-size: 15px;
      }
    }
  }
</style>
