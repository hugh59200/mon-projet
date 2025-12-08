<template>
  <section class="best-sellers">
    <div class="best-sellers__container">
      <!-- Header -->
      <div class="best-sellers__header">
        <div class="best-sellers__title-group">
          <span class="best-sellers__badge">
            <BasicIconNext
              name="TrendingUp"
              :size="14"
            />
            {{ t('home.bestSellers.badge') }}
          </span>
          <h2 class="best-sellers__title">{{ t('home.bestSellers.title') }}</h2>
          <p class="best-sellers__subtitle">{{ t('home.bestSellers.subtitle') }}</p>
        </div>
        <PremiumButton
          type="primary"
          variant="outline"
          size="md"
          :label="t('home.bestSellers.viewAll')"
          icon-right="ArrowRight"
          class="best-sellers__view-all"
          @click="goToCatalogue"
        />
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="best-sellers__loading"
      >
        <div class="best-sellers__podium-skeleton">
          <div class="best-sellers__skeleton best-sellers__skeleton--2"></div>
          <div class="best-sellers__skeleton best-sellers__skeleton--1"></div>
          <div class="best-sellers__skeleton best-sellers__skeleton--3"></div>
        </div>
      </div>

      <!-- VERSION MOBILE : Liste simple -->
      <div
        v-if="!loading"
        class="best-sellers__mobile-list"
      >
        <div
          v-for="(product, index) in topProducts"
          :key="product.id"
          class="mobile-item"
          @click="goToProduct(product.id)"
        >
          <span class="mobile-item__rank">#{{ index + 1 }}</span>
          <div class="mobile-item__image">
            <img
              :src="product.image || defaultImage"
              :alt="getProductName(product)"
            />
          </div>
          <div class="mobile-item__content">
            <span class="mobile-item__name">{{ getProductName(product) }}</span>
            <span class="mobile-item__price">{{ getPrice(product).toFixed(2) }}€</span>
          </div>
          <button
            class="mobile-item__btn"
            @click.stop="addToCart(product)"
          >
            <BasicIconNext
              name="Plus"
              :size="18"
            />
          </button>
        </div>
      </div>

      <!-- VERSION DESKTOP : Podium Section -->
      <div
        v-if="!loading"
        class="best-sellers__podium-section"
      >
        <div class="best-sellers__podium">
          <!-- 2ème place (gauche) -->
          <div
            v-if="topProducts[1]"
            class="podium-card podium-card--second"
            @click="goToProduct(topProducts[1].id)"
          >
            <div class="podium-card__rank">
              <span class="podium-card__rank-number">2</span>
            </div>
            <div class="podium-card__image">
              <img
                :src="topProducts[1].image || defaultImage"
                :alt="getProductName(topProducts[1])"
                loading="lazy"
              />
            </div>
            <div class="podium-card__content">
              <span class="podium-card__category">{{ getProductCategory(topProducts[1]) }}</span>
              <h3 class="podium-card__name">{{ getProductName(topProducts[1]) }}</h3>
              <div class="podium-card__price">
                <span
                  v-if="topProducts[1].is_on_sale && topProducts[1].sale_price"
                  class="podium-card__price-old"
                >{{ topProducts[1].price.toFixed(2) }}€</span>
                <span
                  class="podium-card__price-current"
                  :class="{ 'podium-card__price-current--sale': topProducts[1].is_on_sale }"
                >{{ getPrice(topProducts[1]).toFixed(2) }}€</span>
              </div>
            </div>
            <button
              class="podium-card__btn"
              @click.stop="addToCart(topProducts[1])"
            >
              <BasicIconNext
                name="ShoppingCart"
                :size="16"
              />
              <span>{{ t('home.bestSellers.addToCart') }}</span>
            </button>
            <div class="podium-card__pedestal podium-card__pedestal--second">
              <span class="podium-card__pedestal-number">2</span>
            </div>
          </div>

          <!-- 1ère place (centre) -->
          <div
            v-if="topProducts[0]"
            class="podium-card podium-card--first"
            @click="goToProduct(topProducts[0].id)"
          >
            <div class="podium-card__crown">
              <BasicIconNext
                name="Crown"
                :size="24"
              />
            </div>
            <div class="podium-card__rank podium-card__rank--first">
              <span class="podium-card__rank-number">1</span>
            </div>
            <div class="podium-card__image">
              <img
                :src="topProducts[0].image || defaultImage"
                :alt="getProductName(topProducts[0])"
                loading="lazy"
              />
            </div>
            <div class="podium-card__content">
              <span class="podium-card__category">{{ getProductCategory(topProducts[0]) }}</span>
              <h3 class="podium-card__name">{{ getProductName(topProducts[0]) }}</h3>
              <div class="podium-card__price">
                <span
                  v-if="topProducts[0].is_on_sale && topProducts[0].sale_price"
                  class="podium-card__price-old"
                >{{ topProducts[0].price.toFixed(2) }}€</span>
                <span
                  class="podium-card__price-current"
                  :class="{ 'podium-card__price-current--sale': topProducts[0].is_on_sale }"
                >{{ getPrice(topProducts[0]).toFixed(2) }}€</span>
              </div>
            </div>
            <button
              class="podium-card__btn"
              @click.stop="addToCart(topProducts[0])"
            >
              <BasicIconNext
                name="ShoppingCart"
                :size="16"
              />
              <span>{{ t('home.bestSellers.addToCart') }}</span>
            </button>
            <div class="podium-card__pedestal podium-card__pedestal--first">
              <span class="podium-card__pedestal-number">1</span>
            </div>
          </div>

          <!-- 3ème place (droite) -->
          <div
            v-if="topProducts[2]"
            class="podium-card podium-card--third"
            @click="goToProduct(topProducts[2].id)"
          >
            <div class="podium-card__rank">
              <span class="podium-card__rank-number">3</span>
            </div>
            <div class="podium-card__image">
              <img
                :src="topProducts[2].image || defaultImage"
                :alt="getProductName(topProducts[2])"
                loading="lazy"
              />
            </div>
            <div class="podium-card__content">
              <span class="podium-card__category">{{ getProductCategory(topProducts[2]) }}</span>
              <h3 class="podium-card__name">{{ getProductName(topProducts[2]) }}</h3>
              <div class="podium-card__price">
                <span
                  v-if="topProducts[2].is_on_sale && topProducts[2].sale_price"
                  class="podium-card__price-old"
                >{{ topProducts[2].price.toFixed(2) }}€</span>
                <span
                  class="podium-card__price-current"
                  :class="{ 'podium-card__price-current--sale': topProducts[2].is_on_sale }"
                >{{ getPrice(topProducts[2]).toFixed(2) }}€</span>
              </div>
            </div>
            <button
              class="podium-card__btn"
              @click.stop="addToCart(topProducts[2])"
            >
              <BasicIconNext
                name="ShoppingCart"
                :size="16"
              />
              <span>{{ t('home.bestSellers.addToCart') }}</span>
            </button>
            <div class="podium-card__pedestal podium-card__pedestal--third">
              <span class="podium-card__pedestal-number">3</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mentions Honorables -->
      <div
        v-if="!loading && honorableMentions.length > 0"
        class="best-sellers__honorable"
      >
        <div class="best-sellers__honorable-header">
          <BasicIconNext
            name="Award"
            :size="16"
          />
          <span>{{ t('home.bestSellers.honorable') }}</span>
        </div>
        <div class="best-sellers__honorable-list">
          <div
            v-for="(product, index) in honorableMentions"
            :key="product.id"
            class="honorable-card"
            @click="goToProduct(product.id)"
          >
            <span class="honorable-card__rank">#{{ index + 4 }}</span>
            <div class="honorable-card__image">
              <img
                :src="product.image || defaultImage"
                :alt="getProductName(product)"
                loading="lazy"
              />
            </div>
            <div class="honorable-card__content">
              <h4 class="honorable-card__name">{{ getProductName(product) }}</h4>
              <span class="honorable-card__price">{{ getPrice(product).toFixed(2) }}€</span>
            </div>
            <button
              class="honorable-card__btn"
              @click.stop="addToCart(product)"
            >
              <BasicIconNext
                name="Plus"
                :size="16"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile CTA -->
      <PremiumButton
        type="primary"
        variant="solid"
        size="lg"
        width="full"
        :label="t('home.bestSellers.viewAll')"
        icon-right="ArrowRight"
        class="best-sellers__mobile-cta"
        @click="goToCatalogue"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { sortByTrendingRank } from '@/config/trendingPeptides'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useProductsStore } from '@/features/catalogue/composables/useProducts'
  import type { Products } from '@/supabase/types/supabase.types'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const { t, locale } = useI18n()
  const router = useRouter()
  const cartStore = useCartStore()
  const productsStore = useProductsStore()
  const { products, loading } = storeToRefs(productsStore)

  const defaultImage = '/images/default-product.png'

  // Produits triés par tendance mondiale 2025
  const trendingProducts = computed(() => {
    const availableProducts = (products.value as Products[]).filter(
      (p) => (p.stock ?? 0) > 0
    )
    return sortByTrendingRank(availableProducts)
  })

  // Top 3 pour le podium
  const topProducts = computed(() => {
    return trendingProducts.value.slice(0, 3)
  })

  // Mentions honorables (positions 4-8)
  const honorableMentions = computed(() => {
    return trendingProducts.value.slice(3, 8)
  })

  function getProductName(product: Products): string {
    if (product.name_i18n && typeof product.name_i18n === 'object') {
      const i18n = product.name_i18n as Record<string, string>
      return i18n[locale.value] || i18n['fr'] || product.name
    }
    return product.name
  }

  function getProductCategory(product: Products): string {
    if (product.category_i18n && typeof product.category_i18n === 'object') {
      const i18n = product.category_i18n as Record<string, string>
      return i18n[locale.value] || i18n['fr'] || product.category || ''
    }
    return product.category || ''
  }

  function getPrice(product: Products): number {
    if (product.is_on_sale && product.sale_price) {
      return product.sale_price
    }
    return product.price
  }

  function goToProduct(id: string) {
    router.push({ name: 'product', params: { id } })
  }

  function goToCatalogue() {
    router.push('/catalogue')
  }

  function addToCart(product: Products) {
    cartStore.addToCart(product)
  }

  onMounted(() => {
    productsStore.load()
  })
</script>

<style scoped lang="less">
  @import '@designSystem/fondation/breakpoints/responsive-mixins.less';

  // ============ VARIABLES ============
  @font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
  @font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  // Couleurs podium
  @gold: #ffd700;
  @gold-dark: #b8860b;
  @silver: #c0c0c0;
  @silver-dark: #808080;
  @bronze: #cd7f32;
  @bronze-dark: #8b4513;

  // ============ CONTAINER ============
  .best-sellers {
    width: 100%;

    &__container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 50px;

      .respond-tablet({
        padding: 0 24px;
      });

      .respond-mobile({
        padding: 0 16px;
      });
    }

    // ============ HEADER ============
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
      gap: 24px;

      .respond-mobile({
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 24px;
      });
    }

    &__title-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: linear-gradient(135deg, rgba(@gold, 0.15) 0%, rgba(@gold-dark, 0.1) 100%);
      border: 1px solid rgba(@gold, 0.3);
      border-radius: 100px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: @gold;
      width: fit-content;

      svg {
        color: @gold;
      }
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(28px, 4vw, 40px);
      font-weight: 600;
      color: var(--content-block-text);
      margin: 0;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    &__subtitle {
      font-family: @font-body;
      font-size: 16px;
      color: var(--content-block-text-secondary);
      margin: 0;
      max-width: 400px;
    }

    &__view-all {
      flex-shrink: 0;

      .respond-mobile({
        display: none;
      });
    }

    &__mobile-cta {
      display: none;
      margin-top: 32px;

      .respond-mobile({
        display: flex;
      });
    }

    // ============ LOADING ============
    &__loading {
      padding: 40px 0;
    }

    &__podium-skeleton {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 24px;
      height: 400px;
    }

    &__skeleton {
      background: linear-gradient(
        90deg,
        rgba(var(--secondary-700-rgb), 0.5) 25%,
        rgba(var(--secondary-600-rgb), 0.5) 50%,
        rgba(var(--secondary-700-rgb), 0.5) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 16px;
      width: 280px;

      &--1 {
        height: 380px;
      }
      &--2 {
        height: 320px;
      }
      &--3 {
        height: 280px;
      }
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    // ============ VERSION MOBILE ============
    &__mobile-list {
      display: none;

      .respond-mobile({
        display: flex;
        flex-direction: column;
        gap: 12px;
      });
    }

    // ============ PODIUM SECTION ============
    &__podium-section {
      margin-bottom: 32px;

      .respond-mobile({
        display: none;
      });
    }

    &__podium {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 24px;
      padding-top: 24px;

      .respond-tablet({
        gap: 16px;
      });
    }

    // ============ HONORABLE SECTION ============
    &__honorable {
      border-top: 1px solid var(--content-block-border);
      padding-top: 24px;

      .respond-mobile({
        display: none;
      });
    }

    &__honorable-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: var(--content-block-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;

      svg {
        color: var(--primary-400);
      }
    }

    &__honorable-list {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding-bottom: 8px;
      scrollbar-width: thin;
      scrollbar-color: var(--secondary-600) transparent;

      &::-webkit-scrollbar {
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--secondary-600);
        border-radius: 3px;
      }

      .respond-mobile({
        gap: 12px;
      });
    }
  }

  // ============ PODIUM CARD ============
  .podium-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: rgba(var(--secondary-900-rgb), 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(var(--secondary-600-rgb), 0.5);
    border-radius: 20px;
    overflow: visible;
    cursor: pointer;
    transition: all 0.3s @ease;
    width: 280px;
    flex-shrink: 0;

    &:hover {
      border-color: rgba(var(--primary-500-rgb), 0.4);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      background: rgba(var(--secondary-900-rgb), 0.95);
    }

    .respond-tablet({
      width: 240px;
    });

    // ============ VARIATIONS ============
    &--first {
      border-color: rgba(@gold, 0.3);
      box-shadow: 0 8px 32px rgba(@gold, 0.15);

      &:hover {
        border-color: rgba(@gold, 0.5);
        box-shadow: 0 16px 48px rgba(@gold, 0.25);
      }
    }

    // ============ CROWN ============
    &__crown {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, @gold 0%, @gold-dark 100%);
      border-radius: 50%;
      box-shadow: 0 4px 16px rgba(@gold, 0.4);
      z-index: 10;

      svg {
        color: @white;
      }
    }

    // ============ RANK BADGE ============
    &__rank {
      position: absolute;
      top: 16px;
      left: 16px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--secondary-700);
      border-radius: 50%;
      z-index: 5;

      &--first {
        background: linear-gradient(135deg, @gold 0%, @gold-dark 100%);
        box-shadow: 0 2px 8px rgba(@gold, 0.4);
      }
    }

    &__rank-number {
      font-family: @font-display;
      font-size: 14px;
      font-weight: 700;
      color: @white;
    }

    .podium-card--second &__rank {
      background: linear-gradient(135deg, @silver 0%, @silver-dark 100%);
    }

    .podium-card--third &__rank {
      background: linear-gradient(135deg, @bronze 0%, @bronze-dark 100%);
    }

    // ============ IMAGE ============
    &__image {
      padding: 24px 24px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--content-block-bg-subtle);
      border-radius: 20px 20px 0 0;

      img {
        width: 140px;
        height: 140px;
        object-fit: contain;
        transition: transform 0.3s @ease;
      }

      .respond-mobile({
        padding: 20px 20px 12px;

        img {
          width: 120px;
          height: 120px;
        }
      });
    }

    &--first &__image img {
      width: 160px;
      height: 160px;

      .respond-mobile({
        width: 140px;
        height: 140px;
      });
    }

    // ============ CONTENT ============
    &__content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px 20px;
      text-align: center;

      .respond-mobile({
        padding: 12px 16px;
      });
    }

    &__category {
      font-family: @font-body;
      font-size: 10px;
      font-weight: 600;
      color: var(--content-block-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &__name {
      font-family: @font-display;
      font-size: 16px;
      font-weight: 600;
      color: var(--content-block-text);
      margin: 0;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.6em;
    }

    &--first &__name {
      font-size: 18px;
    }

    &__price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 8px;
      margin-top: 4px;
    }

    &__price-old {
      font-family: @font-body;
      font-size: 13px;
      color: var(--content-block-text-muted);
      text-decoration: line-through;
    }

    &__price-current {
      font-family: @font-display;
      font-size: 22px;
      font-weight: 700;
      color: var(--content-block-text);

      &--sale {
        color: @danger-500;
      }
    }

    &--first &__price-current {
      font-size: 26px;
    }

    // ============ BUTTON ============
    &__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 20px;
      margin: 0 16px 16px;
      background: var(--primary-500);
      border: none;
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: @white;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: var(--primary-400);
      }

      .respond-mobile({
        padding: 12px 16px;
        margin: 0 12px 12px;
        font-size: 13px;
      });
    }

    &--first &__btn {
      background: linear-gradient(135deg, @gold 0%, @gold-dark 100%);

      &:hover {
        background: linear-gradient(135deg, lighten(@gold, 5%) 0%, @gold 100%);
      }
    }

    // ============ PEDESTAL ============
    &__pedestal {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--secondary-800);
      border-top: 1px solid var(--content-block-border);
      border-radius: 0 0 20px 20px;
      padding: 12px;
      margin-top: auto;

      &--first {
        background: linear-gradient(180deg, rgba(@gold, 0.1) 0%, rgba(@gold, 0.05) 100%);
        border-top-color: rgba(@gold, 0.2);
        height: 60px;
      }

      &--second {
        background: linear-gradient(180deg, rgba(@silver, 0.1) 0%, rgba(@silver, 0.05) 100%);
        border-top-color: rgba(@silver, 0.2);
        height: 48px;
      }

      &--third {
        background: linear-gradient(180deg, rgba(@bronze, 0.1) 0%, rgba(@bronze, 0.05) 100%);
        border-top-color: rgba(@bronze, 0.2);
        height: 40px;
      }
    }

    &__pedestal-number {
      font-family: @font-display;
      font-size: 24px;
      font-weight: 700;
      opacity: 0.3;
    }

    .podium-card--first &__pedestal-number {
      color: @gold;
      opacity: 0.5;
      font-size: 28px;
    }

    .podium-card--second &__pedestal-number {
      color: @silver;
      opacity: 0.5;
    }

    .podium-card--third &__pedestal-number {
      color: @bronze;
      opacity: 0.5;
    }
  }

  // ============ HONORABLE CARD ============
  .honorable-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(var(--secondary-900-rgb), 0.8);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(var(--secondary-600-rgb), 0.4);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s @ease;
    min-width: 220px;
    flex-shrink: 0;

    &:hover {
      border-color: rgba(var(--primary-500-rgb), 0.3);
      background: rgba(var(--secondary-900-rgb), 0.95);
    }

    .respond-mobile({
      min-width: 200px;
      padding: 10px 12px;
      gap: 10px;
    });

    &__rank {
      font-family: @font-display;
      font-size: 12px;
      font-weight: 700;
      color: var(--content-block-text-muted);
      min-width: 24px;
    }

    &__image {
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--content-block-bg-subtle);
      border-radius: 8px;
      padding: 4px;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .respond-mobile({
        width: 40px;
        height: 40px;
      });
    }

    &__content {
      flex: 1;
      min-width: 0;
    }

    &__name {
      font-family: @font-display;
      font-size: 14px;
      font-weight: 600;
      color: var(--content-block-text);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .respond-mobile({
        font-size: 13px;
      });
    }

    &__price {
      font-family: @font-body;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-400);

      .respond-mobile({
        font-size: 12px;
      });
    }

    &__btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--secondary-700);
      border: none;
      border-radius: 8px;
      color: var(--content-block-text);
      cursor: pointer;
      transition: all 0.2s @ease;
      flex-shrink: 0;

      &:hover {
        background: var(--primary-500);
        color: @white;
      }

      .respond-mobile({
        width: 32px;
        height: 32px;
      });
    }
  }

  // ============ MOBILE ITEM (liste simple) ============
  .mobile-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(var(--secondary-900-rgb), 0.8);
    border: 1px solid rgba(var(--secondary-600-rgb), 0.4);
    border-radius: 12px;
    cursor: pointer;

    &__rank {
      font-family: @font-display;
      font-size: 14px;
      font-weight: 700;
      color: @gold;
      min-width: 28px;
    }

    &__image {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--content-block-bg-subtle);
      border-radius: 8px;

      img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      }
    }

    &__content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__name {
      font-family: @font-display;
      font-size: 14px;
      font-weight: 600;
      color: var(--content-block-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__price {
      font-family: @font-body;
      font-size: 14px;
      font-weight: 700;
      color: var(--primary-400);
    }

    &__btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-500);
      border: none;
      border-radius: 10px;
      color: @white;
      cursor: pointer;
      flex-shrink: 0;

      &:active {
        background: var(--primary-600);
      }
    }
  }
</style>
