<template>
  <div class="cart">
    <BasicText
      size="h3"
      weight="bold"
      class="cart__title"
    >
      Mon panier
    </BasicText>

    <div
      v-if="cart.items.length === 0"
      class="cart__empty"
    >
      <BasicText>Aucun produit dans votre panier.</BasicText>
      <BasicButton
        label="Voir le catalogue"
        type="primary"
        variant="filled"
        size="medium"
        @click="$router.push('/catalogue')"
      />
    </div>

    <div
      v-else
      class="cart__content"
    >
      <div class="cart__items">
        <div
          v-for="item in cart.items"
          class="cart__item"
        >
          <img
            :src="item.product_image || defaultImage"
            :alt="item.product_name!"
            class="cart__item-img"
          />

          <div class="cart__item-info">
            <BasicText weight="bold">{{ item.product_name }}</BasicText>

            <div class="cart__item-price-unit">
              <template v-if="item.is_on_sale">
                <span class="cart__old-price">{{ formatPrice(item.product_price) }}</span>
                <span class="cart__sale-price">{{ formatPrice(item.product_sale_price) }}</span>
              </template>
              <template v-else>
                {{ formatPrice(item.product_price) }}
              </template>
              <span class="text-sm text-neutral-500">/ unité</span>
            </div>

            <div class="cart__item-controls">
              <label>Quantité :</label>
              <input
                type="number"
                min="1"
                :value="item.quantity"
                @input="
                  cart.updateQuantity(
                    item.product_id || '',
                    +($event.target as HTMLInputElement).value,
                  )
                "
              />
              <BasicButton
                label="Supprimer"
                type="danger"
                variant="ghost"
                size="small"
                @click="cart.removeFromCart(item.product_id || '')"
              />
            </div>
          </div>

          <BasicText
            size="body-m"
            weight="bold"
            class="cart__item-total"
          >
            {{ formatPrice(getItemTotal(item)) }}
          </BasicText>
        </div>
      </div>

      <div class="cart__summary">
        <BasicText
          size="h5"
          weight="bold"
        >
          Résumé
        </BasicText>

        <div class="cart__summary-line">
          <BasicText>Total articles :</BasicText>
          <BasicText>{{ cart.totalItems }}</BasicText>
        </div>

        <div class="cart__summary-line">
          <BasicText>Sous-total :</BasicText>
          <BasicText>{{ formatPrice(cart.totalPrice) }}</BasicText>
        </div>

        <div class="cart__summary-line">
          <BasicText>Livraison estimée :</BasicText>
          <BasicText :color="shippingCost === 0 ? 'success-600' : 'neutral-800'">
            {{ shippingCost === 0 ? 'Offerte' : formatPrice(shippingCost) }}
          </BasicText>
        </div>

        <div class="cart__divider"></div>

        <div class="cart__summary-line">
          <BasicText
            size="body-l"
            weight="bold"
          >
            Total à payer :
          </BasicText>
          <BasicText
            size="body-l"
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
          :disabled="cart.items.length === 0"
          @click="$router.push('/checkout')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import type { CartView } from '@/supabase/types/supabase.types'
  import { computed } from 'vue'

  const cart = useCartStore()

  // --- Helpers V2 ---

  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
      Number(value),
    )
  }

  // Calcul du total d'une ligne (avec promo)
  function getItemTotal(item: CartView) {
    const price = item.is_on_sale
      ? (item.product_sale_price ?? item.product_price ?? 0)
      : (item.product_price ?? 0)

    return price * (item.quantity ?? 1)
  }

  // --- Logique Livraison (Même que checkout) ---
  const FREE_SHIPPING_THRESHOLD = 100
  const FLAT_SHIPPING_RATE = 9.9

  const shippingCost = computed(() => {
    return cart.totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE
  })
</script>

<style scoped lang="less">
  .cart {
    max-width: 1000px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 0 20px;

    &__title {
      text-align: center;
    }

    &__empty {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }

    &__content {
      display: flex;
      gap: 40px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    &__items {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid @neutral-200;
      background: white;

      &-img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        flex-shrink: 0;
      }

      &-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      &-price-unit {
        font-size: 14px;
        color: @neutral-700;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      &-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;

        input {
          width: 60px;
          text-align: center;
          padding: 4px;
          border: 1px solid @neutral-300;
          border-radius: 6px;
        }
      }

      &-total {
        min-width: 80px;
        text-align: right;
      }
    }

    &__old-price {
      text-decoration: line-through;
      color: @neutral-400;
      font-size: 0.9em;
    }

    &__sale-price {
      color: @red-600;
      font-weight: bold;
    }

    &__summary {
      flex: 1;
      min-width: 280px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid @neutral-200;
      background: @neutral-50;

      &-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: @neutral-700;
        font-size: 15px;
      }
    }

    &__divider {
      height: 1px;
      background: @neutral-200;
      margin: 8px 0;
    }

    @media (max-width: 768px) {
      &__content {
        flex-direction: column;
      }

      &__items,
      &__summary {
        width: 100%;
      }

      &__item {
        flex-wrap: wrap;

        &-total {
          width: 100%;
          text-align: left;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed @neutral-200;
        }
      }
    }
  }
</style>
