<template>
  <div
    class="catalogue"
    v-responsive-animate.fade.once
  >
    <PageHeader>
      <div
        v-if="isMobile"
        class="catalogue__mobile-controls"
      >
        <WrapperInput
          v-model="searchTerm"
          placeholder="Rechercher..."
          icon-left="search"
          size="small"
          class="catalogue__search-input"
        />
        <WrapperButton
          button-label="Filtres"
          type="primary"
          variant="outlined"
          size="small"
          icon-left="SlidersHorizontal"
          aria-controls="mobile-filter-modal"
          @click="showFilters = true"
        />
      </div>
    </PageHeader>

    <div class="catalogue__body">
      <aside
        v-if="!isMobile"
        class="catalogue__filters"
        aria-label="Panneau de filtres"
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

      <section
        class="catalogue__list"
        aria-live="polite"
      >
        <div class="catalogue__interface">
          <div class="catalogue__interface-top">
            <WrapperInput
              v-if="!isMobile"
              v-model="searchTerm"
              placeholder="Rechercher un peptide..."
              icon-left="search"
              size="small"
              class="catalogue__search-input-desktop"
            />
            <WrapperDropdown
              v-model="sortBy"
              :items="sortItems"
              force-value
              size="small"
              aria-label="Trier"
              class="catalogue__sort-dropdown"
            />
          </div>

          <div
            class="catalogue__interface-bottom"
            v-if="hasLoaded && finalProducts.length > 0"
          >
            <BasicText
              size="body-s"
              color="neutral-400"
              class="catalogue__count"
            >
              <strong style="color: var(--neutral-50)">{{ finalProducts.length }}</strong>
              résultat{{ finalProducts.length > 1 ? 's' : '' }}
            </BasicText>

            <div class="catalogue__tools">
              <BasicPagination
                v-if="nbPages > 1"
                :current-page="page"
                :nb-pages="nbPages"
                :nb-pages-max="5"
                size="small"
                @change="(p) => (page = p)"
              />

              <div
                class="separator"
                v-if="nbPages > 1"
              ></div>

              <div class="catalogue__page-size">
                <span class="label">Voir :</span>
                <WrapperDropdown
                  v-model="pageSize"
                  :items="pageSizeItems"
                  force-value
                  size="small"
                  direction="bottom"
                  class="catalogue__size-dropdown"
                />
              </div>
            </div>
          </div>
        </div>
        <WrapperLoader
          :loading="loading"
          :has-loaded="hasLoaded"
          :is-empty="hasLoaded && finalProducts.length === 0"
          message="Chargement..."
        >
          <template #empty>
            <div class="catalogue__empty-state">
              <div class="catalogue__empty-icon">
                <BasicIcon
                  name="search"
                  size="48"
                  color="neutral-400"
                />
              </div>
              <BasicText
                size="h4"
                weight="bold"
                color="neutral-100"
              >
                Aucun résultat trouvé
              </BasicText>
              <BasicButton
                label="Réinitialiser les filtres"
                type="primary"
                size="small"
                @click="resetAll"
                class="catalogue__empty-btn"
              />
            </div>
          </template>

          <div
            v-if="finalProducts.length"
            class="catalogue__grid"
            v-responsive-animate.zoom.scroll.stagger="{ delay: 50, speed: 500 }"
          >
            <ProductCart
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              @view="viewProduct"
              @add="addToCart"
            />
          </div>
        </WrapperLoader>
      </section>
    </div>

    <ModalComponent
      id="mobile-filter-modal"
      v-model="showFilters"
      closable
      size="small"
      title="Filtres"
    >
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
        <div
          class="justify-content-center flex"
          style="width: 100%"
        >
          <BasicButton
            label="Reset"
            type="secondary"
            variant="outlined"
            @click="resetAll"
            style="margin-right: 10px"
          />
          <BasicButton
            label="Voir les produits"
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
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import type { Products } from '@/supabase/types/supabase.types'
  import { BasicButton } from '@designSystem/components/basic/button'
  import { useSmartToast } from '@designSystem/components/basic/toast/useSmartToast'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProductsStore } from './composables/useProducts'
  import FilterPanel from './FilterPanel.vue'

  const productsStore = useProductsStore()
  const { products, priceRange, hasLoaded, loading } = storeToRefs(productsStore)
  const { load } = productsStore
  const route = useRoute()
  const { isMobile } = useDeviceBreakpoint()
  const router = useRouter()
  const cart = useCartStore()
  const { showAddToCartToast } = useSmartToast()

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
  const {
    searchTerm,
    sortBy,
    sortItems,
    page,
    pageSize,
    pageSizeItems,
    paginatedProducts,
    nbPages,
    filteredProducts: finalProducts,
  } = usePagination(filteredProducts)
  const { filterOpen, allOpen, toggleAll } = useFilterSections()
  const showFilters = ref(false)

  function resetAll() {
    selectedCategories.value = []
    inStockOnly.value = false
    selectedTags.value = []
    priceRange.value = { ...priceRange.value, from: priceRange.value.min, to: priceRange.value.max }
    page.value = 1
    sortBy.value = 'default'
    searchTerm.value = ''
    updateUrl()
  }

  function viewProduct(id: string) {
    router.push(`/catalogue/${id}`)
  }
  function addToCart(p: Products) {
    cart.addToCart(p)
    showAddToCartToast(p)
  }
  function scrollToProductList() {
    const listElement = document.querySelector('.catalogue__list')
    if (listElement) listElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function updateUrl() {
    const query: any = {}
    if (searchTerm.value) query.search = searchTerm.value
    if (selectedCategories.value.length) query.categories = selectedCategories.value.join(',')
    if (selectedTags.value.length) query.tags = selectedTags.value.join(',')
    if (inStockOnly.value) query.stock = 'true'
    if (sortBy.value !== 'default') query.sort = sortBy.value
    if (page.value > 1) query.page = page.value.toString()
    if (pageSize.value !== 24) query.size = pageSize.value.toString()
    if (
      priceRange.value.from > priceRange.value.min ||
      priceRange.value.to < priceRange.value.max
    ) {
      query.minPrice = priceRange.value.from
      query.maxPrice = priceRange.value.to
    }
    router.replace({ query })
  }

  function loadFromUrl() {
    const q = route.query
    if (q.search) searchTerm.value = q.search as string
    if (q.categories) selectedCategories.value = (q.categories as string).split(',')
    if (q.tags) selectedTags.value = (q.tags as string).split(',')
    if (q.stock === 'true') inStockOnly.value = true
    if (q.sort) sortBy.value = q.sort as any
    if (q.page) page.value = parseInt(q.page as string)
    if (q.size) pageSize.value = parseInt(q.size as string)
  }

  onMounted(async () => {
    await load()
    loadFromUrl()
    document.title = (route.meta.title as string) || 'Catalogue'
  })

  watch(
    [selectedCategories, inStockOnly, selectedTags, priceRange, sortBy, searchTerm, pageSize],
    () => {
      page.value = 1
      scrollToProductList()
      updateUrl()
    },
    { deep: true },
  )

  watch(page, () => {
    scrollToProductList()
    updateUrl()
  })
</script>

<style scoped lang="less">
  .catalogue {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px 0;
    opacity: 0;
    animation: fadeIn 0.6s ease forwards;

    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }

    &__mobile-controls {
      display: flex;
      gap: 12px;
      margin-top: 10px;
      @media (max-width: 600px) {
        flex-direction: column;
      }
    }

    &__search-input {
      flex-grow: 1;
    }

    &__body {
      display: flex;
      width: 100%;
      gap: 24px;
      justify-content: center;
    }

    /* SIDEBAR FILTERS */
    &__filters {
      width: 250px;
      flex-shrink: 0;
      background: rgba(var(--secondary-900-rgb), 0.95);
      border: 1px solid color-mix(in srgb, @neutral-300 20%, transparent);
      padding: 20px;
      border-radius: 12px;
      height: fit-content;
      position: sticky;
      top: 20px;

      :deep(.FilterPanel__head .BasicText) {
        color: @neutral-50 !important;
      }
      :deep(.FilterSection__content .BasicText) {
        color: @neutral-200 !important;
      }
    }

    /* LISTE PRINCIPALE */
    &__list {
      flex: 1;
      min-height: 500px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* === INTERFACE UNIFIÉE === */
    &__interface {
      display: flex;
      flex-direction: column;
      background: rgba(var(--secondary-900-rgb), 0.95);
      border: 1px solid color-mix(in srgb, @neutral-300 20%, transparent);
      border-radius: 16px;
    }

    /* Ligne du Haut (Recherche + Tri) CORRIGÉE */
    &__interface-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 20px; /* Padding augmenté pour aérer */

      .catalogue__search-input-desktop {
        flex: 1; /* Prend tout l'espace disponible */
        max-width: none; /* Suppression de la limite qui créait le trou */
      }

      .catalogue__sort-dropdown {
        width: 200px; /* Largeur fixe propre */
        flex-shrink: 0;
      }
    }

    /* Ligne du Bas (Pagination) */
    &__interface-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }

    &__tools {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    &__count {
      opacity: 0.8;
    }

    .separator {
      width: 1px;
      height: 16px;
      background: rgba(255, 255, 255, 0.1);
    }

    &__page-size {
      display: flex;
      align-items: center;
      gap: 8px;
      .label {
        font-size: 0.85rem;
        color: @neutral-400;
      }
      .catalogue__size-dropdown {
        width: 150px;
      }
    }

    /* GRID */
    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 24px;
      padding-bottom: 40px;
    }

    /* EMPTY STATE */
    &__empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 40px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      border: 1px dashed rgba(255, 255, 255, 0.1);
    }
    &__empty-icon {
      margin-bottom: 4px;
    }
    &__empty-btn {
      margin-top: 8px;
    }

    /* RESPONSIVE */
    @media (max-width: 900px) {
      .catalogue__body {
        flex-direction: column;
      }
      .catalogue__filters {
        display: none;
      }

      &__interface-top {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      /* On s'assure que sur mobile/tablette l'input s'affiche correctement si activé */
      .catalogue__search-input-desktop {
        display: none;
      }

      .catalogue__sort-dropdown {
        width: 100%;
      }

      &__interface-bottom {
        flex-direction: column;
        gap: 12px;
        align-items: center;
      }
      &__tools {
        width: 100%;
        justify-content: space-between;
      }
    }
  }
</style>
