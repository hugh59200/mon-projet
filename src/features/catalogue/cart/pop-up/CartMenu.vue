<template>
  <FloatingDropdownWrapper
    v-model="isOpen"
    :width="280"
    align="right"
    arrow-align="auto"
    :close-delay="800"
    :trigger-mode="!isMobile ? 'hover' : 'click'"
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

    <!-- 🧾 Contenu du menu déroulant -->
    <div class="cart-content">
      <!-- 🧺 PANIER VIDE -->
      <div
        v-if="cart.items.length === 0"
        class="cart-empty"
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
          class="cart-empty-title"
        >
          Votre panier est vide
        </BasicText>
        <BasicText
          size="body-s"
          color="neutral-400"
          class="cart-empty-sub"
        >
          Découvrez nos peptides et complétez votre panier.
        </BasicText>
        <BasicButton
          label="Voir les produits"
          type="primary"
          size="small"
          class="cart-empty-btn"
          @click="goToProducts"
        />
      </div>

      <!-- 🧃 PANIER REMPLI -->
      <div
        v-else
        class="popup-list"
      >
        <div
          v-for="item in cart.items.slice(0, 3)"
          class="popup-item"
        >
          <img
            :src="item.product_image || defaultImage"
            alt=""
            class="popup-img"
          />
          <div class="popup-info">
            <BasicText
              size="body-s"
              weight="semibold"
            >
              {{ item.product_name }}
            </BasicText>
            <BasicText
              size="body-s"
              color="neutral-300"
            >
              {{ item.quantity }} × {{ formatCurrency(item.product_price) }}
            </BasicText>
          </div>
        </div>

        <div
          v-if="cart.items.length > 3"
          class="popup-more"
        >
          +{{ cart.items.length - 3 }} autres articles...
        </div>

        <div class="popup-actions">
          <BasicText
            size="body-s"
            color="primary-400"
            weight="semibold"
            class="popup-total"
          >
            Total : {{ formatCurrency(cart.totalPrice) }}
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
      </div>
    </div>
  </FloatingDropdownWrapper>
</template>

<script setup lang="ts">
  import defaultImage from '@/assets/products/default/default-product-image.png'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { formatCurrency } from '@/utils/index'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const cart = useCartStore()
  const { isMobile } = useDeviceBreakpoint()

  const isOpen = ref(false)

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

  /* 🧺 PANIER VIDE */
  .cart-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 30px 20px;
    gap: 8px;
    color: fade(white, 70%);

    .cart-empty-title {
      margin-top: 8px;
    }

    .cart-empty-sub {
      font-size: 0.85rem;
      line-height: 1.3;
    }

    .cart-empty-btn {
      margin-top: 12px;
      width: 100%;
    }
  }

  /* 🧾 PANIER NON VIDE */
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
    background: rgba(var(--neutral-700-rgb), 0.40);
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
</style>
