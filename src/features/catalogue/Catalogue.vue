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
        v-responsive-animate.fade.once
      >
        <WrapperInput
          v-if="isMobile"
          v-model="searchTerm"
          placeholder="Rechercher..."
          icon-left="search"
          size="small"
        />
        <WrapperButton
          v-if="isMobile"
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
    <div
      class="catalogue__body"
      v-responsive-animate.slide.once
    >
      <aside
        v-if="!isMobile"
        class="catalogue__filters"
        v-responsive-animate.fade.scroll
      >
        <FilterPanel
          :allOpen="allOpen"
          :filterOpen="filterOpen"
          :priceRange="priceRange"
          :categoryItems="categoryItemsWithCounts"
          :selectedCategories="selectedCategories"
          :inStockOnly="inStockOnly"
          :stockCount="stockCount"
          :tags="allTags"
          :tagItems="tagItemsWithCounts"
          :selectedTags="selectedTags"
          @toggleAll="toggleAll"
          @resetAll="resetAll"
          @toggleTag="toggleTag"
          @update:priceRange="(val) => (priceRange = val)"
          @update:selectedCategories="(val) => (selectedCategories = val)"
          @update:inStockOnly="(val) => (inStockOnly = val)"
        />
      </aside>
      <section
        class="catalogue__list"
        v-responsive-animate.fade.scroll
      >
        <BasicText
          v-if="hasLoaded"
          v-responsive-animate.fade.once
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
            v-responsive-animate.fade.once
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
      :closable="true"
      v-responsive-animate.zoom.once
    >
      <template #header>Filtres</template>
      <template #content>
        <FilterPanel
          :allOpen="allOpen"
          :filterOpen="filterOpen"
          :priceRange="priceRange"
          :categoryItems="categoryItemsWithCounts"
          :selectedCategories="selectedCategories"
          :inStockOnly="inStockOnly"
          :stockCount="stockCount"
          :tags="allTags"
          :tagItems="tagItemsWithCounts"
          :selectedTags="selectedTags"
          @toggleAll="toggleAll"
          @resetAll="resetAll"
          @toggleTag="toggleTag"
          @update:priceRange="(val) => (priceRange = val)"
          @update:selectedCategories="(val) => (selectedCategories = val)"
          @update:inStockOnly="(val) => (inStockOnly = val)"
        />
      </template>
      <template #actions>
        <div
          class="justify-content-center flex"
          v-responsive-animate.slide.once
        >
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
  import { useSmartToast } from '@designSystem/components/basic/toast/useSmartToast'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import FilterPanel from './FilterPanel.vue'
  import type { Product } from './types/product'

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
    sortBy.value = 'default'
    page.value = 1
    priceRange.value.from = priceRange.value.min
    priceRange.value.to = priceRange.value.max
  }

  function viewProduct(id: string) {
    router.push(`/catalogue/${id}`)
  }

  function addToCart(p: Product) {
    cart.addToCart(p)
    showAddToCartToast(p)
  }
  onMounted(loadProducts)
</script>

<style scoped lang="less">
  .catalogue {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    background: @neutral-50;

    &__header {
      border-radius: 14px;
      background: @neutral-100;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 15px;
      gap: 16px;
      transition: all 0.25s ease;

      &--top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;

        > div {
          min-width: 160px;
          max-width: 300px;
        }
      }
      &--sub {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;

        > div {
          min-width: 160px;
          max-width: 300px;
        }
      }
    }

    &__body {
      display: flex;
      justify-content: center;
      width: 100%;
      gap: 24px;
    }

    &__filters {
      flex-shrink: 0;
      width: 260px;
      background: @neutral-100;
      border: 1px solid fade(@neutral-200, 60%);
      border-radius: 12px;
      padding: 20px 16px;
      overflow-y: auto;
    }

    &__list {
      flex: 1;
      background: #fff;
      border-radius: 12px;
      background: @neutral-100;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      justify-items: stretch;
      align-items: stretch;
      gap: 48px 28px;
      padding-bottom: 20px;
    }

    &__pagination-bottom {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }
  }
</style>
