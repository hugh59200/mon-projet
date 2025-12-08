<template>
  <ContentBlock
    v-if="relatedProducts.length > 0"
    as="section"
    variant="card"
    size="lg"
    class="related-products"
  >
    <div class="related-products__header">
      <div class="related-products__title-group">
        <h2 class="related-products__title">
          {{ t('aov.relatedProducts.title') }}
        </h2>
        <p class="related-products__subtitle">
          {{ t('aov.relatedProducts.subtitle') }}
        </p>
      </div>
      <div class="related-products__badge">
        <BasicIconNext
          name="FlaskConical"
          :size="14"
        />
        <span>{{ t('aov.lotConsistency.badge') }}</span>
      </div>
    </div>

    <div class="related-products__grid">
      <ProductCart
        v-for="product in relatedProducts"
        :key="product.id"
        :product="product"
        view-mode="grid"
        @view="goToProduct"
        @add="addToCart"
        @buy="buyNow"
      />
    </div>

    <!-- Bundle Add All Button -->
    <div class="related-products__bundle">
      <div class="related-products__bundle-info">
        <span class="related-products__bundle-count">
          {{ relatedProducts.length }} {{ t('aov.relatedProducts.products') }}
        </span>
        <span class="related-products__bundle-total">
          {{ t('aov.relatedProducts.bundleTotal') }}: {{ formatPrice(bundleTotal) }}
        </span>
      </div>
      <PremiumButton
        type="primary"
        variant="solid"
        size="md"
        :icon-left="isAddedAll ? 'Check' : 'ShoppingCart'"
        :label="isAddedAll ? t('aov.relatedProducts.addedAll') : t('aov.relatedProducts.addAllToCart')"
        class="related-products__bundle-btn"
        :class="{ 'related-products__bundle-btn--success': isAddedAll }"
        @click="addAllToCart"
      />
    </div>
  </ContentBlock>
</template>

<script setup lang="ts">
  import ProductCart from '@/features/catalogue/cart/ProductCart.vue'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
  import type { Products } from '@/supabase/types/supabase.types'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()
  const router = useRouter()
  const cartStore = useCartStore()

  const props = defineProps<{
    currentProductId: string
    category: string | null
  }>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allProducts = ref<any[]>([])
  const isAddedAll = ref(false)

  const relatedProducts = computed(() => {
    return (allProducts.value as Products[])
      .filter((p) => p.id !== props.currentProductId && p.category === props.category)
      .slice(0, 4)
  })

  const bundleTotal = computed(() => {
    return relatedProducts.value.reduce((sum, product) => {
      const price = product.is_on_sale && product.sale_price
        ? product.sale_price
        : product.price
      return sum + price
    }, 0)
  })

  function formatPrice(value: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
  }

  async function loadProducts() {
    if (!props.category) {
      allProducts.value = []
      return
    }

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category', props.category)
      .gt('stock', 0)
      .limit(5)

    allProducts.value = (data || []) as Products[]
  }

  function goToProduct(id: string) {
    router.push({ name: 'product', params: { id } })
  }

  function addToCart(product: Products) {
    cartStore.addToCart(product)
  }

  function buyNow(product: Products) {
    cartStore.addToCart(product)
    router.push('/checkout')
  }

  function addAllToCart() {
    if (isAddedAll.value) return

    relatedProducts.value.forEach((product) => {
      cartStore.addToCart(product)
    })

    isAddedAll.value = true
    setTimeout(() => {
      isAddedAll.value = false
    }, 2000)
  }

  watch(() => props.category, loadProducts, { immediate: false })
  onMounted(loadProducts)
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

  .related-products {
    margin-top: 48px;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      gap: 16px;

      .respond-mobile({
        flex-direction: column;
        gap: 12px;
      });
    }

    &__title-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__title {
      font-family: @font-display;
      font-size: 20px;
      font-weight: 600;
      color: var(--content-block-text);
      margin: 0;
    }

    &__subtitle {
      font-family: @font-body;
      font-size: 14px;
      color: var(--content-block-text-muted);
      margin: 0;
    }

    &__badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: rgba(var(--primary-500-rgb), 0.1);
      border: 1px solid rgba(var(--primary-500-rgb), 0.2);
      border-radius: 8px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 500;
      color: var(--primary-400);
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;

      .respond-tablet({
        grid-template-columns: repeat(2, 1fr);
      });

      .respond-mobile({
        grid-template-columns: 1fr;
      });
    }

    &__bundle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 24px;
      padding: 16px 20px;
      background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.08) 0%, rgba(var(--primary-500-rgb), 0.04) 100%);
      border: 1px solid rgba(var(--primary-500-rgb), 0.2);
      border-radius: 12px;

      .respond-mobile({
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        padding: 14px 16px;
      });
    }

    &__bundle-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .respond-mobile({
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      });
    }

    &__bundle-count {
      font-family: @font-body;
      font-size: 13px;
      color: var(--content-block-text-muted);
    }

    &__bundle-total {
      font-family: @font-display;
      font-size: 18px;
      font-weight: 700;
      color: var(--content-block-text);

      .respond-mobile({
        font-size: 16px;
      });
    }

    &__bundle-btn {
      flex-shrink: 0;
      min-width: 200px;
      transition: all 0.3s ease;

      &--success {
        background: @success-500 !important;
        border-color: @success-500 !important;
      }

      .respond-mobile({
        min-width: 100%;
      });
    }
  }
</style>
