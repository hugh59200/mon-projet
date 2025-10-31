<template>
  <transition name="cart-popup-fade">
    <div
      v-if="visible"
      ref="popupRef"
      class="cart-popup"
      v-responsive-animate.fade="{ speed: 300 }"
      v-click-outside="{ callback: () => emit('close'), exclude: protectedRefs }"
      @mouseenter="emit('hover', true)"
      @mouseleave="emit('hover', false)"
    >
      <div class="popup-content">
        <img
          :src="product.image"
          alt=""
          class="popup-img"
        />
        <div class="popup-info">
          <BasicText
            weight="bold"
            size="body-s"
          >
            {{ product.name }}
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-300"
          >
            {{ product.quantity }} × {{ formatPrice(product.price) }}
          </BasicText>
          <BasicText
            size="body-s"
            color="primary-400"
            weight="semibold"
          >
            Total : {{ formatPrice(product.price * product.quantity) }}
          </BasicText>
        </div>
      </div>

      <div class="popup-actions">
        <BasicButton
          label="Voir le panier"
          type="reverse"
          size="small"
          @click="emit('view-cart')"
        />
        <BasicButton
          label="Paiement"
          type="primary"
          size="small"
          @click="emit('checkout')"
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { vClickOutside } from '@/directives/vClickOutside'
  import { onMounted, ref, watch } from 'vue'
  import type { CartItem } from '../cart/Cart.types'

  defineOptions({ directives: { clickOutside: vClickOutside } })

  const props = defineProps<{
    product: CartItem
    protectedRefs?: (HTMLElement | null)[]
  }>()

  const emit = defineEmits<{
    (e: 'view-cart'): void
    (e: 'checkout'): void
    (e: 'hover', state: boolean): void
    (e: 'close'): void
  }>()

  const popupRef = ref<HTMLElement | null>(null)
  const visible = ref(false)

  onMounted(() => {
    // petit délai pour déclencher l'animation d'entrée
    requestAnimationFrame(() => (visible.value = true))
  })

  watch(visible, (v) => {
    if (!v) emit('close')
  })

  function formatPrice(value: number): string {
    return `${value.toFixed(2).replace('.', ',')} €`
  }
</script>

<style scoped lang="less">
  .cart-popup {
    position: absolute;
    top: 36px;
    right: 0;
    background: @neutral-800;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    min-width: 240px;
    max-width: 280px;
    z-index: 4000;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: white;
    opacity: 1;
    transform: translateY(0);
    transition: all 0.25s ease;


    .popup-content {
      display: flex;
      align-items: center;
      gap: 10px;

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
    }

    .popup-actions {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      margin-top: 4px;

      button {
        flex: 1;
        font-size: 13px;
        padding: 4px 0;
      }
    }
  }

  /* 🌫️ Animation entrée/sortie */
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
