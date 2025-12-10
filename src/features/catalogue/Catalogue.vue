<template>
  <div class="catalogue-page">
    <PageHeader>
      <!-- Mobile Controls -->
      <div
        v-if="isMobile"
        class="catalogue-mobile-bar"
      >
        <BasicInput
          v-model="searchTerm"
          :placeholder="t('common.search') + '...'"
          icon-name="Search"
          icon-state="iconLeft"
          deletable
          size="medium"
          class="catalogue-search catalogue-search--mobile"
        />
        <!-- Filtre icon only -->
        <button
          class="catalogue-mobile-bar__icon-btn"
          @click="showFilters = true"
        >
          <BasicIconNext
            name="SlidersHorizontal"
            :size="20"
          />
          <span
            v-if="activeFiltersCount"
            class="catalogue-mobile-bar__badge"
          >
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>
    </PageHeader>

    <PageContent
      size="xl"
      direction="row"
      class="catalogue-body"
    >
      <ContentBlock
        v-if="!isMobile"
        variant="card"
        size="md"
        class="catalogue-sidebar"
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
      </ContentBlock>
      <main class="catalogue-main">
        <!-- Toolbar -->
        <ContentBlock
          variant="card"
          size="sm"
          class="catalogue-toolbar"
        >
          <!-- Search Desktop -->
          <BasicInput
            v-if="!isMobile"
            v-model="searchTerm"
            :placeholder="t('catalogue.searchPlaceholder')"
            icon-name="Search"
            icon-state="iconLeft"
            deletable
            size="small"
            class="catalogue-search"
          />

          <!-- Results count -->
          <div
            v-if="!isMobile"
            class="catalogue-toolbar__results"
          >
            <span class="catalogue-toolbar__count">{{ finalProducts.length }}</span>
            <span class="catalogue-toolbar__label">
              {{ t('catalogue.results.products') }}
            </span>
          </div>
          <!-- Results count mobile (compact) -->
          <span
            v-else
            class="catalogue-toolbar__results-mobile"
          >
            {{ finalProducts.length }} {{ t('catalogue.results.products') }}
          </span>

          <!-- Right side controls -->
          <div class="catalogue-toolbar__right">
            <!-- Sort -->
            <WrapperDropdown
              v-model="sortBy"
              :items="sortItems"
              placeholder="Trier par"
              size="small"
              force-value
              variant="dark"
              class="catalogue-toolbar__dropdown"
            />

            <!-- View Mode Toggle (desktop only) -->
            <div
              v-if="!isMobile"
              class="catalogue-toolbar__view"
            >
              <PremiumButton
                type="secondary"
                :variant="viewMode === 'grid' ? 'outline' : 'ghost'"
                size="sm"
                icon-left="LayoutGrid"
                :class="[
                  'catalogue-toolbar__view-btn',
                  { 'catalogue-toolbar__view-btn--active': viewMode === 'grid' },
                ]"
                @click="viewMode = 'grid'"
              />
              <PremiumButton
                type="secondary"
                :variant="viewMode === 'list' ? 'outline' : 'ghost'"
                size="sm"
                icon-left="List"
                :class="[
                  'catalogue-toolbar__view-btn',
                  { 'catalogue-toolbar__view-btn--active': viewMode === 'list' },
                ]"
                @click="viewMode = 'list'"
              />
            </div>
          </div>
        </ContentBlock>

        <!-- Active Filters Pills -->
        <ContentBlock
          v-if="hasActiveFilters"
          variant="card"
          size="sm"
          class="catalogue-active-filters"
        >
          <div class="catalogue-active-filters__list">
            <span class="catalogue-active-filters__label">{{ t('catalogue.filters.title') }}:</span>

            <PremiumButton
              v-for="cat in selectedCategories"
              :key="`cat-${cat}`"
              type="primary"
              variant="outline"
              size="xs"
              :label="cat"
              icon-right="X"
              class="catalogue-pill"
              @click="toggleCategory(cat)"
            />

            <PremiumButton
              v-for="tag in selectedTags"
              :key="`tag-${tag}`"
              type="primary"
              variant="outline"
              size="xs"
              :label="tag"
              icon-right="X"
              class="catalogue-pill"
              @click="toggleTag(tag)"
            />

            <PremiumButton
              v-if="inStockOnly"
              type="primary"
              variant="outline"
              size="xs"
              :label="t('catalogue.filters.inStock')"
              icon-right="X"
              class="catalogue-pill"
              @click="inStockOnly = false"
            />
          </div>

          <PremiumButton
            type="secondary"
            variant="ghost"
            size="xs"
            :label="t('catalogue.filters.resetAll')"
            icon-left="RotateCcw"
            class="catalogue-active-filters__clear"
            @click="resetAll"
          />
        </ContentBlock>

        <!-- Products Grid -->
        <WrapperLoader
          :loading="loading"
          :has-loaded="hasLoaded"
          :is-empty="hasLoaded && finalProducts.length === 0"
          :message="t('common.loading')"
        >
          <template #empty>
            <ContentBlock
              variant="card"
              size="lg"
              class="catalogue-empty"
            >
              <div class="catalogue-empty__icon">
                <BasicIconNext
                  name="Search"
                  :size="48"
                />
              </div>
              <h3 class="catalogue-empty__title">{{ t('catalogue.results.noResults') }}</h3>
              <p class="catalogue-empty__text">
                {{ t('catalogue.results.noResultsText') }}
              </p>
              <PremiumButton
                type="primary"
                variant="solid"
                size="md"
                :label="t('catalogue.filters.resetAll')"
                icon-left="RotateCcw"
                @click="resetAll"
              />
            </ContentBlock>
          </template>

          <div
            class="catalogue-grid"
            :class="{ 'catalogue-grid--list': viewMode === 'list' }"
          >
            <ProductCart
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              :view-mode="viewMode"
              @view="viewProduct"
              @add="addToCart"
              @buy="handleBuyNow"
            />
          </div>
        </WrapperLoader>

        <!-- Pagination Desktop -->
        <div
          v-if="totalPages > 1 && !isMobile"
          class="catalogue-pagination"
        >
          <PremiumButton
            type="secondary"
            variant="outline"
            size="md"
            :label="t('common.previous')"
            icon-left="ChevronLeft"
            class="catalogue-pagination__btn"
            :disabled="page === 1"
            @click="page--"
          />

          <span class="catalogue-pagination__info">Page {{ page }} / {{ totalPages }}</span>

          <PremiumButton
            type="secondary"
            variant="outline"
            size="md"
            :label="t('common.next')"
            icon-right="ChevronRight"
            class="catalogue-pagination__btn"
            :disabled="page === totalPages"
            @click="page++"
          />
        </div>

        <!-- Load More Mobile -->
        <div
          v-if="totalPages > 1 && isMobile && page < totalPages"
          class="catalogue-load-more"
        >
          <PremiumButton
            type="primary"
            variant="outline"
            size="md"
            :label="t('common.loadMore')"
            icon-left="Plus"
            @click="page++"
          />
          <span class="catalogue-load-more__info">
            {{ page }} / {{ totalPages }}
          </span>
        </div>
      </main>
    </PageContent>

    <!-- Mobile Filter Modal -->
    <ModalComponent
      id="mobile-filter-modal"
      v-model="showFilters"
      closable
      size="small"
      :title="t('catalogue.filters.title')"
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
        <div class="catalogue-modal-actions">
          <PremiumButton
            :label="t('catalogue.filters.resetAll')"
            type="secondary"
            variant="outline"
            @click="resetAll"
          />
          <PremiumButton
            :label="`${t('catalogue.results.showing')} ${finalProducts.length} ${t('catalogue.results.products')}`"
            type="primary"
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
  import PageContent from '@/features/shared/components/PageContent.vue'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import type { Products } from '@/supabase/types/supabase.types'
  import { useSmartToast } from '@designSystem/components/basic/toast/useSmartToast'
  import { useHead } from '@vueuse/head'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import { useProductsStore } from './composables/useProducts'
  import FilterPanel from './FilterPanel.vue'

  const { t } = useI18n()

  // Configuration SEO pour la page catalogue
  useHead({
    title: 'Catalogue Peptides - Atlas Lab Solutions',
    meta: [
      {
        name: 'description',
        content:
          'Parcourez notre catalogue complet de peptides de recherche. Filtrez par catégorie, pureté et disponibilité. Qualité garantie ≥99%, expédition rapide.',
      },
      {
        property: 'og:title',
        content: 'Catalogue Peptides - Atlas Lab Solutions',
      },
      {
        property: 'og:description',
        content:
          'Large sélection de peptides de haute pureté pour vos projets de recherche scientifique.',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: 'https://fast-peptides.com/catalogue',
      },
    ],
  })

  const productsStore = useProductsStore()
  const { products, priceRange, hasLoaded, loading } = storeToRefs(productsStore)
  const { load } = productsStore
  const route = useRoute()
  const router = useRouter()
  const cart = useCartStore()
  const { showAddToCartToast } = useSmartToast()
  const { isMobile } = useDeviceBreakpoint()

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
    paginatedProducts,
    filteredProducts: finalProducts,
  } = usePagination(filteredProducts)

  const { filterOpen, allOpen, toggleAll } = useFilterSections()

  // UI State
  const showFilters = ref(false)
  const viewMode = ref<'grid' | 'list'>((route.query.view as 'grid' | 'list') || 'grid')

  // Active filters
  const hasActiveFilters = computed(() => {
    return selectedCategories.value.length > 0 || selectedTags.value.length > 0 || inStockOnly.value
  })

  const activeFiltersCount = computed(() => {
    return selectedCategories.value.length + selectedTags.value.length + (inStockOnly.value ? 1 : 0)
  })

  // Pagination
  const totalPages = computed(() => Math.ceil(finalProducts.value.length / pageSize.value))

  // Methods
  function toggleCategory(id: string) {
    const idx = selectedCategories.value.indexOf(id)
    if (idx >= 0) {
      selectedCategories.value.splice(idx, 1)
    } else {
      selectedCategories.value.push(id)
    }
  }

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

  function viewProduct(slug: string) {
    router.push(`/catalogue/${slug}`)
  }

  function addToCart(p: Products) {
    cart.addToCart(p)
    showAddToCartToast(p)
  }

  async function handleBuyNow(product: Products) {
    await cart.addToCart(product)
    router.push('/checkout')
  }

  function scrollToProductList() {
    const el = document.querySelector('.catalogue-main')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function updateUrl() {
    const query: Record<string, string> = {}
    if (searchTerm.value) query.search = searchTerm.value
    if (selectedCategories.value.length) query.categories = selectedCategories.value.join(',')
    if (selectedTags.value.length) query.tags = selectedTags.value.join(',')
    if (inStockOnly.value) query.stock = 'true'
    if (sortBy.value !== 'default') query.sort = sortBy.value
    if (page.value > 1) query.page = page.value.toString()
    if (viewMode.value !== 'grid') query.view = viewMode.value
    router.replace({ query })
  }

  function loadFromUrl() {
    const q = route.query
    if (q.search) searchTerm.value = q.search as string
    if (q.categories) selectedCategories.value = (q.categories as string).split(',')
    if (q.tags) selectedTags.value = (q.tags as string).split(',')
    if (q.stock === 'true') inStockOnly.value = true
    if (q.sort) sortBy.value = q.sort as 'default' | 'price-asc' | 'price-desc' | 'new'
    if (q.page) page.value = parseInt(q.page as string)
  }

  onMounted(async () => {
    await load()
    loadFromUrl()
    document.title = (route.meta.title as string) || 'Catalogue – Fast Peptides'
  })

  // ⚠️ PAS de scrollToProductList() ici - c'est ça qui causait le scroll brutal
  watch(
    [
      selectedCategories,
      inStockOnly,
      selectedTags,
      priceRange,
      sortBy,
      searchTerm,
      pageSize,
      viewMode,
    ],
    () => {
      page.value = 1
      updateUrl()
    },
    { deep: true },
  )

  // Scroll uniquement lors du changement de PAGE (pagination)
  watch(page, () => {
    scrollToProductList()
    updateUrl()
  })
</script>

<style scoped lang="less">
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
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .catalogue {
    // =========================================
    // PAGE
    // =========================================
    &-page {
      position: relative;
      min-height: 100vh;
    }

    // =========================================
    // MOBILE BAR
    // =========================================
    &-mobile-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;

      &__icon-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        background: var(--surface-1);
        border: 1px solid var(--border-default);
        border-radius: 10px;
        color: var(--text-primary);
        cursor: pointer;
        flex-shrink: 0;
        transition: all 0.2s ease;

        &:active {
          transform: scale(0.95);
          background: var(--surface-2);
        }
      }

      &__badge {
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        background: var(--primary-500);
        border-radius: 9px;
        font-size: 11px;
        font-weight: 700;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    // =========================================
    // FILTER BTN (desktop)
    // =========================================
    &-filter-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 18px;
      background: rgba(var(--primary-500-rgb), 0.1);
      border: 1px solid rgba(var(--primary-500-rgb), 0.3);
      border-radius: 12px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-400);
      cursor: pointer;
      white-space: nowrap;

      &__badge {
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        background: var(--primary-500);
        border-radius: 10px;
        font-size: 11px;
        font-weight: 700;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    // =========================================
    // SIDEBAR
    // =========================================
    &-sidebar {
      // Styles de base gérés par ContentBlock
      width: 280px;
      flex-shrink: 0;
      position: sticky;
      height: fit-content;
      max-height: calc(100vh - 48px);
      overflow-y: auto;

      // Masquer sur mobile (la barre mobile est affichée via v-if="isMobile")
      .respond-mobile({
        display: none;
      });
    }

    // =========================================
    // MAIN
    // =========================================
    &-main {
      flex: 1;
      min-width: 0;
    }

    // =========================================
    // TOOLBAR
    // =========================================
    &-toolbar {
      // Styles de base gérés par ContentBlock
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;

      &__results {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: rgba(var(--primary-500-rgb), 0.1);
        border: 1px solid rgba(var(--primary-500-rgb), 0.2);
        border-radius: 10px;
        flex-shrink: 0;
      }

      &__count {
        font-family: @font-display;
        font-size: 18px;
        font-weight: 700;
        color: var(--primary-400);
      }

      &__label {
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-400;
      }

      &__results-mobile {
        font-family: @font-body;
        font-size: 13px;
        color: var(--text-muted);
      }

      &__right {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: auto;
      }

      &__dropdown {
        min-width: 130px;
      }

      &__view {
        display: flex;
        gap: 4px;
      }

      // Mobile (≤ 720px)
      .respond-mobile({
        flex-wrap: wrap;
        gap: 12px;

        &__results {
          order: -1;
          width: 100%;
          justify-content: center;
          padding: 6px 12px;
        }

        &__count {
          font-size: 16px;
        }

        &__label {
          font-size: 13px;
        }

        &__right {
          margin-left: 0;
          width: 100%;
          justify-content: space-between;
        }

        &__dropdown {
          min-width: 110px;
        }
      });
    }

    // =========================================
    // SEARCH
    // =========================================
    &-search {
      flex: 1;
      min-width: 140px;
      max-width: 280px;

      &--mobile {
        flex: 1;
        max-width: none;
        min-width: 0;
      }

      // Masquer le search desktop sur mobile
      .respond-mobile({
        display: none;
      });
    }

    // =========================================
    // ACTIVE FILTERS
    // =========================================
    &-active-filters {
      // Styles de base gérés par ContentBlock
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;

      &__list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }

      &__label {
        font-family: @font-body;
        font-size: 13px;
        font-weight: 500;
        color: @neutral-400;
      }

      &__clear {
        white-space: nowrap;
      }
    }

    // =========================================
    // PILL
    // =========================================
    &-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: rgba(var(--primary-500-rgb), 0.1);
      border: 1px solid rgba(var(--primary-500-rgb), 0.25);
      border-radius: 8px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 500;
      color: var(--primary-300);
      cursor: pointer;

      &__dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }

      svg {
        color: var(--primary-400);
        opacity: 0.7;
      }

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.15);
      }
    }

    // =========================================
    // GRID
    // =========================================
    &-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;

      &--list {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      // Mobile (≤ 720px)
      .respond-mobile({
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
      });
    }

    // =========================================
    // EMPTY STATE
    // =========================================
    &-empty {
      // Styles de base gérés par ContentBlock
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      &__icon {
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.03);
        border: 1px dashed rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        color: @neutral-600;
        margin-bottom: 24px;
      }

      &__title {
        font-family: @font-display;
        font-size: 22px;
        font-weight: 600;
        color: @neutral-200;
        margin: 0 0 8px;
      }

      &__text {
        font-family: @font-body;
        font-size: 15px;
        color: @neutral-500;
        margin: 0 0 24px;
      }

      &__btn {
        padding: 14px 24px;
        background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
        border: none;
        border-radius: 12px;
        font-family: @font-body;
        font-size: 14px;
        font-weight: 600;
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(var(--primary-500-rgb), 0.3);

        &:hover {
          box-shadow: 0 6px 20px rgba(var(--primary-500-rgb), 0.4);
        }
      }
    }

    // =========================================
    // PAGINATION
    // =========================================
    &-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 40px;
      padding-top: 32px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);

      &__btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-300;
        cursor: pointer;

        &:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }

      &__info {
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-500;
      }

    }

    // =========================================
    // LOAD MORE (Mobile)
    // =========================================
    &-load-more {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-top: 24px;
      padding-top: 20px;

      &__info {
        font-family: @font-body;
        font-size: 13px;
        color: var(--text-muted);
      }
    }

    // =========================================
    // MODAL ACTIONS
    // =========================================
    &-modal-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      width: 100%;
    }
  }
</style>
