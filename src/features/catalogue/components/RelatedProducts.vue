<template>
  <ContentBlock v-if="relatedProducts.length > 0" as="section" variant="card" size="lg" class="related-products">
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
        <BasicIconNext name="FlaskConical" :size="14" />
        <span>{{ t('aov.lotConsistency.badge') }}</span>
      </div>
    </div>

    <div class="related-products__grid">
      <article
        v-for="product in relatedProducts"
        :key="product.id"
        class="related-card"
        @click="goToProduct(product.id)"
      >
        <!-- Image -->
        <div class="related-card__image">
          <img
            :src="product.image || defaultImage"
            :alt="getProductName(product)"
            loading="lazy"
          />
        </div>

        <!-- Content -->
        <div class="related-card__content">
          <span class="related-card__category">{{ getProductCategory(product) }}</span>
          <h3 class="related-card__name">{{ getProductName(product) }}</h3>

          <div class="related-card__specs">
            <span class="related-card__dosage">{{ product.dosage }}</span>
            <span class="related-card__coa">
              <BasicIconNext name="FileCheck" :size="12" />
              COA
            </span>
          </div>

          <div class="related-card__pricing">
            <span
              v-if="product.is_on_sale && product.sale_price"
              class="related-card__price-old"
            >
              {{ product.price.toFixed(2) }}€
            </span>
            <span
              class="related-card__price"
              :class="{ 'related-card__price--sale': product.is_on_sale }"
            >
              {{ getPrice(product).toFixed(2) }}€
            </span>
          </div>
        </div>

        <!-- Action -->
        <button
          class="related-card__add"
          :disabled="(product.stock ?? 0) <= 0"
          @click.stop="addToCart(product)"
        >
          <BasicIconNext name="Plus" :size="16" />
          <span>{{ t('aov.relatedProducts.addToOrder') }}</span>
        </button>
      </article>
    </div>
  </ContentBlock>
</template>

<script setup lang="ts">
import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { Products } from '@/supabase/types/supabase.types'
import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t, locale } = useI18n()
const router = useRouter()
const cartStore = useCartStore()

const props = defineProps<{
  currentProductId: string
  category: string | null
}>()

const defaultImage = '/images/default-product.png'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allProducts = ref<any[]>([])

const relatedProducts = computed(() => {
  return (allProducts.value as Products[])
    .filter((p) => p.id !== props.currentProductId && p.category === props.category)
    .slice(0, 4)
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

watch(() => props.category, loadProducts, { immediate: false })
onMounted(loadProducts)
</script>

<style scoped lang="less">
@import '@designSystem/fondation/breakpoints/responsive-mixins.less';

@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.related-products {
  // Styles de base gérés par ContentBlock
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
    color: @neutral-100;
    margin: 0;
  }

  &__subtitle {
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-400;
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

.related-card {
  display: flex;
  flex-direction: column;
  background: rgba(var(--secondary-800-rgb), 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s @ease;

  &:hover {
    border-color: rgba(var(--primary-500-rgb), 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  &__image {
    position: relative;
    aspect-ratio: 1;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 80%;
      max-height: 80%;
      object-fit: contain;
      transition: transform 0.3s @ease;
    }
  }

  &:hover &__image img {
    // Pas de grossissement
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
    flex: 1;
  }

  &__category {
    font-family: @font-body;
    font-size: 10px;
    font-weight: 500;
    color: @neutral-500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__name {
    font-family: @font-display;
    font-size: 15px;
    font-weight: 600;
    color: @neutral-100;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__specs {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
  }

  &__dosage {
    font-family: @font-body;
    font-size: 12px;
    color: @neutral-400;
  }

  &__coa {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 6px;
    background: rgba(var(--success-500-rgb), 0.1);
    border-radius: 4px;
    font-family: @font-body;
    font-size: 10px;
    font-weight: 600;
    color: @success-500;
  }

  &__pricing {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 4px;
  }

  &__price-old {
    font-family: @font-body;
    font-size: 13px;
    color: @neutral-500;
    text-decoration: line-through;
  }

  &__price {
    font-family: @font-display;
    font-size: 18px;
    font-weight: 700;
    color: @neutral-100;

    &--sale {
      color: @danger-500;
    }
  }

  &__add {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px;
    margin: 0 12px 12px;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
    border: none;
    border-radius: 10px;
    font-family: @font-body;
    font-size: 13px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.2s @ease;
    box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.25);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-500) 100%);
      box-shadow: 0 6px 16px rgba(var(--primary-500-rgb), 0.35);
    }

    &:disabled {
      background: @neutral-700;
      box-shadow: none;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
</style>
