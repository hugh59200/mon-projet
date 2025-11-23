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
          <div
            v-for="(item, index) in cart.items"
            class="cart-item"
            v-motion="{
              initial: { opacity: 0, y: 20 },
              enter: {
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.05, type: 'spring', stiffness: 100 },
              },
            }"
          >
            <img
              :src="item.product_image || defaultImage"
              :alt="item.product_name!"
              class="cart-item__img"
            />

            <div class="cart-item__content">
              <div class="cart-item__header">
                <BasicText
                  size="body-l"
                  weight="bold"
                  color="neutral-900"
                >
                  {{ item.product_name }}
                </BasicText>
                <BasicText
                  size="body-l"
                  weight="bold"
                  color="neutral-900"
                  class="cart-item__total-price"
                >
                  {{ formatPrice(getItemTotal(item)) }}
                </BasicText>
              </div>

              <div class="cart-item__details">
                <div class="cart-item__unit-price">
                  <template v-if="item.is_on_sale">
                    <span class="old-price">{{ formatPrice(item.product_price) }}</span>
                    <span class="sale-price">{{ formatPrice(item.product_sale_price) }}</span>
                  </template>
                  <template v-else>
                    {{ formatPrice(item.product_price) }}
                  </template>
                  <span class="unit-label">/ unité</span>
                </div>

                <div class="cart-item__actions">
                  <div class="cart-item__quantity">
                    <button
                      class="qty-btn"
                      @click="updateQty(item, -1)"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      :value="item.quantity"
                      @input="
                        (e) =>
                          cart.updateQuantity(
                            item.product_id!,
                            +(e.target as HTMLInputElement).value,
                          )
                      "
                    />
                    <button
                      class="qty-btn"
                      @click="updateQty(item, 1)"
                    >
                      +
                    </button>
                  </div>

                  <BasicButton
                    label="Retirer"
                    type="danger"
                    variant="ghost"
                    size="small"
                    @click="cart.removeFromCart(item.product_id || '')"
                  />
                </div>
              </div>
            </div>
          </div>
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
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import type { CartView } from '@/supabase/types/supabase.types'
  import { computed } from 'vue'

  const cart = useCartStore()

  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
      Number(value),
    )
  }

  function getItemTotal(item: CartView) {
    const price = item.is_on_sale
      ? (item.product_sale_price ?? item.product_price ?? 0)
      : (item.product_price ?? 0)
    return price * (item.quantity ?? 1)
  }

  function updateQty(item: CartView, delta: number) {
    const newQty = (item.quantity || 1) + delta
    if (newQty < 1) return
    cart.updateQuantity(item.product_id!, newQty)
  }

  // --- Logique Livraison ---
  const FREE_SHIPPING_THRESHOLD = 100
  const FLAT_SHIPPING_RATE = 9.9

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
      gap: 20px;
    }

    // --- ITEM CARD ---
    .cart-item {
      display: flex;
      gap: 24px;
      padding: 20px;
      background: white;
      border-radius: 16px;
      border: 1px solid @neutral-200;
      .card-shadow(0 2px 8px rgba(0, 0, 0, 0.04));
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--primary-200);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }

      &__img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 12px;
        border: 1px solid @neutral-100;
        flex-shrink: 0;
      }

      &__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      &__details {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: wrap;
        gap: 16px;
      }

      &__unit-price {
        font-size: 14px;
        color: @neutral-600;

        .old-price {
          text-decoration: line-through;
          margin-right: 6px;
          opacity: 0.7;
        }
        .sale-price {
          color: @danger-600;
          font-weight: 600;
          margin-right: 4px;
        }
      }

      &__actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      &__quantity {
        display: flex;
        align-items: center;
        border: 1px solid @neutral-300;
        border-radius: 8px;
        overflow: hidden;
        height: 36px;
        background: @neutral-50;

        input {
          width: 44px;
          text-align: center;
          border: none;
          outline: none;
          background: transparent;
          font-weight: 600;
          color: @neutral-900;
          -moz-appearance: textfield;
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        }

        .qty-btn {
          width: 32px;
          height: 100%;
          border: none;
          background: transparent;
          color: @neutral-600;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;

          &:hover {
            background: @neutral-200;
            color: var(--primary-600);
          }
        }
      }
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

      .cart-item {
        flex-direction: column;
        gap: 16px;

        &__header {
          flex-direction: column;
          gap: 4px;
        }

        &__img {
          width: 100%;
          height: 140px;
        }

        &__details {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        &__actions {
          width: 100%;
          justify-content: space-between;
        }
      }
    }
  }
</style>
