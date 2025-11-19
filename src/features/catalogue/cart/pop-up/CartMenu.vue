<template>
  <div class="cart">
    <FloatingDropdownWrapper
      v-model="isOpen"
      :width="300"
      align="right"
      arrow-align="auto"
      :close-delay="800"
      :trigger-mode="!isMobile ? 'hover' : 'click'"
    >
      <template #trigger>
        <div class="cart__icon">
          <BasicIconNext
            class="cart__icon-svg"
            name="ShoppingCart"
            :size="26"
          />
          <div
            v-if="cart.totalItems > 0"
            class="cart__badge"
            v-motion-pop
          >
            <BasicText
              size="body-s"
              weight="bold"
            >
              {{ cart.totalItems }}
            </BasicText>
          </div>
        </div>
      </template>

      <div class="cart__content">
        <div
          v-if="cart.items.length === 0"
          class="cart__empty"
        >
          <BasicIconNext
            name="ShoppingBag"
            :size="40"
            color="neutral-400"
          />

          <BasicText
            size="body-m"
            weight="semibold"
            color="neutral-200"
            class="cart__empty-title"
          >
            Votre panier est vide
          </BasicText>

          <BasicText
            size="body-s"
            color="neutral-400"
            class="cart__empty-sub"
          >
            Découvrez nos peptides et complétez votre panier.
          </BasicText>

          <BasicButton
            label="Voir les produits"
            type="primary"
            size="small"
            class="cart__empty-btn"
            @click="goToProducts"
          />
        </div>

        <div
          v-else
          class="cart__list-wrapper"
        >
          <div class="cart__list">
            <div
              v-for="item in cart.items.slice(0, 3)"
              class="cart__item"
            >
              <img
                :src="item.product_image || defaultImage"
                alt=""
                class="cart__item-img"
              />

              <div class="cart__item-info">
                <BasicText
                  size="body-s"
                  weight="semibold"
                  color="neutral-300"
                  class="cart__item-name"
                >
                  {{ item.product_name }}
                </BasicText>

                <div class="cart__item-price-row">
                  <BasicText
                    size="body-s"
                    color="neutral-400"
                  >
                    {{ item.quantity }} ×
                  </BasicText>

                  <BasicText
                    size="body-s"
                    weight="bold"
                    color="neutral-200"
                  >
                    {{ formatPrice(item.product_price) }}
                  </BasicText>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="cart.items.length > 3"
            class="cart__more"
          >
            +{{ cart.items.length - 3 }} autres articles...
          </div>

          <div class="cart__actions">
            <div class="cart__total-row">
              <BasicText
                size="body-s"
                color="neutral-400"
              >
                Total estimé
              </BasicText>
              <BasicText
                size="body-m"
                color="primary-400"
                weight="bold"
              >
                {{ formatPrice(cart.totalPrice) }}
              </BasicText>
            </div>

            <div class="cart__btns">
              <BasicButton
                label="Voir le panier"
                type="reverse"
                size="small"
                @click="goToCart"
              />
              <BasicButton
                label="Paiement"
                type="primary"
                size="small"
                @click="goToCheckout"
              />
            </div>
          </div>
        </div>
      </div>
    </FloatingDropdownWrapper>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const cart = useCartStore()
  const { isMobile } = useDeviceBreakpoint()

  const isOpen = ref(false)

  function formatPrice(value: number | null | undefined) {
    if (value == null || isNaN(Number(value))) return '—'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
      Number(value),
    )
  }

  function goToCart() {
    isOpen.value = false
    router.push('/panier')
  }

  function goToCheckout() {
    isOpen.value = false
    router.push('/checkout')
  }

  function goToProducts() {
    isOpen.value = false
    router.push('/catalogue')
  }
</script>

<style scoped lang="less">
  .cart {
    display: inline-flex;
    position: relative;

    /* ======================
      ICON TRIGGER
    ====================== */
    &__icon {
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: transform 0.25s ease;

      &-svg {
        transition: filter 0.25s ease;
      }

      &:hover &-svg {
        filter: drop-shadow(0 0 6px rgba(var(--primary-500-rgb), 0.45));
      }
    }

    &__badge {
      position: absolute;
      top: -8px;
      right: -6px;
      background: var(--primary-600);
      color: white;
      border-radius: 50%;
      height: 18px;
      width: 18px; /* Un peu plus grand pour lisibilité */
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      box-shadow: 0 0 0 2px rgba(var(--secondary-900-rgb), 1);
    }

    /* ======================
      DROPDOWN CONTENT
    ====================== */
    &__content {
      padding: 0;
      /* Un fond légèrement plus opaque pour le dropdown */
      background: rgba(30, 30, 30, 0.95);
    }

    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 30px 20px;
      gap: 8px;
      color: fade(white, 70%);

      &-title {
        margin-top: 8px;
        color: @neutral-200;
      }

      &-sub {
        font-size: 0.85rem;
        line-height: 1.3;
        color: @neutral-400;
      }

      &-btn {
        margin-top: 12px;
        width: 100%;
      }
    }

    /* ======================
      LIST (cart filled)
    ====================== */
    &__list-wrapper {
      padding: 16px;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__item {
      display: flex;
      align-items: flex-start; /* Alignement top pour multiline */
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid color-mix(in srgb, @neutral-700 50%, transparent);

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      &-img {
        width: 48px;
        height: 48px;
        border-radius: 6px;
        object-fit: cover;
        background: color-mix(in srgb, @neutral-800 45%, transparent);
        border: 1px solid color-mix(in srgb, @neutral-500 15%, transparent);
        flex-shrink: 0;
      }

      &-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0; /* Pour le truncate */
      }

      &-name {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      &-price-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }

    &__more {
      text-align: center;
      font-size: 12px;
      color: color-mix(in srgb, @neutral-300 60%, transparent);
      padding: 8px 0 4px;
      font-style: italic;
    }

    /* ======================
      TOTAL + BUTTONS
    ====================== */
    &__actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid color-mix(in srgb, @neutral-500 30%, transparent);
    }

    &__total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__btns {
      display: flex;
      gap: 8px;

      button {
        flex: 1;
        font-size: 13px;
      }
    }
  }
</style>
