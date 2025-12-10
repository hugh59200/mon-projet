<template>
  <ContentBlock variant="card" class="checkout-cart">
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
          <!-- Badge promo produit sur l'image -->
          <span
            v-if="item.is_on_sale"
            class="checkout-item__badge"
          >
            -{{ getDiscountInfo(item).productDiscount }}%
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
                <!-- Badge promo cumulée ou individuelle -->
                <template v-if="getDiscountInfo(item).totalDiscount > 0">
                  <span
                    v-if="getDiscountInfo(item).hasCumulatedDiscounts"
                    class="checkout-item__cumulated-badge"
                  >
                    <BasicIconNext name="Zap" :size="12" />
                    -{{ getDiscountInfo(item).totalDiscount }}% (Promo + Pack)
                  </span>
                  <template v-else>
                    <span
                      v-if="getDiscountInfo(item).productDiscount > 0"
                      class="checkout-item__promo-badge"
                    >
                      <BasicIconNext name="Tag" :size="12" />
                      -{{ getDiscountInfo(item).productDiscount }}%
                    </span>
                    <span
                      v-if="getDiscountInfo(item).packDiscount > 0"
                      class="checkout-item__pack-badge"
                    >
                      <BasicIconNext name="Package" :size="12" />
                      -{{ getDiscountInfo(item).packDiscount }}% pack
                    </span>
                  </template>
                </template>
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
  </ContentBlock>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SimpleCartItem } from '@/features/catalogue/cart/stores/useCartStore'
import { getCartItemDiscountInfo, type CartItemDiscountInfo } from '@/features/catalogue/cart/helpers/cartDiscountHelper'
import { DEFAULT_PRODUCT_IMAGE as defaultImage } from '@/config/productAssets'

defineProps<{
  items: SimpleCartItem[]
}>()

defineEmits<{
  (e: 'remove', productId: string): void
  (e: 'update-quantity', item: SimpleCartItem, delta: number): void
}>()

const { t } = useI18n()

function formatPrice(value: number | null | undefined) {
  if (value == null || isNaN(Number(value))) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))
}

function getDiscountInfo(item: SimpleCartItem): CartItemDiscountInfo {
  return getCartItemDiscountInfo(item)
}

function getLineTotal(item: SimpleCartItem) {
  const info = getCartItemDiscountInfo(item)
  return info.finalUnitPrice * (item.quantity ?? 1)
}
</script>

<style scoped lang="less">
.checkout-cart {
  // Styles de base gérés par ContentBlock

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
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.15) 0%, rgba(var(--primary-500-rgb), 0.08) 100%);
    border-radius: 14px;
    color: var(--primary-500);
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 4px;
  }

  &__subtitle {
    font-size: 14px;
    color: var(--text-muted);
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
      color: var(--text-secondary);
      margin: 16px 0 8px;
    }

    p {
      font-size: 14px;
      color: var(--text-muted);
      margin: 0 0 24px;
    }
  }

  &__empty-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-subtle);
    border-radius: 50%;
    margin: 0 auto;
    color: var(--text-muted);
  }
}

.checkout-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-subtle);
  border-radius: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(var(--primary-500-rgb), 0.05);
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
      border: 1px solid var(--border-default);
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
    color: var(--text-primary);
    margin: 0;
    line-height: 1.3;
  }

  &__dosage {
    font-size: 13px;
    color: var(--text-muted);
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

  &__promo-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    background: rgba(@danger-500, 0.1);
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: @danger-600;
  }

  &__pack-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    background: rgba(@success-500, 0.1);
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: @success-600;
  }

  &__cumulated-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    background: linear-gradient(135deg, rgba(@success-500, 0.12) 0%, rgba(@primary-500, 0.12) 100%);
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    color: @success-600;
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
    background: var(--bg-subtle);
    padding: 4px;
    border-radius: 10px;
    border: 1px solid var(--border-default);
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
    color: var(--text-primary);
  }

  &__price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  &__price-old {
    font-size: 12px;
    color: var(--text-muted);
    text-decoration: line-through;
  }

  &__price-current {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);

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
