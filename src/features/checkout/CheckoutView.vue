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
    finalizeOrderAfterPayment,
    processPayment,
    type PaymentProvider,
  } from '@/features/checkout/paiement/service/paymentService'
  import { useManualSablier } from '@/features/interface/sablier/useManualSablier'
  import { createOrder } from '@/supabase/api/ordersApi' // ✅ IMPORT V2
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { CreditCard } from 'lucide-vue-next'
  import { computed, ref } from 'vue'
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

  // --- 💰 LOGIQUE FINANCIÈRE V2.0 ---

  // 1. Seuil livraison gratuite (ex: 100€)
  const FREE_SHIPPING_THRESHOLD = 100
  const FLAT_SHIPPING_RATE = 9.9

  // 2. Sous-total (Somme des produits)
  const cartSubtotal = computed(() => cart.totalPrice)

  // 3. Frais de port calculés
  const shippingCost = computed(() => {
    return cartSubtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE
  })

  // 4. Total Final à payer
  const finalTotal = computed(() => {
    return cartSubtotal.value + shippingCost.value
  })

  // ----------------------------------

  const paymentMethods = [
    {
      label: 'Carte bancaire (Stripe)',
      value: 'stripe',
      desc: 'Paiement sécurisé via Stripe',
      icon: CreditCard,
    },
    {
      label: 'PayPal',
      value: 'paypal',
      desc: 'Payer avec votre compte PayPal ou carte',
      icon: CreditCard,
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
    // ... (ripple effect identique à ton code original) ...
    selectedProductId.value = productId
    isModalVisible.value = true
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

      if (!address.value || !zip.value || !city.value || !fullName.value) {
        toast.show("Veuillez compléter l'adresse de livraison.", 'warning')
        return
      }

      try {
        // 2. Préparation du payload pour l'API V2
        // On mappe les items pour correspondre strictement à ce que l'API attend
        const orderItemsPayload = cart.items.map((item) => ({
          product_id: item.product_id!,
          quantity: item.quantity ?? 1,
          product_price: item.product_price ?? 0, // Prix snapshot
        }))

        // 3. Appel API centralisé (createOrder)
        // Cela va créer la commande, les lignes produits (avec snapshots) et gérer le stock
        const newOrder = await createOrder({
          userId: auth.user.id,
          email: auth.user.email ?? '',
          fullName: fullName.value,
          address: address.value,
          zip: zip.value,
          city: city.value,
          country: country.value,
          paymentMethod: selectedPayment.value,

          // Données financières calculées
          subtotal: cartSubtotal.value,
          shippingCost: shippingCost.value,
          taxAmount: 0, // Si tu gères la TVA, calcule-la ici (ex: subtotal * 0.20)
          discountAmount: 0, // Si tu as un système de coupon
          totalAmount: finalTotal.value,

          items: orderItemsPayload,
        })

        // 4. Traitement du Paiement
        // On utilise l'ID de la commande fraîchement créée
        const payment = await processPayment(
          finalTotal.value, // On paie le total final (incluant livraison)
          selectedPayment.value,
          auth.user.email,
          newOrder.order_id!, // ID de la vue ou ID de la table
        )

        if (selectedPayment.value === 'stripe') {
          // Stripe redirige généralement, donc on s'arrête là
          return
        }

        // 5. Finalisation (PayPal ou autre flux direct)
        await finalizeOrderAfterPayment(
          newOrder.order_id!,
          payment.id,
          selectedPayment.value, // <--- C'est ce qu'il manquait !
        )

        toast.show('Commande validée avec succès ! 🎉', 'success')
        await cart.clearCart()
        router.push(`/profil/commandes/${newOrder.order_id}`)
      } catch (err: any) {
        console.error(err)
        toast.show(`Erreur : ${err.message || 'Impossible de créer la commande'}`, 'danger')
      }
    })
  }
</script>

<style scoped lang="less">
  /* Style identique à l'original, j'ai juste ajouté le style pour le résumé financier */
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
          width: 18px;
          height: 18px;
          color: var(--primary-700);
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
