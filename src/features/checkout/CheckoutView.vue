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
              class="product-name-wrapper"
              @click="openProductModal(item.product_id!, $event)"
            >
              <BasicText
                weight="bold"
                class="product-name clickable"
              >
                {{ item.product_name }}
              </BasicText>
              <BasicIconNext
                name="Search"
                :size="16"
                class="product-search-icon"
              />
            </div>
            <div class="product-line">
              <span>{{ item.quantity ?? 1 }} ×</span>
              <span class="product-price">{{ (item.product_price ?? 0).toFixed(2) }} €</span>
            </div>
          </div>
        </div>
        <BasicText
          weight="bold"
          class="checkout__item-price"
        >
          {{ ((item.product_price ?? 0) * (item.quantity ?? 1)).toFixed(2) }} €
        </BasicText>
      </div>
      <div class="checkout__total">
        <BasicText
          size="h5"
          weight="bold"
        >
          Total :
        </BasicText>
        <BasicText
          size="h5"
          weight="bold"
          color="primary-600"
        >
          {{ cart.totalPrice.toFixed(2) }} €
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
          class="checkout__method"
          :class="{ active: selectedPayment === method.value }"
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
      label="Valider la commande"
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
    finalizeOrderAfterPayment,
    processPayment,
    type PaymentProvider,
  } from '@/features/checkout/paiement/service/paymentService'
  import { useManualSablier } from '@/features/interface/sablier/useManualSablier'
  import { supabase } from '@/supabase/supabaseClient'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { Bitcoin, CreditCard, TestTube } from 'lucide-vue-next'
  import { ref } from 'vue'
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

  const paymentMethods = [
    {
      label: 'Carte bancaire (Stripe)',
      value: 'stripe',
      desc: 'Paiement sécurisé par carte via Stripe',
      icon: CreditCard,
    },
    {
      label: 'Crypto-monnaie',
      value: 'crypto',
      desc: 'Payer avec Bitcoin, Ethereum ou USDT',
      icon: Bitcoin,
    },
    {
      label: 'Paiement simulé (test)',
      value: 'simulation',
      desc: 'Aucun paiement réel, pour test uniquement',
      icon: TestTube,
    },
  ]

  const selectedPayment = ref<PaymentProvider>('simulation')

  function openProductModal(productId?: string, event?: MouseEvent) {
    if (!productId || !event) return
    const target = event.currentTarget as HTMLElement
    if (!target) return

    const ripple = document.createElement('span')
    ripple.className = 'ripple'
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
        const { data, error } = await supabase.rpc('create_order_with_items', {
          p_user_id: auth.user.id,
          p_email: auth.user.email ?? '',
          p_full_name: fullName.value || '',
          p_address: address.value,
          p_zip: zip.value,
          p_city: city.value,
          p_country: country.value,
          p_payment_method: selectedPayment.value,
          p_total_amount: cart.totalPrice,
          p_items: cart.items,
        })

        if (error || !data) throw error
        const orderId = data

        const payment = await processPayment(
          cart.totalPrice,
          selectedPayment.value,
          auth.user.email,
          orderId,
        )

        if (selectedPayment.value === 'stripe') {
          return
        }

        await finalizeOrderAfterPayment(orderId, payment.id)
        toast.show('Paiement validé ✅', 'success')

        await cart.clearCart()
        router.push('/profil/commandes')
      } catch (err) {
        console.error(err)
        toast.show('Erreur de commande ❌', 'danger')
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

    &__title {
      text-align: center;
    }

    &__cart,
    &__infos,
    &__payment {
      background: white;
      border: 1px solid @neutral-200;
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      box-shadow: 0 3px 10px fade(@neutral-300, 15%);
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
        border: 1px solid fade(@neutral-300, 40%);
        flex-shrink: 0;
      }

      &-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .product-name-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          position: relative;

          .product-name.clickable {
            color: @primary-700;
            transition: color 0.2s ease;

            &:hover {
              color: @primary-600;
              text-decoration: underline;
            }
          }

          .product-search-icon {
            color: fade(@primary-700, 70%);
            transition: color 0.2s ease;
          }

          &:hover .product-search-icon {
            color: @primary-600;
          }
        }

        .product-line {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: fade(@neutral-600, 90%);
        }

        .product-price {
          color: fade(@neutral-500, 80%);
          font-size: 13px;
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
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: fade(@primary-500, 25%);
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

    /* --- TOTAL --- */
    &__total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
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
        border-color: @primary-400;
        background: fade(@primary-50, 40%);
      }

      &.active {
        border-color: @primary-600;
        background: fade(@primary-100, 60%);
        box-shadow: 0 2px 8px fade(@primary-400, 25%);
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
          width: 18px;
          height: 18px;
          color: @primary-700;
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
      box-shadow: 0 3px 10px fade(@primary-400, 25%);
      font-weight: 600;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px fade(@primary-500, 30%);
      }

      &:active {
        transform: scale(0.98);
        box-shadow: 0 2px 6px fade(@primary-500, 25%);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    /* --- Responsive général --- */
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
        box-shadow: 0 -3px 8px rgba(0, 0, 0, 0.05);
      }
    }
  }
</style>
