<template>
  <FloatingDropdownWrapper
    v-model="isOpen"
    :width="280"
    align="right"
    arrow-align="auto"
    :close-delay="1000"
  >
    <!-- 🛍️ Icône du panier -->
    <template #trigger>
      <div class="cart-icon">
        <BasicIconNext
          class="shopping-icon"
          name="ShoppingCart"
          :size="26"
        />
        <div
          v-if="cart.totalItems > 0"
          class="cart-badge"
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
    <div class="popup-list">
      <div
        v-for="item in cart.items.slice(0, 3)"
        :key="item.id"
        class="popup-item"
      >
        <img
          :src="item.image || defaultImage"
          alt=""
          class="popup-img"
        />
        <div class="popup-info">
          <BasicText
            size="body-s"
            weight="semibold"
          >
            {{ item.name }}
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-300"
          >
            {{ item.quantity }} × {{ formatPrice(item.price) }}
          </BasicText>
        </div>
      </div>

      <div
        v-if="cart.items.length > 3"
        class="popup-more"
      >
        +{{ cart.items.length - 3 }} autres articles...
      </div>
    </div>

    <div class="popup-actions">
      <BasicText
        size="body-s"
        color="primary-400"
        weight="semibold"
        class="popup-total"
      >
        Total : {{ formatPrice(cart.totalPrice) }}
      </BasicText>
      <div class="popup-btns">
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
  </FloatingDropdownWrapper>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const cart = useCartStore()

  const isOpen = ref(false)
  const contentMode = ref<'last' | 'preview' | null>(null)
  let autoCloseTimer: ReturnType<typeof setTimeout> | null = null

  // 🧩 Lors du hover, on passe en mode aperçu global
  function onHoverEnter() {
    if (autoCloseTimer) clearTimeout(autoCloseTimer)
    contentMode.value = 'preview'
    isOpen.value = true
  }

  function onHoverLeave() {
    if (contentMode.value === 'preview') {
      setTimeout(() => {
        isOpen.value = false
        contentMode.value = null
      }, 400)
    }
  }

  function goToCart() {
    isOpen.value = false
    contentMode.value = null
    router.push('/panier')
  }

  function goToCheckout() {
    isOpen.value = false
    contentMode.value = null
    router.push('/checkout')
  }

  function formatPrice(value: number): string {
    return `${value.toFixed(2).replace('.', ',')} €`
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
    }

    &:hover .shopping-icon {
      filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.35));
    }
  }

  .popup-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 240px;
    overflow-y: auto;

    .popup-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .popup-img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
    background: fade(@neutral-700, 40%);
  }

  .popup-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .popup-more {
    text-align: center;
    font-size: 12px;
    color: fade(white, 60%);
    margin-top: 4px;
  }

  .popup-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .popup-total {
      text-align: right;
      margin-bottom: 6px;
    }

    .popup-btns {
      display: flex;
      gap: 6px;

      button {
        flex: 1;
        font-size: 13px;
        padding: 4px 0;
      }
    }
  }

  .cart-popup-fade-enter-active,
  .cart-popup-fade-leave-active {
    transition: all 0.3s ease;
  }
  .cart-popup-fade-enter-from,
  .cart-popup-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
</style>
