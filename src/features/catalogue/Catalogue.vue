<template>
  <div class="catalogue-page">
    <PageHeader>
      <div class="catalogue-quick-nav">
        <PremiumButton
          :type="selectedCategories.length === 0 ? 'primary' : 'secondary'"
          :variant="selectedCategories.length === 0 ? 'solid' : 'ghost'"
          size="sm"
          label="✨ Tous"
          :badge="products.length.toString()"
          class="catalogue-chip"
          @click="selectedCategories = []"
        />
        <PremiumButton
          v-for="cat in topCategories"
          :key="cat.id"
          :type="selectedCategories.includes(cat.id) ? 'primary' : 'secondary'"
          :variant="selectedCategories.includes(cat.id) ? 'solid' : 'ghost'"
          size="sm"
          :label="cat.label"
          :badge="cat.count.toString()"
          class="catalogue-chip"
          @click="toggleCategory(cat.id)"
        />
      </div>

      <!-- Mobile Controls -->
      <div
        v-if="isMobile"
        class="catalogue-mobile-bar"
      >
        <div class="catalogue-search catalogue-search--mobile">
          <BasicIconNext name="Search" :size="18" />
          <input
            v-model="searchTerm"
            type="text"
            class="catalogue-search__input"
            :placeholder="t('common.search') + '...'"
          />
        </div>
        <PremiumButton
          type="primary"
          variant="outline"
          size="sm"
          :label="t('common.filter')"
          icon-left="SlidersHorizontal"
          class="catalogue-filter-btn"
          @click="showFilters = true"
        >
          <template #append>
            <span
              v-if="activeFiltersCount"
              class="catalogue-filter-btn__badge"
            >
              {{ activeFiltersCount }}
            </span>
          </template>
        </PremiumButton>
      </div>
    </PageHeader>

    <PageContent
      size="xl"
      direction="row"
      class="catalogue-body"
    >
      <FilterPanel
        v-if="!isMobile"
        class="catalogue-sidebar"
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
      <main class="catalogue-main">
        <!-- Toolbar -->
        <div class="catalogue-toolbar">
          <!-- Search Desktop -->
          <div
            v-if="!isMobile"
            class="catalogue-search"
          >
            <BasicIconNext name="Search" :size="18" />
            <input
              v-model="searchTerm"
              type="text"
              class="catalogue-search__input"
              :placeholder="t('catalogue.searchPlaceholder')"
            />
            <PremiumButton
              v-if="searchTerm"
              type="secondary"
              variant="ghost"
              size="xs"
              icon-left="X"
              class="catalogue-search__clear"
              @click="searchTerm = ''"
            />
          </div>

          <!-- Results count - bien séparé -->
          <div class="catalogue-toolbar__results">
            <span class="catalogue-toolbar__count">{{ finalProducts.length }}</span>
            <span class="catalogue-toolbar__label">
              {{ t('catalogue.results.products') }}
            </span>
          </div>

          <!-- Right side controls -->
          <div class="catalogue-toolbar__right">
            <!-- Sort -->
            <select
              v-model="sortBy"
              class="catalogue-toolbar__select"
            >
              <option
                v-for="item in sortItems"
                :value="item"
              >
                {{ item.label }}
              </option>
            </select>

            <!-- View Mode Toggle -->
            <div class="catalogue-toolbar__view">
              <PremiumButton
                :type="viewMode === 'grid' ? 'primary' : 'secondary'"
                :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
                size="sm"
                icon-left="LayoutGrid"
                class="catalogue-toolbar__view-btn"
                @click="viewMode = 'grid'"
              />
              <PremiumButton
                :type="viewMode === 'list' ? 'primary' : 'secondary'"
                :variant="viewMode === 'list' ? 'solid' : 'ghost'"
                size="sm"
                icon-left="List"
                class="catalogue-toolbar__view-btn"
                @click="viewMode = 'list'"
              />
            </div>
          </div>
        </div>

        <!-- Active Filters Pills -->
        <div
          v-if="hasActiveFilters"
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
        </div>

        <!-- Products Grid -->
        <WrapperLoader
          :loading="loading"
          :has-loaded="hasLoaded"
          :is-empty="hasLoaded && finalProducts.length === 0"
          :message="t('common.loading')"
        >
          <template #empty>
            <div class="catalogue-empty">
              <div class="catalogue-empty__icon">
                <BasicIconNext name="Search" :size="48" />
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
            </div>
          </template>

          <div
            class="catalogue-grid"
            :class="{ 'catalogue-grid--list': viewMode === 'list' }"
          >
            <ProductCart
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              @view="viewProduct"
              @add="addToCart"
              @buy="handleBuyNow"
            />
          </div>
        </WrapperLoader>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
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
  import { useHead } from '@vueuse/head'
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
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'

  const { t } = useI18n()
  import { useProductsStore } from './composables/useProducts'
  import FilterPanel from './FilterPanel.vue'

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
  const viewMode = ref<'grid' | 'list'>(
    (route.query.view as 'grid' | 'list') || 'grid',
  )

  // Extraire le count depuis le label (format: "Category (X)")
  const extractCount = (label: string): number => {
    const match = label.match(/\((\d+)\)$/)
    return match ? parseInt(match[1]!, 10) : 0
  }

  // Extraire le nom de catégorie sans le count
  const extractCategoryName = (label: string): string => {
    return label.replace(/\s*\(\d+\)$/, '')
  }

  // Top categories for quick nav (avec count extrait du label)
  const topCategories = computed(() => {
    return categoryItemsWithCounts.value
      .map((cat) => ({
        id: cat.id,
        label: extractCategoryName(cat.label),
        count: extractCount(cat.label),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  })

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

  function viewProduct(id: string) {
    router.push(`/catalogue/${id}`)
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
    [selectedCategories, inStockOnly, selectedTags, priceRange, sortBy, searchTerm, pageSize, viewMode],
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
    // QUICK NAV
    // =========================================
    &-quick-nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      margin-top: 20px;

      @media (max-width: 1100px) {
        overflow-x: auto;
        flex-wrap: nowrap;
        justify-content: flex-start;
        padding-bottom: 8px;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    // =========================================
    // CHIP
    // =========================================
    &-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @neutral-400;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.12);
        color: @neutral-200;
      }

      &--active {
        background: rgba(var(--primary-500-rgb), 0.12);
        border-color: rgba(var(--primary-500-rgb), 0.3);
        color: var(--primary-300);

        .catalogue-chip__count {
          background: rgba(var(--primary-500-rgb), 0.2);
          color: var(--primary-400);
        }
      }

      &__icon {
        font-size: 14px;
      }

      &__dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      &__count {
        padding: 2px 6px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        color: @neutral-500;
      }

      @media (max-width: 1100px) {
        flex-shrink: 0;
      }
    }

    // =========================================
    // MOBILE BAR
    // =========================================
    &-mobile-bar {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    // =========================================
    // FILTER BTN
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
      width: 280px;
      flex-shrink: 0;
      position: sticky;
      height: fit-content;
      max-height: calc(100vh - 48px);
      overflow-y: auto;
      padding: 20px;
      background: rgba(var(--secondary-900-rgb), 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;

      @media (max-width: 900px) {
        display: none;
      }
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
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 20px;
      background: rgba(var(--secondary-900-rgb), 0.95);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      margin-bottom: 16px;

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

      &__right {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: auto;
      }

      &__select {
        padding: 10px 36px 10px 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        font-family: @font-body;
        font-size: 13px;
        color: @neutral-200;
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;

        &:focus {
          outline: none;
          border-color: var(--primary-500);
        }

        option {
          background: var(--secondary-900);
          color: @neutral-200;
        }
      }

      &__view {
        display: flex;
        gap: 4px;
        padding: 4px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 10px;

        &-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: @neutral-500;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            color: @neutral-300;
            background: rgba(255, 255, 255, 0.05);
          }

          &--active {
            background: rgba(var(--primary-500-rgb), 0.15);
            color: var(--primary-400);
          }
        }
      }

      @media (max-width: 900px) {
        flex-wrap: wrap;

        &__results {
          order: -1;
          width: 100%;
          justify-content: center;
        }

        &__right {
          margin-left: 0;
          width: 100%;
          justify-content: space-between;
        }
      }
    }

    // =========================================
    // SEARCH
    // =========================================
    &-search {
      position: relative;
      flex: 1;
      display: flex;
      max-width: 320px;
      min-width: 180px;

      &--mobile {
        flex: 1;
        max-width: none;
      }

      &__icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: @neutral-500;
        pointer-events: none;
      }

      &__input {
        width: 100%;
        padding: 10px 14px 10px 42px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        font-family: @font-body;
        font-size: 14px;
        color: @neutral-100;
        outline: none;

        &::placeholder {
          color: @neutral-600;
        }

        &:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
        }
      }

      &__clear {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 22px;
        height: 22px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 6px;
        color: @neutral-400;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background: rgba(255, 255, 255, 0.15);
          color: @neutral-100;
        }
      }

      @media (max-width: 900px) {
        display: none;
      }
    }

    // =========================================
    // ACTIVE FILTERS
    // =========================================
    &-active-filters {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(var(--secondary-900-rgb), 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
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
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        font-family: @font-body;
        font-size: 12px;
        color: @neutral-400;
        cursor: pointer;
        white-space: nowrap;

        &:hover {
          background: rgba(255, 255, 255, 0.05);
          color: @neutral-200;
        }
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

      @media (max-width: 600px) {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 12px;
      }
    }

    // =========================================
    // EMPTY STATE
    // =========================================
    &-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 40px;
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

      @media (max-width: 600px) {
        flex-direction: column;
        gap: 12px;
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
