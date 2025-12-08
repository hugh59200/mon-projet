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
          type="secondary"
          variant="ghost"
          size="md"
          :label="t('home.bestSellers.viewAll')"
          icon-right="ArrowRight"
          class="best-sellers__view-all"
          @click="goToCatalogue"
        />
      </div>

      <!-- Products Grid -->
      <div
        v-if="loading"
        class="best-sellers__loading"
      >
        <div
          v-for="n in skeletonCount"
          :key="n"
          class="best-sellers__skeleton"
        ></div>
      </div>

      <div
        v-else
        class="best-sellers__grid"
      >
        <ProductCart
          v-for="product in bestSellers"
          :key="product.id"
          :product="product"
          view-mode="grid"
          @view="goToProduct"
          @add="addToCart"
          @buy="buyNow"
        />
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
  import ProductCart from '@/features/catalogue/cart/ProductCart.vue'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useProductsStore } from '@/features/catalogue/composables/useProducts'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'
  import type { Products } from '@/supabase/types/supabase.types'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()
  const router = useRouter()
  const cartStore = useCartStore()
  const productsStore = useProductsStore()
  const { products, loading } = storeToRefs(productsStore)
  const { isMobile, isTablet } = useDeviceBreakpoint()

  // Nombre de skeletons selon le device
  const skeletonCount = computed(() => {
    if (isMobile.value) return 4
    if (isTablet.value) return 4
    return 4
  })

  // Best-sellers : produits en stock, triés par popularité (les premiers)
  // TODO: Ajouter un champ "sales_count" ou "is_featured" en base pour un vrai tri
  const bestSellers = computed(() => {
    return (products.value as Products[])
      .filter((p) => (p.stock ?? 0) > 0)
      .slice(0, 4) // 4 produits sur une ligne
  })

  function goToProduct(id: string) {
    router.push({ name: 'product', params: { id } })
  }

  function goToCatalogue() {
    router.push('/catalogue')
  }

  function addToCart(product: Products) {
    cartStore.addToCart(product)
  }

  function buyNow(product: Products) {
    cartStore.addToCart(product)
    router.push('/checkout')
  }

  onMounted(() => {
    productsStore.load()
  })
</script>

<style scoped lang="less">
  @import '@designSystem/fondation/breakpoints/responsive-mixins.less';

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
      background: rgba(var(--primary-500-rgb), 0.1);
      border-radius: 100px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      color: var(--primary-400);
      width: fit-content;

      svg {
        color: var(--primary-400);
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
      margin-top: 24px;

      .respond-mobile({
        display: flex;
      });
    }

    // Loading skeleton
    &__loading {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;

      .respond-tablet({
        grid-template-columns: repeat(2, 1fr);
      });

      .respond-mobile({
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      });
    }

    &__skeleton {
      aspect-ratio: 3 / 4;
      background: linear-gradient(
        90deg,
        rgba(var(--secondary-700-rgb), 0.5) 25%,
        rgba(var(--secondary-600-rgb), 0.5) 50%,
        rgba(var(--secondary-700-rgb), 0.5) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 16px;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    // Products grid
    &__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;

      .respond-tablet({
        grid-template-columns: repeat(2, 1fr);
      });

      .respond-mobile({
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      });
    }
  }
</style>
