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
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        />
      </svg>
      <span>-{{ discountPercent }}%</span>
    </div>

    <!-- Stock Badge -->
    <div
      v-if="(product.stock ?? 0) <= 0"
      class="product-card__stock-badge product-card__stock-badge--out"
    >
      Rupture
    </div>
    <div
      v-else-if="(product.stock ?? 0) < 5"
      class="product-card__stock-badge product-card__stock-badge--low"
    >
      Stock limité
    </div>

    <!-- Image -->
    <div class="product-card__image">
      <div class="product-card__image-inner">
        <img
          :src="product.image || defaultImage"
          :alt="product.name"
          loading="lazy"
        />
      </div>

      <!-- Quick Actions (on hover) -->
      <div class="product-card__quick-actions">
        <button
          class="product-card__quick-btn"
          title="Voir le produit"
          @click.stop="$emit('view', product.id)"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle
              cx="12"
              cy="12"
              r="3"
            />
          </svg>
        </button>
        <button
          v-if="(product.stock ?? 0) > 0"
          class="product-card__quick-btn product-card__quick-btn--primary"
          title="Ajouter au panier"
          @click.stop="$emit('add', product)"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle
              cx="9"
              cy="21"
              r="1"
            />
            <circle
              cx="20"
              cy="21"
              r="1"
            />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="product-card__content">
      <!-- Category -->
      <div class="product-card__category">
        <span
          class="product-card__category-dot"
          :style="{ background: categoryColor }"
        ></span>
        <span>{{ product.category }}</span>
      </div>

      <!-- Name -->
      <h3 class="product-card__name">{{ product.name }}</h3>

      <!-- Specs -->
      <div class="product-card__specs">
        <div class="product-card__spec">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <span>{{ product.purity }}%</span>
        </div>
        <div
          v-if="product.dosage"
          class="product-card__spec"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
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
        <button
          class="product-card__btn product-card__btn--primary"
          :disabled="(product.stock ?? 0) <= 0"
          @click.stop="$emit('add', product)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle
              cx="9"
              cy="21"
              r="1"
            />
            <circle
              cx="20"
              cy="21"
              r="1"
            />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          <span>{{ (product.stock ?? 0) > 0 ? 'Ajouter' : 'Rupture' }}</span>
        </button>

        <button
          v-if="(product.stock ?? 0) > 0"
          class="product-card__btn product-card__btn--secondary"
          @click.stop="$emit('buy', product)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Acheter</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import type { Products } from '@/supabase/types/supabase.types'
  import { computed } from 'vue'

  const props = defineProps<{
    product: Products
    viewMode?: 'grid' | 'list'
  }>()

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
      border-color: rgba(var(--primary-500-rgb), 0.3);
      transform: translateY(-4px);
      box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(var(--primary-500-rgb), 0.1);

      .product-card__image-inner img {
        transform: scale(1.05);
      }

      .product-card__quick-actions {
        opacity: 1;
        transform: translateY(0);
      }
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
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      border-radius: 8px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 700;
      color: white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
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
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
      }

      &--low {
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.3);
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

    &__quick-actions {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: all 0.3s @ease;
    }

    &__quick-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: @neutral-300;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(30, 41, 59, 0.95);
        color: white;
        transform: scale(1.05);
      }

      &--primary {
        background: var(--primary-500);
        border-color: var(--primary-500);
        color: white;

        &:hover {
          background: var(--primary-600);
        }
      }
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
        color: #ef4444;
      }
    }

    // ============ ACTIONS ============
    &__actions {
      display: flex;
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
          transform: translateY(-1px);
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

      .product-card__quick-actions {
        display: none;
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
