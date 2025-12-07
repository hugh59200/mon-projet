<template>
  <div class="cart__dropdown">
    <header class="cart__header">
      <span>{{ t('nav.cart') }}</span>
      <span class="cart__header-count">
        {{ cart.totalItems }} {{ cart.totalItems > 1 ? t('cart.items') : t('cart.item') }}
      </span>
    </header>

    <div class="cart__list">
      <TransitionGroup name="item">
        <div
          v-for="item in cart.items"
          :key="item.cart_item_id ?? item.product_id ?? `item-${item.product_name}`"
          class="cart__item"
        >
          <div class="cart__item-image">
            <img
              :src="item.product_image || defaultImage"
              :alt="item.product_name!"
            />
          </div>
          <div class="cart__item-info">
            <span class="cart__item-name">{{ item.product_name }}</span>
            <div class="cart__item-meta">
              <span class="cart__item-qty">{{ t('cart.quantity') }}: {{ item.quantity }}</span>
              <div class="cart__item-price">
                <template v-if="item.is_on_sale">
                  <span class="cart__item-price--old">
                    {{ formatPrice(item.product_price) }}
                  </span>
                  <span class="cart__item-price--new">
                    {{ formatPrice(item.product_sale_price) }}
                  </span>
                </template>
                <span v-else>{{ formatPrice(item.product_price) }}</span>
              </div>
            </div>
          </div>
          <PremiumButton
            type="danger"
            variant="ghost"
            size="xs"
            icon-left="X"
            class="cart__item-remove"
            @click.stop="cart.removeFromCart(item.product_id!)"
          />
        </div>
      </TransitionGroup>
    </div>

    <footer class="cart__footer">
      <!-- Barre livraison gratuite -->
      <div v-if="cart.totalPrice < FREE_SHIPPING_THRESHOLD" class="cart__shipping-progress">
        <div class="cart__shipping-bar">
          <div
            class="cart__shipping-fill"
            :style="{ width: `${Math.min((cart.totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }"
          />
        </div>
        <p class="cart__shipping-text">
          <BasicIconNext name="Truck" :size="14" />
          <span>{{ t('aov.freeShipping.progress', { amount: formatPrice(FREE_SHIPPING_THRESHOLD - cart.totalPrice) }) }}</span>
        </p>
      </div>
      <div v-else class="cart__shipping-unlocked">
        <BasicIconNext name="Check" :size="14" />
        <span>{{ t('aov.freeShipping.unlocked') }}</span>
      </div>

      <div class="cart__total">
        <span>{{ t('cart.total') }}</span>
        <strong>{{ formatPrice(cart.totalPrice) }}</strong>
      </div>

      <!-- Mini trust badges -->
      <div class="cart__trust">
        <div class="cart__trust-item">
          <BasicIconNext name="ShieldCheck" :size="14" />
          <span>{{ t('aov.quality.purityCertified') }}</span>
        </div>
        <div class="cart__trust-item">
          <BasicIconNext name="FileCheck" :size="14" />
          <span>{{ t('aov.quality.coaIncluded') }}</span>
        </div>
      </div>

      <div class="cart__actions">
        <PremiumButton
          type="secondary"
          size="sm"
          :label="t('cart.title')"
          @click="emit('goToCart')"
        />
        <PremiumButton
          type="primary"
          variant="solid"
          size="sm"
          :label="t('checkout.placeOrder')"
          icon-left="Shield"
          :shine="true"
          @click="emit('goToCheckout')"
        />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useI18n } from 'vue-i18n'

  const FREE_SHIPPING_THRESHOLD = 150

  const { t } = useI18n()
  const cart = useCartStore()

  const emit = defineEmits<{
    goToCart: []
    goToCheckout: []
  }>()

  const formatPrice = (v: number | null | undefined) =>
    v == null || isNaN(Number(v))
      ? '0,00 €'
      : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(v))
</script>

<style scoped lang="less">
  @ease: cubic-bezier(0.16, 1, 0.3, 1);

  // Dropdown
  .cart__dropdown {
    display: flex;
    flex-direction: column;
  }

  // Header
  .cart__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(var(--neutral-100-rgb), 0.06);
    font-size: 14px;
    font-weight: 600;
    color: @neutral-200;

    &-count {
      font-size: 12px;
      font-weight: 500;
      color: @neutral-400;
      padding: 4px 10px;
      background: rgba(var(--neutral-100-rgb), 0.04);
      border-radius: 100px;
    }
  }

  // List
  .cart__list {
    max-height: 320px;
    overflow-y: auto;
    margin: 12px -4px;
    padding: 0 4px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(var(--neutral-100-rgb), 0.1);
      border-radius: 4px;
    }
  }

  // Item
  .cart__item {
    display: flex;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
    transition: background 0.2s;
    position: relative;
    width: 100%;

    &:hover {
      background: rgba(var(--neutral-100-rgb), 0.03);
      .cart__item-remove {
        opacity: 1;
      }
    }

    &-image {
      width: 56px;
      height: 56px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(var(--neutral-100-rgb), 0.08);
      background: var(--secondary-950);
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
    }

    &-name {
      font-size: 14px;
      font-weight: 500;
      color: @neutral-100;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-qty {
      font-size: 12px;
      color: @neutral-400;
    }

    &-price {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: @neutral-100;

      &--old {
        font-size: 12px;
        font-weight: 400;
        color: @neutral-500;
        text-decoration: line-through;
      }

      &--new {
        color: var(--primary-400);
      }
    }

    &-remove {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: rgba(var(--neutral-100-rgb), 0.04);
      border: none;
      color: @neutral-500;
      cursor: pointer;
      opacity: 0;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(@danger-500, 0.15);
        color: @danger-400;
      }
    }
  }

  // Footer
  .cart__footer {
    padding-top: 16px;
    border-top: 1px solid rgba(var(--neutral-100-rgb), 0.06);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  // Shipping progress
  .cart__shipping-progress {
    padding: 10px 12px;
    background: rgba(var(--primary-500-rgb), 0.08);
    border-radius: 10px;
    border: 1px solid rgba(var(--primary-500-rgb), 0.15);
  }

  .cart__shipping-bar {
    height: 4px;
    background: rgba(var(--neutral-100-rgb), 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .cart__shipping-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-400) 100%);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .cart__shipping-text {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    font-size: 11px;
    color: var(--primary-300);

    svg {
      flex-shrink: 0;
    }
  }

  .cart__shipping-unlocked {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 12px;
    background: rgba(var(--success-500-rgb), 0.12);
    border: 1px solid rgba(var(--success-500-rgb), 0.2);
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    color: @success-400;

    svg {
      color: @success-400;
    }
  }

  // Trust badges
  .cart__trust {
    display: flex;
    gap: 12px;
    padding: 8px 0;
  }

  .cart__trust-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: @neutral-400;

    svg {
      color: @success-500;
      flex-shrink: 0;
    }
  }

  .cart__total {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-size: 14px;
      color: @neutral-400;
    }

    strong {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-400);
    }
  }

  .cart__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  // Item Animation
  .item-enter-active {
    animation: itemSlide 0.3s @ease;
  }
  .item-leave-active {
    animation: itemSlide 0.2s @ease reverse;
    position: absolute;
    width: 100%;
  }

  @keyframes itemSlide {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  // Mobile responsive
  .respond-mobile({
    .cart__item-remove {
      opacity: 1;
    }

    .cart__actions {
      grid-template-columns: 1fr;
    }
  });
</style>
