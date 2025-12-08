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

  const relatedProducts = computed(() => {
    return (allProducts.value as Products[])
      .filter((p) => p.id !== props.currentProductId && p.category === props.category)
      .slice(0, 4)
  })

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
  }
</style>
