<template>
  <article
    class="product-card"
    :class="{ 'product-card--list': viewMode === 'list' }"
    @click="$emit('view', product.slug || product.id)"
  >
    <!-- Badge Promo -->
    <div
      v-if="product.is_on_sale"
      class="product-card__promo"
    >
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
      {{ product.stock }} {{ t('catalogue.product.remaining') }}
    </div>

    <!-- Image Container -->
    <div class="product-card__image">
      <!-- Category Badge -->
      <div
        class="product-card__category"
        :style="{ '--category-color': categoryColor }"
      >
        <span
          class="product-card__category-dot"
          :style="{ background: categoryColor }"
        ></span>
        <span>{{ productCategory }}</span>
      </div>

      <!-- Product Image -->
      <div class="product-card__image-wrapper">
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
        :class="{ 'product-card__wishlist--active': isInWishlist }"
      />
    </div>

    <!-- Content -->
    <div class="product-card__body">
      <!-- Name -->
      <h3 class="product-card__name">{{ productName }}</h3>

      <!-- Specs Row (desktop only) -->
      <div
        v-if="!isMobile"
        class="product-card__specs"
      >
        <span class="product-card__spec product-card__spec--highlight">
          <BasicIconNext
            name="FlaskConical"
            :size="12"
          />
          {{ t('catalogue.product.purity') }}
        </span>
        <span class="product-card__spec">
          <BasicIconNext
            name="FileCheck"
            :size="12"
          />
          COA
        </span>
        <span
          v-if="product.dosage"
          class="product-card__spec"
        >
          {{ product.dosage }}
        </span>
      </div>

      <!-- Price -->
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

      <!-- Actions -->
      <div class="product-card__actions">
        <!-- Mobile: icon button -->
        <button
          v-if="isMobile"
          class="product-card__icon-btn"
          :disabled="(product.stock ?? 0) <= 0"
          @click.stop="$emit('add', product)"
        >
          <BasicIconNext
            name="ShoppingCart"
            :size="20"
          />
        </button>
        <!-- Desktop: full button -->
        <PremiumButton
          v-else
          type="primary"
          variant="solid"
          size="sm"
          :label="t('catalogue.product.add')"
          icon-left="ShoppingCart"
          :disabled="(product.stock ?? 0) <= 0"
          class="product-card__btn"
          @click.stop="$emit('add', product)"
        />
        <!-- Buy now (desktop only) -->
        <PremiumButton
          v-if="!isMobile && (product.stock ?? 0) > 0"
          type="secondary"
          variant="outline"
          size="sm"
          :label="t('catalogue.product.buyNow')"
          icon-left="Zap"
          class="product-card__btn"
          @click.stop="$emit('buy', product)"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { useTranslatedProduct } from '@/composables/useTranslated'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'
  import type { Products } from '@/supabase/types/supabase.types'
  import { computed, toRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import WishlistButton from '../components/WishlistButton.vue'
  import { useWishlistStore } from '../stores/useWishlistStore'

  const { t } = useI18n()
  const { isMobile } = useDeviceBreakpoint()
  const wishlistStore = useWishlistStore()

  const props = defineProps<{
    product: Products
    viewMode?: 'grid' | 'list'
  }>()

  const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))

  const { name: productName, category: productCategory } = useTranslatedProduct(
    toRef(props, 'product'),
  )

  defineEmits(['view', 'add', 'buy'])

  const defaultImage = '/images/default-product.png'

  // Couleurs disponibles pour les catégories
  const CATEGORY_COLORS = [
    'var(--success-500)',
    'var(--warning-500)',
    'var(--info-500)',
    'var(--purple-500)',
    'var(--danger-500)',
    'var(--pink-500)',
    'var(--teal-500)',
    'var(--cyan-500)',
  ]

  // Hash simple pour obtenir une couleur déterministe par catégorie
  function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  const categoryColor = computed(() => {
    const cat = props.product.category || ''
    if (!cat) return 'var(--primary-500)'
    const index = hashString(cat) % CATEGORY_COLORS.length
    return CATEGORY_COLORS[index]
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
  @import '@designSystem/fondation/breakpoints/responsive-mixins.less';

  // ============ VARIABLES ============
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
  @radius-card: 16px;
  @radius-sm: 8px;

  // ============ CARD BASE ============
  .product-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background:
      linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.02) 0%, transparent 50%),
      linear-gradient(315deg, rgba(var(--primary-400-rgb), 0.015) 0%, transparent 40%),
      var(--surface-1);
    border: 1px solid var(--border-default);
    border-radius: @radius-card;
    overflow: hidden;
    cursor: pointer;

    .respond-mobile({
      border-radius: 12px;
    });
    transition:
      border-color 0.2s @ease,
      box-shadow 0.2s @ease;

    // Variables sémantiques pour le contenu
    --card-text: var(--text-primary);
    --card-text-secondary: var(--text-secondary);
    --card-text-muted: var(--text-muted);
    --card-bg-subtle: var(--bg-subtle);

    // Hover state
    &:hover {
      border-color: rgba(var(--primary-500-rgb), 0.4);
      box-shadow: var(--shadow-lg);
    }

    // ============ PROMO BADGE ============
    &__promo {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 10;
      padding: 5px 10px;
      background: @danger-500;
      border-radius: 6px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 700;
      color: @white;
      box-shadow: 0 2px 8px rgba(var(--danger-500-rgb), 0.4);

      .respond-mobile({
        top: 8px;
        left: 8px;
        padding: 4px 8px;
        font-size: 10px;
        border-radius: 4px;
      });
    }

    // ============ STOCK BADGE ============
    &__stock-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 10;
      padding: 5px 10px;
      border-radius: 6px;
      font-family: @font-body;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;

      &--out {
        background: rgba(var(--danger-500-rgb), 0.12);
        color: @danger-500;
      }

      &--low {
        background: @warning-500;
        color: @white;
      }

      .respond-mobile({
        top: 8px;
        left: 8px;
        padding: 3px 6px;
        font-size: 8px;
        border-radius: 4px;
      });
    }

    // Si promo présente, décaler le stock badge
    &__promo + &__stock-badge {
      top: 46px;

      .respond-mobile({
        top: 34px;
      });
    }

    // ============ IMAGE SECTION ============
    &__image {
      position: relative;
      background: var(--bg-subtle);
      padding: 20px;

      .respond-tablet({
        padding: 16px;
      });

      .respond-mobile({
        padding: 0;
      });
    }

    &__image-wrapper {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 80%;
        max-height: 80%;
        object-fit: contain;
        transition: transform 0.3s @ease;

        .respond-mobile({
          max-width: 90%;
          max-height: 90%;
        });
      }
    }

    // ============ CATEGORY BADGE ============
    &__category {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      background: rgba(var(--bg-surface-rgb), 0.9);
      backdrop-filter: blur(8px);
      border: 1px solid var(--category-color, var(--primary-500));
      border-radius: 6px;
      font-family: @font-body;
      font-size: 9px;
      font-weight: 600;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.4px;

      // Mobile: masquer pour éviter chevauchement avec badge promo
      .respond-mobile({
        display: none;
      });
    }

    &__category-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;

      .respond-mobile({
        width: 5px;
        height: 5px;
      });
    }

    // ============ WISHLIST ============
    &__wishlist {
      position: absolute;
      bottom: 12px;
      right: 12px;
      z-index: 10;
      opacity: 0;
      transform: translateY(4px);
      transition:
        opacity 0.2s @ease,
        transform 0.2s @ease;
    }

    &:hover &__wishlist,
    &__wishlist:focus-within,
    &__wishlist--active {
      opacity: 1;
      transform: translateY(0);
    }

    // Mobile: toujours visible, bord droit aligné avec la card
    .respond-mobile({
      &__wishlist {
        opacity: 1;
        transform: none;
        bottom: -16px;
        right: 0;
      }
    });

    // ============ BODY SECTION ============
    &__body {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px 20px 20px;

      .respond-tablet({
        padding: 14px 16px 16px;
        gap: 10px;
      });

      .respond-mobile({
        padding: 6px 10px 8px;
        gap: 2px;
      });
    }

    // ============ NAME ============
    &__name {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: var(--card-text);
      line-height: 1.35;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.7em; // 2 lignes minimum pour alignement

      .respond-mobile({
        font-size: 15px;
        -webkit-line-clamp: 1;
        min-height: unset;
        padding-left: 4px;
        margin-bottom: 4px;
      });
    }

    // ============ SPECS ============
    &__specs {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    &__spec {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: var(--bg-subtle);
      border-radius: 4px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 500;
      color: var(--card-text-muted);

      svg {
        flex-shrink: 0;
      }

      &--highlight {
        background: rgba(var(--success-500-rgb), 0.12);
        color: @success-500;
        font-weight: 600;

        svg {
          color: @success-500;
        }
      }

      .respond-mobile({
        padding: 3px 6px;
        font-size: 10px;
        gap: 3px;

        svg {
          width: 10px;
          height: 10px;
        }
      });
    }

    // ============ PRICE ============
    &__price {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid var(--border-default);

      .respond-mobile({
        padding-top: 10px;
        gap: 6px;
      });
    }

    &__price-old {
      font-family: @font-body;
      font-size: 13px;
      color: var(--card-text-muted);
      text-decoration: line-through;

      .respond-mobile({
        font-size: 12px;
      });
    }

    &__price-current {
      font-family: @font-display;
      font-size: 22px;
      font-weight: 700;
      color: var(--card-text);
      letter-spacing: -0.02em;

      &--sale {
        color: @danger-500;
      }

      .respond-mobile({
        font-size: 18px;
      });
    }

    // ============ ACTIONS ============
    &__actions {
      display: flex;
      gap: 8px;
      margin-top: 4px;

      .respond-mobile({
        margin-top: 2px;
      });
    }

    &__btn {
      flex: 1;
    }

    &__icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 36px;
      background: var(--primary-500);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;

      &:active {
        transform: scale(0.95);
        background: var(--primary-600);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    // ============ LIST MODE ============
    &--list {
      flex-direction: row;
      gap: 0;

      .product-card__image {
        width: 200px;
        flex-shrink: 0;

        .respond-tablet({
          width: 160px;
        });

        .respond-mobile({
          width: 120px;
        });
      }

      .product-card__body {
        flex: 1;
        justify-content: center;
        padding: 20px;

        .respond-mobile({
          padding: 12px;
        });
      }

      .product-card__name {
        font-size: 18px;
        -webkit-line-clamp: 1;
        min-height: auto;

        .respond-mobile({
          font-size: 14px;
        });
      }

      .product-card__actions {
        max-width: 280px;

        .respond-mobile({
          max-width: 100%;
        });
      }
    }

    // ============ TOUCH FEEDBACK ============
    .respond-mobile({
      -webkit-tap-highlight-color: transparent;

      &:active {
        transform: scale(0.98);
        transition: transform 0.1s ease;
      }
    });
  }
</style>
