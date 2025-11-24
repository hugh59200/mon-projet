<template>
  <div class="cart-page">
    <PageHeader />

    <div class="cart-page__body">
      <div
        v-if="cart.items.length === 0"
        class="cart-page__empty"
        v-motion="{
          initial: { opacity: 0, scale: 0.95 },
          enter: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 12 } },
        }"
      >
        <div class="cart-page__empty-icon">🛍️</div>
        <BasicText
          size="h3"
          weight="semibold"
          color="neutral-900"
        >
          Votre panier est vide
        </BasicText>
        <BasicText
          size="body-m"
          color="neutral-600"
          style="max-width: 400px; margin: 0 auto"
        >
          Il semble que vous n'ayez pas encore ajouté de produits. Explorez notre catalogue pour
          trouver ce dont vous avez besoin.
        </BasicText>
        <BasicButton
          label="Découvrir le catalogue"
          type="primary"
          variant="filled"
          size="medium"
          class="mt-4"
          @click="$router.push('/catalogue')"
        />
      </div>

      <div
        v-else
        class="cart-page__grid"
      >
        <div class="cart-page__items">
          <CartItemRow
            v-for="(item, index) in cart.items"
            :item="item"
            @view="viewProduct"
            v-motion="{
              initial: { opacity: 0, y: 20 },
              enter: {
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.05, type: 'spring', stiffness: 100 },
              },
            }"
          />
        </div>

        <aside class="cart-page__summary-wrapper">
          <div
            class="cart-summary"
            v-motion="{
              initial: { opacity: 0, x: 20 },
              enter: { opacity: 1, x: 0, transition: { delay: 0.2, type: 'spring' } },
            }"
          >
            <BasicText
              size="h4"
              weight="bold"
              color="neutral-900"
              class="cart-summary__title"
            >
              Résumé
            </BasicText>

            <div class="cart-summary__content">
              <div class="summary-line">
                <BasicText color="neutral-600">Articles ({{ cart.totalItems }})</BasicText>
                <BasicText weight="semibold">{{ formatPrice(cart.totalPrice) }}</BasicText>
              </div>

              <div class="summary-line">
                <BasicText color="neutral-600">Livraison estimée</BasicText>
                <BasicText
                  weight="semibold"
                  :color="shippingCost === 0 ? 'success-600' : 'neutral-900'"
                >
                  {{ shippingCost === 0 ? 'Offerte' : formatPrice(shippingCost) }}
                </BasicText>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-line total">
                <BasicText
                  size="body-l"
                  weight="bold"
                  color="neutral-900"
                >
                  Total
                </BasicText>
                <BasicText
                  size="h4"
                  weight="bold"
                  color="primary-600"
                >
                  {{ formatPrice(cart.totalPrice + shippingCost) }}
                </BasicText>
              </div>

              <BasicButton
                label="Procéder au paiement"
                type="primary"
                variant="filled"
                size="large"
                width="full"
                class="checkout-btn"
                :disabled="cart.items.length === 0"
                @click="$router.push('/checkout')"
              />

              <div class="cart-summary__secure">
                <span>🔒 Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CartItemRow from '@/features/catalogue/cart/CartItemRow.vue'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const cart = useCartStore()
  const router = useRouter()

  function viewProduct(id: string) {
    if (id) router.push(`/catalogue/${id}`)
  }

  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
      Number(value),
    )
  }

  // --- Logique Livraison ---
  const FREE_SHIPPING_THRESHOLD = 100
  const FLAT_SHIPPING_RATE = 9.9

  // Si le total (promo incluse) dépasse 100€, livraison offerte
  const shippingCost = computed(() => {
    return cart.totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE
  })
</script>

<style scoped lang="less">
  .cart-page {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;

    // Mixin ombres
    .card-shadow(@shadow) {
      box-shadow: @shadow;
      transition: all 0.25s ease;
    }

    // --- EMPTY STATE ---
    &__empty {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 20px;
      border: 1px solid @neutral-200;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      .card-shadow(0 4px 12px rgba(0, 0, 0, 0.03));

      &-icon {
        font-size: 48px;
        margin-bottom: 8px;
      }
    }

    // --- GRID LAYOUT ---
    &__grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 32px;
      align-items: start;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    &__items {
      display: flex;
      flex-direction: column;
      gap: 16px; // Espacement entre les lignes
    }

    // --- SUMMARY CARD ---
    .cart-summary {
      background: white;
      border-radius: 16px;
      border: 1px solid @neutral-200;
      padding: 24px;
      position: sticky;
      top: 100px;
      .card-shadow(0 8px 24px rgba(0, 0, 0, 0.06));

      &__title {
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid @neutral-100;
      }

      &__content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .summary-line {
        display: flex;
        justify-content: space-between;
        font-size: 15px;

        &.total {
          margin-top: 8px;
          align-items: center;
        }
      }

      .summary-divider {
        height: 1px;
        background: @neutral-200;
        margin: 4px 0;
      }

      .checkout-btn {
        margin-top: 16px;
        box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.3);

        &:hover {
          box-shadow: 0 6px 16px rgba(var(--primary-500-rgb), 0.4);
        }
      }

      &__secure {
        text-align: center;
        margin-top: 12px;
        font-size: 13px;
        color: @neutral-500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
    }

    // --- MOBILE ---
    @media (max-width: 600px) {
      padding: 20px 16px;
    }
  }
</style>
