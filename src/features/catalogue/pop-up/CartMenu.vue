<template>
  <BasicTooltip
    label="Voir mon panier"
    position="bottom"
    :visible="!showCartPopup"
  >
    <div
      class="cart-icon"
      ref="cartIcon"
    >
      <BasicIconNext
        class="shopping-icon"
        name="ShoppingCart"
        :size="26"
      />
      <div class="cart-badge">
        <BasicText
          size="body-s"
          weight="bold"
        >
          {{ cart.totalItems }}
        </BasicText>
      </div>
      <CartItemPopup
        v-if="showCartPopup && lastAddedProduct"
        :product="lastAddedProduct"
        :protected-refs="[cartIcon]"
        @view-cart="goToCart"
        @checkout="goToCheckout"
        @hover="handleHover"
        @close="showCartPopup = false"
      />
    </div>
  </BasicTooltip>
</template>

<script setup lang="ts">
  import type { CartItem } from '@/features/catalogue/cart/Cart.types'
  import { useCartStore } from '@/features/catalogue/cart/useCartStore'
  import CartItemPopup from '@/features/catalogue/pop-up/CartItemPopup.vue'
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  const cart = useCartStore()
  const router = useRouter()
  const showCartPopup = ref(false)
  const lastAddedProduct = ref<CartItem | null>(null)
  const isHovering = ref(false)
  const cartIcon = ref<HTMLElement | null>(null)
  let popupTimeout: ReturnType<typeof setTimeout> | null = null

  // 🎯 Rebond rapide du panier à chaque ajout
  watch(
    () => cart.lastAddedItem,
    (newItem) => {
      if (!newItem || !cartIcon.value) return
      const el = cartIcon.value.querySelector('.shopping-icon')
      if (!el) return

      el.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
        {
          duration: 500,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          iterations: 1,
        },
      )
    },
  )

  // 🧩 Affichage du mini-popup après ajout
  watch(
    () => cart.lastAddedItem,
    (newItem) => {
      if (!newItem) return
      lastAddedProduct.value = newItem
      showCartPopup.value = true
      startPopupTimer()
    },
  )

  function handleHover(state: boolean) {
    isHovering.value = state
    if (state && popupTimeout) clearTimeout(popupTimeout)
    else startPopupTimer()
  }

  function startPopupTimer() {
    if (popupTimeout) clearTimeout(popupTimeout)
    popupTimeout = setTimeout(() => {
      if (!isHovering.value) showCartPopup.value = false
    }, 3500)
  }

  function goToCart() {
    showCartPopup.value = false
    router.push('/panier')
  }

  function goToCheckout() {
    showCartPopup.value = false
    router.push('/checkout')
  }
</script>

<style scoped lang="less">
  .cart-icon {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: transform 0.25s ease;
    user-select: none;
    margin-bottom: -5px;

    .cart-badge {
      position: absolute;
      top: -9px;
      right: -2px;
      background: @danger-500;
      color: white;
      border-radius: 50%;
      height: 14px;
      width: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 2px @neutral-900;
      &:hover {
        transform: scale(1.12);
      }
    }
  }

  /* 🔮 Fix carré lumineux & glow doux */
  .cart-icon svg {
    border: none;
    outline: none;
    background: transparent;
    border-radius: 50%;
    box-shadow: none !important;
  }

  .shopping-icon {
    filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
    transition: filter 0.25s ease;
  }

  .cart-icon:hover .shopping-icon {
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.35));
  }
</style>
