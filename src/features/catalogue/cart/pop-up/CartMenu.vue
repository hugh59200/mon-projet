<template>
  <FloatingDropdownWrapper
    v-model="isOpen"
    :width="280"
    align="right"
    arrow-align="auto"
    :close-delay="800"
    :trigger-mode="!isMobile ? 'hover' : 'click'"
  >
    <!-- TRIGGER = CART ICON -->
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

    <!-- DROPDOWN CONTENT -->
    <div class="cart__content">
      <!-- EMPTY CART -->
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

      <!-- FILLED CART -->
      <div
        v-else
        class="cart__list"
      >
        <!-- ITEMS -->
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

        <!-- MORE -->
        <div
          v-if="cart.items.length > 3"
          class="cart__more"
        >
          +{{ cart.items.length - 3 }} autres articles...
        </div>

        <!-- TOTAL + BUTTONS -->
        <div class="cart__actions">
          <BasicText
            size="body-s"
            color="primary-400"
            weight="semibold"
            class="cart__total"
          >
            Total : {{ formatCurrency(cart.totalPrice) }}
          </BasicText>

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
  .cart {
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
        filter: drop-shadow(0 0 6px fade(@primary-500, 45%));
      }
    }

    &__badge {
      position: absolute;
      top: -9px;
      right: -2px;

      background: @primary-700;
      color: white;

      border-radius: 50%;
      height: 16px;
      width: 16px;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 11px;
      font-weight: bold;

      box-shadow: 0 0 0 2px fade(@secondary-900, 70%);
    }

    /* ======================
     EMPTY
  ====================== */
    &__content {
      padding: 0;
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
    &__list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 240px;
      overflow-y: auto;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 0;
      transition:
        background 0.25s ease,
        transform 0.2s ease;

      &-img {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        object-fit: cover;

        background: fade(@neutral-800, 45%);
        border: 1px solid fade(@neutral-500, 15%);
      }

      &-info {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
    }

    &__more {
      text-align: center;
      font-size: 12px;
      color: fade(@neutral-300, 80%);
      margin-top: 4px;
    }

    /* ======================
     TOTAL + BUTTONS
  ====================== */
    &__actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
    }

    &__total {
      text-align: right;
      margin-bottom: 8px;
      color: @primary-400;
    }

    &__btns {
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
