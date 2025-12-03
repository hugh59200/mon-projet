<template>
  <div class="cart">
    <FloatingDropdownWrapper
      v-model="isOpen"
      :width="380"
      align="right"
      arrow-align="auto"
      :close-delay="800"
      :trigger-mode="!isMobile ? 'hover' : 'click'"
    >
      <template #trigger>
        <div class="cart__trigger">
          <div class="cart__icon">
            <BasicIconNext
              name="ShoppingCart"
              :size="24"
            />
            <div class="cart__icon-glow"></div>
          </div>
          <Transition name="badge">
            <div
              v-if="cart.totalItems > 0"
              class="cart__badge"
            >
              {{ cart.totalItems }}
            </div>
          </Transition>
        </div>
      </template>

      <div class="cart__dropdown">
        <!-- Empty State -->
        <div
          v-if="cart.items.length === 0"
          class="cart__empty"
        >
          <div class="cart__empty-icon">
            <BasicIconNext
              name="ShoppingBag"
              :size="36"
            />
          </div>
          <h4>{{ t('cart.empty') }}</h4>
          <p>{{ t('cart.emptyText') }}</p>
          <PremiumButton
            :label="t('cart.continueShopping')"
            type="primary"
            size="sm"
            width="full"
            @click="goToProducts"
          />
        </div>

        <!-- Filled State -->
        <template v-else>
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
            <div class="cart__total">
              <span>{{ t('cart.total') }}</span>
              <strong>{{ formatPrice(cart.totalPrice) }}</strong>
            </div>
            <div class="cart__actions">
              <PremiumButton
                type="secondary"
                size="sm"
                :label="t('cart.title')"
                @click="goToCart"
              />
              <PremiumButton
                type="primary"
                variant="solid"
                size="sm"
                :label="t('checkout.placeOrder')"
                icon-left="Shield"
                :shine="true"
                @click="goToCheckout"
              />
            </div>
          </footer>
        </template>
      </div>
    </FloatingDropdownWrapper>
  </div>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { BasicIconNext } from '@designSystem/components/basic/icon'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()

  const router = useRouter()
  const cart = useCartStore()
  const { isMobile } = useDeviceBreakpoint()
  const isOpen = ref(false)

  const formatPrice = (v: number | null | undefined) =>
    v == null || isNaN(Number(v))
      ? '0,00 €'
      : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(v))

  const goToCart = () => {
    isOpen.value = false
    router.push('/panier')
  }
  const goToCheckout = () => {
    isOpen.value = false
    router.push('/checkout')
  }
  const goToProducts = () => {
    isOpen.value = false
    router.push('/catalogue')
  }
</script>

<style scoped lang="less">
  @ease: cubic-bezier(0.16, 1, 0.3, 1);

  .cart {
    display: inline-flex;
    position: relative;

    // Trigger
    &__trigger {
      position: relative;
      cursor: pointer;
      padding: 8px;
      border-radius: 12px;
      transition: all 0.3s @ease;

      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.06);

        .cart__icon-glow {
          opacity: 1;
        }
        .cart__icon {
          color: @neutral-50;
          transform: scale(1.02);
        }
      }
    }

    &__icon {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @neutral-200;
      transition: all 0.3s @ease;

      &-glow {
        position: absolute;
        inset: -8px;
        background: radial-gradient(circle, rgba(var(--primary-500-rgb), 0.3), transparent 70%);
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
    }

    &__badge {
      position: absolute;
      top: -5px;
      right: -4px;
      min-width: 18px;
      height: 18px;
      padding: 0 2px;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: @neutral-50;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 2px 8px rgba(var(--primary-600-rgb), 0.4),
        0 0 0 2px var(--secondary-900);
    }

    // Dropdown
    &__dropdown {
      display: flex;
      flex-direction: column;
    }

    // Empty
    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 32px 20px;
      gap: 12px;

      &-icon {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: rgba(var(--neutral-100-rgb), 0.04);
        display: flex;
        align-items: center;
        justify-content: center;
        color: @neutral-500;
        margin-bottom: 8px;
      }

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: @neutral-100;
        margin: 0;
      }

      p {
        font-size: 14px;
        color: @neutral-400;
        margin: 0 0 8px;
      }
    }

    // Header
    &__header {
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
    &__list {
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
    &__item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-radius: 12px;
      transition: background 0.2s;
      position: relative;

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
    &__footer {
      padding-top: 16px;
      border-top: 1px solid rgba(var(--neutral-100-rgb), 0.06);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__total {
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

    &__actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
  }

  // Badge Animation
  .badge-enter-active {
    animation: badgePop 0.4s @ease;
  }
  .badge-leave-active {
    animation: badgePop 0.3s @ease reverse;
  }

  @keyframes badgePop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
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
</style>
