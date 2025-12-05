<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWishlistStore } from './stores/useWishlistStore'
import { supabase } from '@/supabase/supabaseClient'
import type { Products } from '@/supabase/types/supabase.types'
import ProductCart from './cart/ProductCart.vue'
import PageHeader from '@/features/shared/components/PageHeader.vue'
import PageContent from '@/features/shared/components/PageContent.vue'

const router = useRouter()
const { t } = useI18n()
const wishlistStore = useWishlistStore()

// State
const products = ref<Products[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Computed
const wishlistIds = computed(() => wishlistStore.items)
const isEmpty = computed(() => wishlistIds.value.length === 0)

// Fetch products by IDs
async function fetchFavoriteProducts(): Promise<void> {
  if (wishlistIds.value.length === 0) {
    products.value = []
    return
  }

  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .in('id', wishlistIds.value)

    if (fetchError) {
      throw new Error(fetchError.message)
    }

    products.value = data ?? []
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('common.error')
    products.value = []
  } finally {
    loading.value = false
  }
}

// Watch for wishlist changes
watch(wishlistIds, () => {
  fetchFavoriteProducts()
}, { deep: true })

// Initial fetch
onMounted(() => {
  fetchFavoriteProducts()
})

// Navigation
function goToCatalogue(): void {
  router.push({ name: 'catalogue' })
}

function viewProduct(productId: string): void {
  router.push({ name: 'product-detail', params: { id: productId } })
}
</script>

<template>
  <div class="favorites-page">
    <PageHeader />

    <PageContent size="xl">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="favorites-view__loading"
      >
        <BasicIconNext
          name="Loader2"
          :size="32"
          color="primary-500"
          class="favorites-view__spinner"
        />
        <BasicText
          size="body-m"
          color="neutral-600"
        >
          {{ t('common.loading') }}
        </BasicText>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="favorites-view__error"
      >
        <BasicIconNext
          name="AlertCircle"
          :size="48"
          color="danger-500"
        />
        <BasicText
          size="body-m"
          color="danger-500"
        >
          {{ error }}
        </BasicText>
        <PremiumButton
          :label="t('common.retry')"
          type="secondary"
          variant="outline"
          size="md"
          @click="fetchFavoriteProducts"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="isEmpty"
        class="favorites-view__empty"
      >
        <BasicIconNext
          name="Heart"
          :size="64"
          color="neutral-500"
        />
        <BasicText
          size="h4"
          weight="bold"
          color="neutral-100"
        >
          {{ t('wishlist.empty.title') }}
        </BasicText>
        <BasicText
          size="body-m"
          color="neutral-400"
        >
          {{ t('wishlist.empty.description') }}
        </BasicText>
        <PremiumButton
          :label="t('wishlist.empty.cta')"
          type="primary"
          variant="solid"
          size="lg"
          icon-left="ArrowLeft"
          @click="goToCatalogue"
        />
      </div>

      <!-- Products Grid -->
      <template v-else-if="products.length > 0">
        <div class="favorites-view__grid">
          <ProductCart
            v-for="product in products"
            :key="product.id"
            :product="product"
            view-mode="grid"
            @view="viewProduct"
          />
        </div>

        <!-- Clear All Button -->
        <div class="favorites-view__actions">
          <PremiumButton
            :label="t('wishlist.clearAll')"
            type="secondary"
            variant="ghost"
            size="sm"
            icon-left="Trash2"
            @click="wishlistStore.clear()"
          />
        </div>
      </template>

      <!-- No products found (IDs in store but products deleted from DB) -->
      <div
        v-else
        class="favorites-view__empty"
      >
        <BasicIconNext
          name="Heart"
          :size="64"
          color="neutral-500"
        />
        <BasicText
          size="h4"
          weight="bold"
          color="neutral-100"
        >
          {{ t('wishlist.empty.title') }}
        </BasicText>
        <BasicText
          size="body-m"
          color="neutral-400"
        >
          {{ t('wishlist.empty.description') }}
        </BasicText>
        <PremiumButton
          :label="t('wishlist.clearAll')"
          type="secondary"
          variant="outline"
          size="md"
          @click="wishlistStore.clear()"
        />
      </div>
    </PageContent>
  </div>
</template>

<style scoped lang="less">
@import '@designSystem/fondation/colors/colors.less';
@import '@designSystem/fondation/spacing/spacing.less';

.favorites-page {
  position: relative;
  min-height: 100vh;
}

.favorites-view {
  &__loading,
  &__error,
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: @spacing-15;
    padding: @spacing-35 @spacing-20;
    text-align: center;
    min-height: 300px;
  }

  &__spinner {
    animation: spin 1s linear infinite;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: @spacing-20;
  }

  &__actions {
    display: flex;
    justify-content: center;
    margin-top: @spacing-25;
    padding-top: @spacing-20;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Responsive - Tablet (≤ 1160px)
.respond-tablet({
  .favorites-view {
    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: @spacing-15;
    }
  }
});

// Responsive - Mobile (≤ 720px)
.respond-mobile({
  .favorites-view {
    &__grid {
      grid-template-columns: 1fr;
      gap: @spacing-15;
    }
  }
});
</style>
