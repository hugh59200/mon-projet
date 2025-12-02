<template>
  <div class="cart-card">
    <div
      class="cart-card__visual"
      @click="$emit('view', item.product_id)"
    >
      <div class="img-container">
        <img
          :src="item.product_image || ''"
          :alt="item.product_name || 'Produit'"
          loading="lazy"
        />
      </div>
    </div>

    <div class="cart-card__content">
      <div class="content-top">
        <div class="info-block">
          <BasicText
            size="h5"
            weight="bold"
            color="neutral-900"
            class="product-title"
            pointer
            @click="$emit('view', item.product_id)"
          >
            {{ item.product_name }}
          </BasicText>

          <div class="meta-line">
            <BasicText
              size="body-s"
              color="neutral-500"
            >
              {{ item.product_category || 'Général' }}
            </BasicText>
            <span
              v-if="item.product_dosage"
              class="separator"
            >
              •
            </span>
            <BasicText
              v-if="item.product_dosage"
              size="body-s"
              color="neutral-600"
              weight="semibold"
            >
              {{ item.product_dosage }}
            </BasicText>
          </div>
        </div>

        <button
          class="btn-remove"
          aria-label="Supprimer"
          @click="removeItem"
          :disabled="loading"
        >
          <BasicIconNext name="X" :size="20" />
        </button>
      </div>

      <div class="content-bottom">
        <div class="price-unit-block">
          <div
            v-if="item.is_on_sale && item.product_sale_price"
            class="price-row"
          >
            <span class="old-price">{{ formatPrice(item.product_price) }}</span>
            <BasicText
              size="body-m"
              weight="bold"
              color="warning-600"
            >
              {{ formatPrice(item.product_sale_price) }}
            </BasicText>
          </div>

          <div
            v-else
            class="price-row"
          >
            <BasicText
              size="body-m"
              weight="semibold"
              color="neutral-900"
            >
              {{ formatPrice(item.product_price) }}
            </BasicText>
          </div>

          <span class="unit-label">/ unité</span>
        </div>

        <div class="actions-group">
          <div
            class="stepper-pill"
            :class="{ 'is-loading': loading }"
          >
            <button
              class="step-btn"
              @click="updateQty(-1)"
              :disabled="loading"
            >
              −
            </button>
            <span class="step-value">{{ item.quantity }}</span>
            <button
              class="step-btn"
              @click="updateQty(1)"
              :disabled="loading || (item.product_stock || 0) <= (item.quantity || 0)"
            >
              +
            </button>
          </div>

          <div class="total-price">
            <BasicText
              size="h5"
              weight="bold"
              color="primary-700"
              class="no-wrap"
            >
              {{ formatPrice(rowTotal) }}
            </BasicText>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import type { CartView } from '@/supabase/types/supabase.types'
  import { computed, ref } from 'vue'

  type ExtendedCartView = CartView & {
    product_dosage?: string | null
  }

  const props = defineProps<{ item: ExtendedCartView }>()
  const emit = defineEmits(['view'])
  const cartStore = useCartStore()
  const loading = ref(false)

  const effectiveUnitPrice = computed(() => {
    return props.item.is_on_sale && props.item.product_sale_price
      ? props.item.product_sale_price
      : props.item.product_price || 0
  })

  const rowTotal = computed(() => effectiveUnitPrice.value * (props.item.quantity || 1))

  async function updateQty(delta: number) {
    if (!props.item.product_id) return
    loading.value = true
    try {
      const newQty = (props.item.quantity || 0) + delta
      if (newQty < 1) return
      await cartStore.updateQuantity(props.item.product_id, newQty)
    } finally {
      loading.value = false
    }
  }

  async function removeItem() {
    if (!props.item.product_id) return
    loading.value = true
    try {
      await cartStore.removeFromCart(props.item.product_id)
    } finally {
      loading.value = false
    }
  }

  function formatPrice(val: number | null | undefined) {
    return (val ?? 0).toFixed(2).replace('.', ',') + '\u00A0€'
  }
</script>

<style scoped lang="less">
  /* --- CARTE --- */
  .cart-card {
    display: flex;
    background: @white;
    border: 1px solid @neutral-200;
    border-radius: 16px;
    padding: 16px;
    gap: 26px;
    transition: all 0.2s ease-in-out;
    position: relative;

    &:hover {
      border-color: var(--primary-200);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    &__visual {
      flex-shrink: 0;
      width: 90px;
      height: 90px;
      cursor: pointer;

      .img-container {
        width: 100%;
        height: 100%;
        background: @neutral-50;
        border-radius: 12px;
        border: 1px solid @neutral-100;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }
      }
    }

    &__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
    }

    /* TOP */
    .content-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .info-block {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .product-title {
      line-height: 1.2;
      &:hover {
        color: var(--primary-700);
      }
    }

    .meta-line {
      display: flex;
      align-items: center;
      gap: 6px;
      .separator {
        color: @neutral-300;
        font-size: 10px;
      }
    }

    .btn-remove {
      background: transparent;
      border: none;
      color: @neutral-400;
      padding: 6px;
      margin: -6px -6px 0 0;
      border-radius: 8px;
      cursor: pointer;
      &:hover {
        background: @danger-50;
        color: @danger-600;
      }
    }

    /* BOTTOM */
    .content-bottom {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap; /* Sécurité mobile */
      gap: 12px;
    }

    /* --- GESTION DU PRIX (LE FIX EST LA) --- */
    .price-unit-block {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .price-row {
        display: flex;
        align-items: baseline; /* Aligne le bas des textes */
        gap: 8px; /* Espace entre prix barré et prix promo */
      }

      .old-price {
        font-size: 13px;
        text-decoration: line-through;
        color: @neutral-400;
        font-weight: 400;
      }

      .unit-label {
        font-size: 11px;
        color: @neutral-400;
        margin-top: 2px;
      }
    }

    .actions-group {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: auto; /* Pousse le groupe à droite */
    }

    .stepper-pill {
      display: flex;
      align-items: center;
      background: @neutral-50;
      border: 1px solid @neutral-200;
      border-radius: 50px;
      height: 32px;
      padding: 0 2px;

      .step-btn {
        width: 28px;
        height: 100%;
        background: transparent;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @neutral-600;

        &:hover:not(:disabled) {
          background: @white;
          color: var(--primary-600);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        &:disabled {
          color: @neutral-300;
        }
      }

      .step-value {
        min-width: 24px;
        text-align: center;
        font-weight: 600;
        font-size: 13px;
        color: @neutral-900;
      }
    }

    .total-price {
      min-width: 70px;
      text-align: right;
    }
  }

  /* MOBILE */
  @media (max-width: 600px) {
    .cart-card {
      .content-bottom {
        flex-direction: column-reverse;
        align-items: flex-start;
      }
      .actions-group {
        width: 100%;
        justify-content: space-between;
        margin-left: 0;
        padding-top: 10px;
        border-top: 1px solid @neutral-100;
      }
      .price-unit-block {
        /* En mobile, on peut vouloir cacher le prix unitaire pour épurer, 
           ou le laisser. Ici je le laisse mais discret */
        flex-direction: row;
        align-items: baseline;
        gap: 8px;
        .unit-label {
          margin-top: 0;
          margin-left: 4px;
        }
      }
    }
  }
</style>
