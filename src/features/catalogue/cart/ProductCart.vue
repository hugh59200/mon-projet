<template>
  <article
    class="product-card"
    :class="{ 'product-card--list': viewMode === 'list' }"
    @click="$emit('view', product.id)"
  >
    <!-- Badge Promo -->
    <div
      v-if="product.is_on_sale"
      class="product-card__promo"
    >
      <BasicIconNext
        name="Star"
        :size="12"
      />
      <span>-{{ discountPercent }}%</span>
    </div>

    <!-- Stock Badge -->
    <div
      v-if="(product.stock ?? 0) <= 0"
      class="product-card__stock-badge product-card__stock-badge--out"
    >
      {{ t('catalogue.product.outOfStock') }}
    </div>
    <div
      v-else-if="(product.stock ?? 0) < 5"
      class="product-card__stock-badge product-card__stock-badge--low"
    >
      {{ t('catalogue.product.lowStock') }}
    </div>

    <!-- Image -->
    <div class="product-card__image">
      <div class="product-card__image-inner">
        <img
          :src="product.image || defaultImage"
          :alt="productName"
          loading="lazy"
        />
      </div>

      <!-- Wishlist Button -->
      <WishlistButton
        :product-id="product.id"
        class="product-card__wishlist"
      />
    </div>

    <!-- Content -->
    <div class="product-card__content">
      <!-- Category -->
      <div class="product-card__category">
        <span
          class="product-card__category-dot"
          :style="{ background: categoryColor }"
        ></span>
        <span>{{ productCategory }}</span>
      </div>

      <!-- Name -->
      <h3 class="product-card__name">{{ productName }}</h3>

      <!-- Specs -->
      <div class="product-card__specs">
        <div class="product-card__spec">
          <BasicIconNext
            name="FlaskConical"
            :size="14"
          />
          <span>≥99%</span>
        </div>
        <div
          v-if="product.dosage"
          class="product-card__spec"
        >
          <BasicIconNext
            name="Shield"
            :size="14"
          />
          <span>{{ product.dosage }}</span>
        </div>
      </div>

      <!-- Price -->
      <div class="product-card__pricing">
        <div class="product-card__price">
          <span
            v-if="product.is_on_sale && product.sale_price"
            class="product-card__price-old"
          >
            {{ product.price.toFixed(2) }}€
          </span>
          <span
            class="product-card__price-current"
            :class="{ 'product-card__price-current--sale': product.is_on_sale }"
          >
            {{ currentPrice.toFixed(2) }}€
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="product-card__actions">
        <PremiumButton
          type="primary"
          variant="solid"
          size="sm"
          :label="
            (product.stock ?? 0) > 0
              ? t('catalogue.product.add')
              : t('catalogue.product.outOfStock')
          "
          icon-left="ShoppingCart"
          :disabled="(product.stock ?? 0) <= 0"
          :shine="true"
          @click.stop="$emit('add', product)"
        />

        <PremiumButton
          v-if="(product.stock ?? 0) > 0"
          type="secondary"
          size="sm"
          :label="t('catalogue.product.buyNow')"
          icon-left="Zap"
          @click.stop="$emit('buy', product)"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { useTranslatedProduct } from '@/composables/useTranslated'
  import type { Products } from '@/supabase/types/supabase.types'
  import { computed, toRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import WishlistButton from '../components/WishlistButton.vue'

  const { t } = useI18n()

  const props = defineProps<{
    product: Products
    viewMode?: 'grid' | 'list'
  }>()

  // Traductions automatiques du produit
  const { name: productName, category: productCategory } = useTranslatedProduct(
    toRef(props, 'product'),
  )

  defineEmits(['view', 'add', 'buy'])

  const defaultImage = '/images/default-product.png'

  const categoryColors: Record<string, string> = {
    Récupération: '#10B981',
    'Perte de poids': '#F59E0B',
    Croissance: '#3B82F6',
    'Anti-âge': '#8B5CF6',
    Performance: '#EF4444',
    'Bien-être': '#EC4899',
    Hormonal: '#6366F1',
    Nootropique: '#14B8A6',
    Cosmétique: '#F472B6',
    Santé: '#22C55E',
  }

  const categoryColor = computed(() => {
    return categoryColors[props.product.category || ''] || 'var(--primary-500)'
  })

  const currentPrice = computed(() => {
    if (props.product.is_on_sale && props.product.sale_price) {
      return props.product.sale_price
    }
    return props.product.price
  })

  const discountPercent = computed(() => {
    if (props.product.is_on_sale && props.product.sale_price) {
      return Math.round((1 - props.product.sale_price / props.product.price) * 100)
    }
    return 0
  })
</script>

<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .product-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: rgba(var(--secondary-900-rgb), 0.95);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s @ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

    &:hover {
      border-color: rgba(var(--primary-500-rgb), 0.4);
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(var(--primary-500-rgb), 0.15);
      background: rgba(var(--secondary-900-rgb), 1);
    }

    // ============ BADGES ============
    &__promo {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      background: linear-gradient(135deg, @danger-500 0%, @danger-600 100%);
      border-radius: 8px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 700;
      color: @white;
      box-shadow: 0 4px 12px rgba(var(--danger-500-rgb), 0.4);
    }

    &__stock-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 10;
      padding: 5px 10px;
      border-radius: 6px;
      font-family: @font-body;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &--out {
        background: rgba(var(--danger-500-rgb), 0.15);
        color: @danger-500;
        border: 1px solid rgba(var(--danger-500-rgb), 0.3);
      }

      &--low {
        background: rgba(var(--warning-500-rgb), 0.15);
        color: @warning-500;
        border: 1px solid rgba(var(--warning-500-rgb), 0.3);
      }
    }

    // ============ IMAGE ============
    &__image {
      position: relative;
      padding: 16px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%);
    }

    &__image-inner {
      position: relative;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
      overflow: hidden;

      img {
        max-width: 85%;
        max-height: 85%;
        object-fit: contain;
        transition: transform 0.4s @ease;
      }
    }

    &__wishlist {
      position: absolute;
      bottom: 12px;
      right: 12px;
      z-index: 10;
      opacity: 0;
      transform: scale(0.9);
      transition: all 0.2s @ease;
    }

    &:hover &__wishlist,
    &__wishlist:focus-within {
      opacity: 1;
      transform: scale(1);
    }

    // Toujours visible si actif (favori sélectionné)
    &__wishlist:has(.wishlist-button--active) {
      opacity: 1;
      transform: scale(1);
    }

    // ============ CONTENT ============
    &__content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 0 20px 20px;
    }

    &__category {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 500;
      color: @neutral-400;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &__category-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &__name {
      font-family: @font-display;
      font-size: 17px;
      font-weight: 600;
      color: @neutral-100;
      line-height: 1.3;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &__specs {
      display: flex;
      gap: 12px;
    }

    &__spec {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-400;

      svg {
        color: @neutral-500;
      }
    }

    // ============ PRICING ============
    &__pricing {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    &__price {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    &__price-old {
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-500;
      text-decoration: line-through;
    }

    &__price-current {
      font-family: @font-display;
      font-size: 22px;
      font-weight: 700;
      color: @neutral-100;

      &--sale {
        color: @danger-500;
      }
    }

    // ============ ACTIONS ============
    &__actions {
      display: flex;
      justify-content: space-around;
      gap: 8px;
      margin-top: 4px;
    }

    &__btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 16px;
      border-radius: 12px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s @ease;
      border: none;

      &--primary {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.25);

        &:hover:not(:disabled) {
          box-shadow: 0 6px 16px rgba(var(--primary-500-rgb), 0.35);
          background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-500) 100%);
        }

        &:disabled {
          background: @neutral-700;
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.6;
        }
      }

      &--secondary {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: @neutral-300;

        &:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          color: white;
        }
      }
    }

    // ============ LIST MODE ============
    &--list {
      flex-direction: row;
      padding: 16px;
      gap: 20px;

      .product-card__image {
        width: 180px;
        flex-shrink: 0;
        padding: 0;
      }

      .product-card__image-inner {
        aspect-ratio: 1;
      }

      .product-card__content {
        flex: 1;
        padding: 0;
        justify-content: center;
      }

      .product-card__name {
        font-size: 20px;
        -webkit-line-clamp: 1;
      }

      .product-card__actions {
        flex-direction: row;
        max-width: 300px;
      }
    }

    // ============ RESPONSIVE ============
    @media (max-width: 600px) {
      &__content {
        padding: 0 16px 16px;
      }

      &__name {
        font-size: 15px;
      }

      &__price-current {
        font-size: 18px;
      }

      &__actions {
        flex-direction: column;
      }

      &__btn {
        padding: 10px 12px;
        font-size: 12px;
      }
    }
  }
</style>
