<template>
  <div
    class="catalogue"
    v-responsive-animate.fade.once
  >
    <div
      class="catalogue__header"
      v-responsive-animate.slide.once
    >
      <div class="catalogue__header--top">
        <BasicText
          size="h4"
          weight="bold"
          color="neutral-300"
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
          type="primary"
          variant="outlined"
          width="full"
          size="small"
          icon-left="SlidersHorizontal"
          @click="showFilters = true"
        />
      </div>
    </div>
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
          color="neutral-300"
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
    priceRange.value = { ...priceRange.value, from: priceRange.value.min, to: priceRange.value.max }
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
  /* ============================================================
   🛒 CATALOGUE — Neural Glass Hybrid v3
   ============================================================ */

  .catalogue {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 26px 0;
    opacity: 0;
    animation: fadeInPage 0.8s ease forwards;

    @keyframes fadeInPage {
      to {
        opacity: 1;
      }
    }

    /* ============================================================
     🏷️ HEADER — Light Glass
     ============================================================ */
    &__header {
      border-radius: 16px;
      padding: 20px 26px;
      display: flex;
      flex-direction: column;
      gap: 18px;

      background: fade(@secondary-900, 75%);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      border: 1px solid fade(@neutral-300, 25%);

      box-shadow:
        0 8px 28px fade(#000, 35%),
        inset 0 0 0 1px fade(@white, 12%);

      transition: all 0.25s ease;
    }

    &__header--top,
    &__header--sub {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
    }

    &__header--top > div,
    &__header--sub > div {
      min-width: 160px;
      max-width: 300px;
    }

    /* ============================================================
     🧊 SIDEBAR FILTERS — Neural Glass v3 Dark
     ============================================================ */
    &__body {
      display: flex;
      width: 100%;
      gap: 28px;
      justify-content: center;
    }

    &__filters {
      width: 260px;
      flex-shrink: 0;

      background: fade(@secondary-900, 75%);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      border: 1px solid fade(@neutral-300, 25%);

      padding: 22px 18px;
      border-radius: 16px;

      border: 1px solid fade(@neutral-300, 26%);
      box-shadow:
        0 10px 30px fade(#000, 40%),
        inset 0 0 0 1px fade(@white, 10%);

      overflow-y: auto;
      transition: background 0.25s ease;
    }

    /* ============================================================
     🩶 LISTE + CONTENT — Light Glass Pro
     ============================================================ */
    &__list {
      flex: 1;
      min-height: 500px;

      background: fade(@secondary-900, 75%);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      border: 1px solid fade(@neutral-300, 25%);

      padding: 26px;
      border-radius: 16px;
      border: 1px solid fade(@neutral-300, 22%);

      box-shadow:
        0 12px 30px fade(#000, 35%),
        inset 0 0 0 1px fade(@white, 15%);

      display: flex;
      flex-direction: column;
      gap: 22px;

      .BasicText {
        color: @neutral-50 !important;
      }
    }

    /* ============================================================
     🧴 GRID PRODUITS
     ============================================================ */
    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 38px 26px;
      justify-items: stretch;
      align-items: stretch;
      padding-bottom: 20px;
    }

    /* ============================================================
     🔵 PAGINATION PREMIUM
     ============================================================ */
    &__pagination-bottom {
      display: flex;
      justify-content: center;

      .BasicPagination {
        background: fade(@white, 6%);
        backdrop-filter: blur(10px);
        padding: 10px 18px;
        border-radius: 12px;

        border: 1px solid fade(@neutral-300, 25%);
        box-shadow: 0 6px 18px fade(#000, 35%);
      }
    }
  }

  /* ============================================================
   📱 RESPONSIVE
   ============================================================ */
  @media (max-width: 900px) {
    .catalogue__body {
      flex-direction: column;
      gap: 20px;
    }

    .catalogue__filters {
      width: 100%;
      order: 2;
    }

    .catalogue__list {
      order: 1;
    }
  }
</style>
