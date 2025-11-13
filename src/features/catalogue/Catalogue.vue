<template>
  <div
    class="catalogue"
    v-responsive-animate.fade.once
  >
    <header
      class="catalogue__header"
      v-responsive-animate.slide.once
    >
      <div class="catalogue__header--top">
        <BasicText
          size="h4"
          weight="bold"
        >
          Catalogue de peptides
        </BasicText>
        <WrapperDropdown
          v-model="sortBy"
          :items="sortItems"
          force-value
          size="small"
        />
      </div>
      <div
        v-if="isMobile"
        class="catalogue__header--sub"
      >
        <WrapperInput
          v-model="searchTerm"
          placeholder="Rechercher..."
          icon-left="search"
          size="small"
        />
        <WrapperButton
          button-label="Filtres"
          type="secondary"
          variant="outlined"
          width="full"
          size="small"
          icon-left="SlidersHorizontal"
          @click="showFilters = true"
        />
      </div>
    </header>
    <div class="catalogue__body">
      <aside
        v-if="!isMobile"
        class="catalogue__filters"
      >
        <FilterPanel
          :all-open="allOpen"
          v-model:filterOpen="filterOpen"
          v-model:priceRange="priceRange"
          v-model:selectedCategories="selectedCategories"
          v-model:inStockOnly="inStockOnly"
          v-model:selectedTags="selectedTags"
          :categoryItems="categoryItemsWithCounts"
          :stockCount="stockCount"
          :tagItems="tagItemsWithCounts"
          :tags="allTags"
          @toggleAll="toggleAll"
          @resetAll="resetAll"
          @toggleTag="toggleTag"
        />
      </aside>
      <section class="catalogue__list">
        <BasicText
          v-if="hasLoaded"
          color="neutral-700"
        >
          {{ filteredProducts.length }} résultat{{ filteredProducts.length > 1 ? 's' : '' }}
        </BasicText>

        <WrapperLoader
          :loading="loading"
          :has-loaded="hasLoaded"
          :is-empty="hasLoaded && filteredProducts.length === 0"
          message="Chargement du catalogue..."
          empty-message="Aucun produit trouvé avec ces filtres."
        >
          <div
            v-if="filteredProducts.length"
            class="catalogue__grid"
            v-responsive-animate.zoom.scroll.stagger="{ delay: 90, speed: 600 }"
          >
            <ProductCart
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              @view="viewProduct"
              @add="addToCart"
            />
          </div>
          <div
            v-if="nbPages > 1"
            class="catalogue__pagination-bottom"
          >
            <BasicPagination
              :current-page="page"
              :nb-pages="nbPages"
              :nb-pages-max="7"
              @change="(p) => (page = p)"
            />
          </div>
        </WrapperLoader>
      </section>
    </div>
    <ModalComponent
      v-model="showFilters"
      closable
    >
      <template #header>Filtres</template>
      <template #content>
        <FilterPanel
          :all-open="allOpen"
          v-model:filterOpen="filterOpen"
          v-model:priceRange="priceRange"
          v-model:selectedCategories="selectedCategories"
          v-model:inStockOnly="inStockOnly"
          v-model:selectedTags="selectedTags"
          :categoryItems="categoryItemsWithCounts"
          :stockCount="stockCount"
          :tagItems="tagItemsWithCounts"
          :tags="allTags"
          @toggleAll="toggleAll"
          @resetAll="resetAll"
          @toggleTag="toggleTag"
        />
      </template>
      <template #actions>
        <div class="justify-content-center flex">
          <BasicButton
            label="Fermer"
            type="primary"
            block
            @click="showFilters = false"
          />
        </div>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
  import ProductCart from '@/features/catalogue/cart/ProductCart.vue'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useFilters } from '@/features/catalogue/composables/useFilters'
  import { useFilterSections } from '@/features/catalogue/composables/useFilterSections'
  import { usePagination } from '@/features/catalogue/composables/usePagination'
  import { useProducts } from '@/features/catalogue/composables/useProducts'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import type { Products } from '@/supabase/types/supabase.types'
  import { useSmartToast } from '@designSystem/components/basic/toast/useSmartToast'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import FilterPanel from './FilterPanel.vue'

  const route = useRoute()
  const { isMobile } = useDeviceBreakpoint()
  const { products, priceRange, loadProducts, loading, hasLoaded } = useProducts()

  const {
    selectedCategories,
    inStockOnly,
    selectedTags,
    allTags,
    tagItemsWithCounts,
    categoryItemsWithCounts,
    stockCount,
    filteredProducts,
    toggleTag,
  } = useFilters(products, priceRange)

  const { searchTerm, sortBy, sortItems, page, paginatedProducts, nbPages } =
    usePagination(filteredProducts)

  const { filterOpen, allOpen, toggleAll } = useFilterSections()

  const router = useRouter()
  const cart = useCartStore()
  const { showAddToCartToast } = useSmartToast()

  const showFilters = ref(false)

  function resetAll() {
    selectedCategories.value = []
    inStockOnly.value = false
    selectedTags.value = []
    // reset priceRange (en respectant min/max existants)
    priceRange.value = { ...priceRange.value, from: priceRange.value.min, to: priceRange.value.max }
    // UI
    page.value = 1
    sortBy.value = 'default'
  }

  function viewProduct(id: string) {
    router.push(`/catalogue/${id}`)
  }

  function addToCart(p: Products) {
    cart.addToCart(p)
    showAddToCartToast(p)
  }

  onMounted(async () => {
    await loadProducts()

    const initialTag = typeof route.query.tag === 'string' ? route.query.tag : null
    if (initialTag) {
      selectedTags.value = [initialTag]
    }
  })
</script>

<style scoped lang="less">
  .catalogue {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    background: @neutral-50;
  }
  .catalogue__header {
    border-radius: 14px;
    background: @neutral-100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 15px;
    gap: 16px;
    transition: all 0.25s ease;
  }
  .catalogue__header--top,
  .catalogue__header--sub {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .catalogue__header--top > div,
  .catalogue__header--sub > div {
    min-width: 160px;
    max-width: 300px;
  }
  .catalogue__body {
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 24px;
  }
  .catalogue__filters {
    flex-shrink: 0;
    width: 260px;
    background: @neutral-100;
    border: 1px solid fade(@neutral-200, 60%);
    border-radius: 12px;
    padding: 20px 16px;
    overflow-y: auto;
  }
  .catalogue__list {
    flex: 1;
    background: @neutral-100;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .catalogue__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    justify-items: stretch;
    align-items: stretch;
    gap: 48px 28px;
    padding-bottom: 20px;
  }
  .catalogue__pagination-bottom {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }
</style>
