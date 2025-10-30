<template>
  <div class="catalogue">
    <!-- 🔹 Header -->
    <header class="catalogue__header">
      <BasicText
        size="h2"
        weight="bold"
      >
        Catalogue de peptides
      </BasicText>

      <div class="catalogue__header-right">
        <!-- Recherche mobile -->
        <BasicInput
          v-if="isMobile"
          v-model="searchTerm"
          placeholder="Rechercher..."
          icon-left="search"
          size="small"
          class="catalogue__search"
        />

        <!-- Boutons -->
        <div class="catalogue__buttons">
          <BasicButton
            v-if="isMobile"
            label="Filtres"
            type="secondary"
            variant="outlined"
            size="small"
            icon-left="SlidersHorizontal"
            @click="showFilters = true"
          />
          <BasicDropdown
            v-model="sortBy"
            :items="sortItems"
            size="small"
            dropdown-type="table"
          />
        </div>
      </div>
    </header>

    <!-- 🔹 Corps principal -->
    <div class="catalogue__body">
      <!-- 🧭 Filtres latéraux (desktop) -->
      <aside
        v-if="isDesktop"
        class="catalogue__filters"
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

      <!-- 🛒 Liste des produits -->
      <section class="catalogue__list">
        <WrapperLoader
          :loading="loading"
          :has-loaded="hasLoaded"
          :is-empty="hasLoaded && filteredProducts.length === 0"
          message="Chargement du catalogue..."
          empty-message="Aucun produit trouvé avec ces filtres."
        >
          <div
            v-if="hasLoaded"
            class="catalogue__summary"
          >
            <BasicText color="neutral-700">
              {{ filteredProducts.length }} résultat{{ filteredProducts.length > 1 ? 's' : '' }}
            </BasicText>
          </div>

          <div
            v-if="filteredProducts.length"
            class="catalogue__grid"
          >
            <ProductCard
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

    <!-- 🧭 Modale mobile : Filtres -->
    <ModalComponent
      v-model="showFilters"
      :closable="true"
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
        <BasicButton
          label="Fermer"
          type="primary"
          block
          @click="showFilters = false"
        />
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
  import ProductCard from '@/features/cart/ProductCart.vue'
  import { useCartStore } from '@/features/cart/useCartStore'
  import { useFilters } from '@/features/catalogue/composables/useFilters'
  import { useFilterSections } from '@/features/catalogue/composables/useFilterSections'
  import { usePagination } from '@/features/catalogue/composables/usePagination'
  import { useProducts } from '@/features/catalogue/composables/useProducts'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { DEVICE_BREAKPOINT } from '@/plugin/device-breakpoint'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { inject, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import FilterPanel from './FilterPanel.vue'

  const { isDesktop, isMobile } = inject(DEVICE_BREAKPOINT)!
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
  const toast = useToastStore()

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

  function addToCart(product: any, qty = 1) {
    cart.addToCart({ ...product, quantity: qty })
    toast.show(`✅ ${product.name} ajouté au panier`, 'success')
  }

  onMounted(loadProducts)
</script>

<style scoped lang="less">
  /* ===== LAYOUT GLOBAL ===== */
  .catalogue {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: @neutral-50;
    min-height: 100vh;
    padding: 32px 20px;

    /* === HEADER === */
    &__header {
      width: 100%;
      max-width: 1280px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 4px fade(@neutral-900, 10%);
      padding: 16px 24px;
      margin-bottom: 24px;
    }

    /* === BODY === */
    &__body {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
      max-width: 1280px;
      gap: 24px;
    }

    &__filters {
      flex-shrink: 0;
      width: 260px;
      background: fade(@secondary-800, 6%);
      border: 1px solid fade(@neutral-200, 60%);
      border-radius: 12px;
      padding: 20px 16px;
      overflow-y: auto;
    }

    &__list {
      flex: 1;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 4px fade(@neutral-900, 5%);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__summary {
      font-weight: 500;
      color: @neutral-700;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    &__pagination-bottom {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }

    /* === RESPONSIVE === */
    @media (max-width: 1200px) {
      &__grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 900px) {
      padding: 20px 12px;

      &__filters {
        display: none;
      }

      &__body {
        flex-direction: column;
        align-items: center;
      }

      &__list {
        width: 100%;
        padding: 16px;
        box-shadow: none;
        border-radius: 8px;
        background: transparent;
      }

      &__grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        width: 100%;
      }

      &__header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 8px;
      }
    }

    @media (max-width: 600px) {
      &__grid {
        grid-template-columns: repeat(2, minmax(140px, 1fr));
        gap: 12px;
      }
    }
  }
</style>
