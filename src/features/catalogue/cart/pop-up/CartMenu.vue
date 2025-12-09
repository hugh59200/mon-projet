<template>
  <div class="cart">
    <!-- Empty State: Simple tooltip -->
    <BasicTooltip
      v-if="cart.items.length === 0"
      :label="t('cart.empty')"
      position="bottom"
    >
      <button
        class="cart__trigger cart__trigger--ghost"
        @click="goToCart"
      >
        <BasicIconNext
          name="ShoppingCart"
          :size="20"
          color="neutral-200"
        />
      </button>
    </BasicTooltip>

    <!-- Filled State: Desktop Dropdown -->
    <FloatingDropdownWrapper
      v-else-if="!isMobile"
      v-model="isOpen"
      :width="380"
      align="right"
      arrow-align="auto"
      :close-delay="300"
      trigger-mode="click"
    >
      <template #trigger>
        <button class="cart__trigger cart__trigger--ghost">
          <BasicIconNext
            name="ShoppingCart"
            :size="20"
            color="neutral-200"
          />
          <Transition name="badge">
            <div
              v-if="cart.totalItems > 0"
              class="cart__badge"
            >
              {{ cart.totalItems }}
            </div>
          </Transition>
        </button>
      </template>

      <CartDropdownContent
        @go-to-cart="goToCart"
        @go-to-checkout="goToCheckout"
      />
    </FloatingDropdownWrapper>

    <!-- Filled State: Mobile trigger + Bottom Sheet -->
    <template v-else>
      <button
        class="cart__trigger cart__trigger--ghost"
        @click="isOpen = true"
      >
        <BasicIconNext
          name="ShoppingCart"
          :size="20"
          color="neutral-200"
        />
        <Transition name="badge">
          <div
            v-if="cart.totalItems > 0"
            class="cart__badge"
          >
            {{ cart.totalItems }}
          </div>
        </Transition>
      </button>

      <!-- Mobile Bottom Sheet -->
      <Teleport to="body">
        <Transition name="sheet">
          <div
            v-if="isOpen"
            class="cart-sheet-overlay"
            @click.self="isOpen = false"
          >
            <div class="cart-sheet">
              <div class="cart-sheet__handle"></div>
              <CartDropdownContent
                @go-to-cart="goToCart"
                @go-to-checkout="goToCheckout"
              />
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { BasicIconNext } from '@designSystem/components/basic/icon'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import CartDropdownContent from './CartDropdownContent.vue'

  const { t } = useI18n()

  const router = useRouter()
  const cart = useCartStore()
  const { isMobile } = useDeviceBreakpoint()
  const isOpen = ref(false)

  const goToCart = () => {
    isOpen.value = false
    router.push('/panier')
  }
  const goToCheckout = () => {
    isOpen.value = false
    router.push('/checkout')
  }
</script>

<style scoped lang="less">
  @ease: cubic-bezier(0.16, 1, 0.3, 1);

  .cart {
    display: inline-flex;
    position: relative;

    // Trigger - même style que les autres boutons du header
    &__trigger {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.12);
      }

      &:active {
        opacity: 0.8;
      }

      // Mode ghost : uniquement l'icône visible
      &--ghost {
        background: transparent;
        border-color: transparent;

        &:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: transparent;
        }
      }
    }

    &__badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: @neutral-50;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 2px 8px rgba(var(--primary-600-rgb), 0.4),
        0 0 0 2px var(--secondary-900);
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
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  // Mobile Bottom Sheet
  .cart-sheet-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 3000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .cart-sheet {
    width: 100%;
    max-height: 85vh;
    background: rgba(var(--secondary-900-rgb), 0.98);
    backdrop-filter: blur(20px);
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: 12px 20px 24px;
    box-shadow:
      0 -8px 32px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.06);
    overflow-y: auto;

    &__handle {
      width: 40px;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      margin: 0 auto 16px;
    }
  }

  // Sheet Animation
  .sheet-enter-active,
  .sheet-leave-active {
    transition: all 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .sheet-enter-active .cart-sheet,
  .sheet-leave-active .cart-sheet {
    transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .sheet-enter-from,
  .sheet-leave-to {
    opacity: 0;
  }

  .sheet-enter-from .cart-sheet,
  .sheet-leave-to .cart-sheet {
    transform: translateY(100%);
  }
</style>
