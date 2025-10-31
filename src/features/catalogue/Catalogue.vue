<template>
  <div
    class="catalogue"
    v-responsive-animate.fade.once
  >
    <!-- 🔹 Header -->
    <header
      class="catalogue__header"
      v-responsive-animate.slide.once
    >
      <BasicText
        size="h2"
        weight="bold"
      >
        Catalogue de peptides
      </BasicText>

      <div
        class="catalogue__header-right"
        v-responsive-animate.fade.once
      >
        <!-- Recherche mobile -->
        <WrapperInput
          v-if="isMobile"
          v-model="searchTerm"
          placeholder="Rechercher..."
          icon-left="search"
          size="small"
          class="catalogue__search"
        />

        <!-- Boutons -->
        <div
          class="catalogue__buttons"
          v-responsive-animate.fade.stagger="{ delay: 70 }"
        >
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
          <WrapperDropdown
            v-model="sortBy"
            :items="sortItems"
            force-value
            size="small"
          />
        </div>
      </div>
    </header>

    <!-- 🔹 Corps principal -->
    <div
      class="catalogue__body"
      v-responsive-animate.slide.once
    >
      <!-- 🧭 Filtres latéraux (desktop) -->
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

      <!-- 🛒 Liste des produits -->
      <section
        class="catalogue__list"
        v-responsive-animate.fade.scroll
      >
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
            v-responsive-animate.fade.once
          >
            <BasicText color="neutral-700">
              {{ filteredProducts.length }} résultat{{ filteredProducts.length > 1 ? 's' : '' }}
            </BasicText>
          </div>

          <div
            v-if="filteredProducts.length"
            class="catalogue__grid"
            v-responsive-animate.zoom.scroll.stagger="{ delay: 90, speed: 600 }"
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

    <!-- 🧭 Modale mobile : Filtres -->
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
  import ProductCard from '@/features/catalogue/cart/ProductCart.vue'
  import { useCartStore } from '@/features/catalogue/cart/useCartStore'
  import { useFilters } from '@/features/catalogue/composables/useFilters'
  import { useFilterSections } from '@/features/catalogue/composables/useFilterSections'
  import { usePagination } from '@/features/catalogue/composables/usePagination'
  import { useProducts } from '@/features/catalogue/composables/useProducts'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import FilterPanel from './FilterPanel.vue'

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
  /* 🌐 ==================== PAGE CATALOGUE ==================== */
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
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 6px fade(@neutral-900, 8%);
      padding: 28px 32px 24px;
      margin-bottom: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      transition: all 0.25s ease;

      /* Titre principal */
      h2,
      .basic-text {
        font-size: 2rem;
        font-weight: 800;
        color: @neutral-900;
        margin: 0;
      }

      /* Conteneur droit (recherche, tri, filtres) */
      &-right {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px 16px;
        width: 100%;
      }

      /* Barre de recherche mobile */
      .catalogue__search {
        min-width: 180px;
        max-width: 280px;
      }

      /* Filtres + Tri */
      .catalogue__buttons {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 10px;
      }
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

    /* === FILTRES === */
    &__filters {
      flex-shrink: 0;
      width: 260px;
      background: fade(@secondary-800, 6%);
      border: 1px solid fade(@neutral-200, 60%);
      border-radius: 12px;
      padding: 20px 16px;
      overflow-y: auto;
    }

    /* === LISTE PRODUITS === */
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

    /* === RESPONSIVE === */
    @media (max-width: 1024px) {
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
        grid-template-columns: repeat(2, minmax(160px, 1fr));
        gap: 42px 10px;
      }

      &__header {
        padding: 16px 18px;
        border-radius: 10px;
        box-shadow: 0 1px 4px fade(@neutral-900, 6%);
        gap: 14px;

        h2,
        .basic-text {
          font-size: 1.5rem;
        }

        &-right {
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
        }

        .catalogue__buttons {
          width: 100%;
          justify-content: space-between;
        }
      }
    }

    @media (max-width: 600px) {
      &__grid {
        grid-template-columns: 1fr;
        gap: 42px;
      }

      &__header {
        padding: 14px;
        h2,
        .basic-text {
          font-size: 1.3rem;
        }
      }
    }
  }
</style>
