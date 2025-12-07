<template>
  <section class="checkout-cart">
    <div class="checkout-cart__header">
      <div class="checkout-cart__icon">
        <BasicIconNext name="ShoppingCart" :size="20" />
      </div>
      <div>
        <h2 class="checkout-cart__title">{{ t('cart.title') }}</h2>
        <p class="checkout-cart__subtitle">
          {{ items.length }} {{ items.length > 1 ? t('cart.items') : t('cart.item') }}
        </p>
      </div>
    </div>

    <div class="checkout-cart__items">
      <div
        v-for="(item, index) in items"
        :key="item.product_id ?? index"
        class="checkout-item"
      >
        <div class="checkout-item__image">
          <img
            :src="item.product_image || defaultImage"
            :alt="item.product_name!"
          />
          <span
            v-if="item.is_on_sale"
            class="checkout-item__badge"
          >
            -{{ Math.round((1 - (item.product_sale_price ?? 0) / (item.product_price ?? 1)) * 100) }}%
          </span>
        </div>

        <div class="checkout-item__details">
          <div class="checkout-item__top">
            <div>
              <h3 class="checkout-item__name">{{ item.product_name }}</h3>
              <p v-if="item.product_dosage" class="checkout-item__dosage">
                {{ item.product_dosage }}
              </p>
              <div class="checkout-item__badges">
                <span class="checkout-item__coa-badge">
                  <BasicIconNext name="FileCheck" :size="12" />
                  {{ t('aov.quality.coaIncluded') }}
                </span>
              </div>
            </div>
            <PremiumButton
              type="danger"
              variant="ghost"
              size="xs"
              icon-left="X"
              class="checkout-item__remove"
              @click="$emit('remove', item.product_id!)"
            />
          </div>

          <div class="checkout-item__bottom">
            <div class="checkout-item__quantity">
              <PremiumButton
                type="secondary"
                variant="ghost"
                size="xs"
                icon-left="Minus"
                class="checkout-item__qty-btn"
                :disabled="(item.quantity ?? 1) <= 1"
                @click="$emit('update-quantity', item, -1)"
              />
              <span class="checkout-item__qty-value">{{ item.quantity ?? 1 }}</span>
              <PremiumButton
                type="secondary"
                variant="ghost"
                size="xs"
                icon-left="Plus"
                class="checkout-item__qty-btn"
                @click="$emit('update-quantity', item, 1)"
              />
            </div>

            <div class="checkout-item__price">
              <span v-if="item.is_on_sale" class="checkout-item__price-old">
                {{ formatPrice((item.product_price ?? 0) * (item.quantity ?? 1)) }}
              </span>
              <span
                class="checkout-item__price-current"
                :class="{ 'checkout-item__price-current--sale': item.is_on_sale }"
              >
                {{ formatPrice(getLineTotal(item)) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="items.length === 0" class="checkout-cart__empty">
        <div class="checkout-cart__empty-icon">
          <BasicIconNext name="ShoppingCart" :size="48" />
        </div>
        <h3>{{ t('cart.empty') }}</h3>
        <p>{{ t('cart.emptyText') }}</p>
        <PremiumButton
          type="primary"
          variant="solid"
          size="md"
          :label="t('catalogue.title')"
          icon-left="ShoppingBag"
          @click="$router.push('/catalogue')"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { CartView } from '@/supabase/types/supabase.types'
import defaultImage from '@/assets/products/default/default-product-image.png'

defineProps<{
  items: CartView[]
}>()

defineEmits<{
  (e: 'remove', productId: string): void
  (e: 'update-quantity', item: CartView, delta: number): void
}>()

const { t } = useI18n()

function formatPrice(value: number | null | undefined) {
  if (value == null || isNaN(Number(value))) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))
}

function getLineTotal(item: CartView) {
  const qty = item.quantity ?? 1
  const price = item.is_on_sale
    ? (item.product_sale_price ?? item.product_price ?? 0)
    : (item.product_price ?? 0)
  return price * qty
}
</script>

<style scoped lang="less">
.checkout-cart {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid @neutral-100;

  &__header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%);
    border-radius: 14px;
    color: var(--primary-600);
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 4px;
  }

  &__subtitle {
    font-size: 14px;
    color: @neutral-500;
    margin: 0;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__empty {
    text-align: center;
    padding: 48px 24px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: @neutral-700;
      margin: 16px 0 8px;
    }

    p {
      font-size: 14px;
      color: @neutral-500;
      margin: 0 0 24px;
    }
  }

  &__empty-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @neutral-100;
    border-radius: 50%;
    margin: 0 auto;
    color: @neutral-400;
  }
}

.checkout-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: @neutral-50;
  border-radius: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: @neutral-100;
  }

  &__image {
    position: relative;
    width: 80px;
    height: 80px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid @neutral-200;
    }
  }

  &__badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: linear-gradient(135deg, @red-500 0%, @red-600 100%);
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 6px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }

  &__details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  &__name {
    font-size: 15px;
    font-weight: 600;
    color: @neutral-900;
    margin: 0;
    line-height: 1.3;
  }

  &__dosage {
    font-size: 13px;
    color: @neutral-500;
    margin: 4px 0 0;
  }

  &__badges {
    display: flex;
    gap: 6px;
    margin-top: 6px;
  }

  &__coa-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    background: rgba(var(--primary-500-rgb), 0.1);
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    color: var(--primary-500);
  }

  &__remove {
    flex-shrink: 0;
    min-width: 44px;
    min-height: 44px;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: 4px;
    background: white;
    padding: 4px;
    border-radius: 10px;
    border: 1px solid @neutral-200;
  }

  &__qty-btn {
    min-width: 32px;
    min-height: 32px;
    padding: 0;
  }

  &__qty-value {
    min-width: 32px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: @neutral-900;
  }

  &__price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  &__price-old {
    font-size: 12px;
    color: @neutral-400;
    text-decoration: line-through;
  }

  &__price-current {
    font-size: 16px;
    font-weight: 700;
    color: @neutral-900;

    &--sale {
      color: @red-600;
    }
  }
}

// Tablet
.respond-tablet({
  .checkout-cart {
    padding: 20px;
    border-radius: 20px;
  }

  .checkout-item {
    &__image {
      width: 70px;
      height: 70px;
    }
  }
});

// Mobile
.respond-mobile({
  .checkout-cart {
    padding: 16px;
    border-radius: 16px;

    &__header {
      gap: 12px;
      margin-bottom: 16px;
    }

    &__icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    &__title {
      font-size: 16px;
    }

    &__subtitle {
      font-size: 13px;
    }
  }

  .checkout-item {
    padding: 12px;
    gap: 12px;
    border-radius: 12px;

    &__image {
      width: 64px;
      height: 64px;
    }

    &__name {
      font-size: 14px;
    }

    &__dosage {
      font-size: 12px;
    }

    &__remove {
      min-width: 44px;
      min-height: 44px;
    }

    &__qty-btn {
      min-width: 44px;
      min-height: 44px;
    }

    &__qty-value {
      min-width: 28px;
      font-size: 13px;
    }

    &__price-current {
      font-size: 15px;
    }
  }
});
</style>
