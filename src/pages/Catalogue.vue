<template>
  <div class="catalogue">
    <!-- 🔹 Header -->
    <div class="catalogue__header">
      <BasicText
        size="h2"
        weight="bold"
      >
        Catalogue de peptides
      </BasicText>

      <div class="catalogue__header-right">
        <!-- Sort & per page -->
        <div class="catalogue__sorts">
          <BasicDropdown
            v-model="sortBy"
            :items="sortItems"
            size="small"
            dropdown-type="table"
          />
          <BasicDropdown
            v-model="pageSize"
            :items="pageSizeItems"
            size="small"
            dropdown-type="table"
          />
        </div>

        <!-- Search -->
        <div class="catalogue__search">
          <BasicInput
            v-model="searchTerm"
            placeholder="Rechercher un peptide..."
            icon-left="search"
          />
        </div>
      </div>
    </div>

    <!-- 🔹 Corps : filtres + liste -->
    <div class="catalogue__body">
      <!-- 🧭 Filtres -->
      <aside class="catalogue__filters">
        <div class="filters__head">
          <BasicText
            size="h5"
            weight="bold"
          >
            Filtres
          </BasicText>
          <BasicButton
            type="secondary"
            variant="outlined"
            size="small"
            label="Reset"
            @click="resetAll"
          />
        </div>

        <!-- Prix -->
        <div class="catalogue__filter">
          <div class="filter__label">
            <BasicText weight="semibold">Prix</BasicText>
            <BasicIconNext name="ChevronsDownUp" />
          </div>
          <BasicRange v-model="priceRange" />
        </div>
        <!-- Catégories (multi) -->
        <div class="catalogue__filter">
          <div class="filter__label">
            <BasicText weight="semibold">Catégorie</BasicText>
          </div>
          <BasicDropdownMultiple
            v-model="selectedCategories"
            :items="categoryItemsWithCounts"
            placeholder="Toutes les catégories"
            searchable
            deletable
            size="medium"
          />
        </div>

        <!-- Disponibilité -->
        <div class="catalogue__filter">
          <div class="filter__label">
            <BasicText weight="semibold">Disponibilité</BasicText>
          </div>
          <WrapperCheckbox
            v-model="inStockOnly"
            :label="`En stock (${stockCount})`"
          />
        </div>

        <!-- Tags (multi avec compteurs) -->
        <div
          v-if="allTags.length"
          class="catalogue__filter"
        >
          <div class="filter__label">
            <BasicText weight="semibold">Tags</BasicText>
          </div>

          <div class="tags-list">
            <BasicBadge
              v-for="t in tagItemsWithCounts"
              :key="t.id"
              :label="`${t.label} (${t.count})`"
              size="small"
              :type="selectedTags.includes(t.id) ? 'success' : 'default'"
              deletable
              @click="toggleTag(t.id)"
            />
          </div>
        </div>
      </aside>

      <!-- 🛒 Liste -->
      <section class="catalogue__list">
        <WrapperLoader
          :loading="loading"
          :has-loaded="hasLoaded"
          :is-empty="hasLoaded && filteredProducts.length === 0"
          message="Chargement du catalogue..."
          empty-message="Aucun produit trouvé avec ces filtres."
        >
          <!-- Résumé & pagination top -->
          <div
            class="catalogue__summary"
            v-if="hasLoaded"
          >
            <BasicText color="neutral-700">
              {{ filteredProducts.length }} résultat{{ filteredProducts.length > 1 ? 's' : '' }} —
              page {{ page }} / {{ nbPages }}
            </BasicText>
            <BasicPagination
              :current-page="page"
              :nb-pages="nbPages"
              :nb-results="filteredProducts.length"
              :nb-pages-max="5"
              @change="(p) => (page = p)"
            />
          </div>

          <div
            v-if="filteredProducts.length > 0"
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

          <!-- Pagination bottom -->
          <div
            class="catalogue__pagination-bottom"
            v-if="nbPages > 1"
          >
            <BasicPagination
              :current-page="page"
              :nb-pages="nbPages"
              :nb-results="filteredProducts.length"
              :nb-pages-max="7"
              @change="(p) => (page = p)"
            />
          </div>
        </WrapperLoader>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ProductCard from '@/features/cart/ProductCart.vue'
  import { useCartStore } from '@/features/cart/useCartStore'
  import { useRange } from '@/features/catalogue/composables/useRange'
  import { supabase } from '@/supabase/supabaseClient'
  import type { Tables } from '@/supabase/types/supabase'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  type Product = Tables<'products'>

  /* Stores */
  const cart = useCartStore()
  const toast = useToastStore()
  const router = useRouter()

  const { min: priceMin, max: priceMax, from: priceFrom, to: priceTo } = useRange(0, 0)

  const priceRange = ref({
    min: priceMin,
    max: priceMax,
    from: priceFrom,
    to: priceTo,
    step: 0.1,
  })

  /* State */
  const loading = ref(false)
  const hasLoaded = ref(false)
  const products = ref<Product[]>([])

  /* Search / sort / pagination */
  const searchTerm = ref('')
  const sortBy = ref<'default' | 'price-asc' | 'price-desc' | 'new'>('default')
  const sortItems = [
    { id: 'default', label: 'Tri : Par défaut' },
    { id: 'price-asc', label: 'Prix croissant' },
    { id: 'price-desc', label: 'Prix décroissant' },
    { id: 'new', label: 'Nouveautés' },
  ]

  const page = ref(1)
  const pageSize = ref<number>(24)
  const pageSizeItems = [
    { id: 12, label: '12 / page' },
    { id: 24, label: '24 / page' },
    { id: 48, label: '48 / page' },
  ]

  /* Filters */
  const selectedCategories = ref<string[]>([])
  const inStockOnly = ref(false)
  const selectedTags = ref<string[]>([])

  /* Load data */
  async function loadProducts() {
    loading.value = true
    try {
      const { data, error } = await supabase.from('products').select('*')
      if (error) throw error

      const rows = (data || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        price: typeof r.price === 'string' ? parseFloat(r.price) : r.price,
        purity:
          r.purity === null ? null : typeof r.purity === 'string' ? parseFloat(r.purity) : r.purity,
        stock: r.stock,
        image: r.image,
        description: r.description,
        tags: r.tags || [],
      })) as Product[]

      products.value = rows

      const prices = rows.map((p) => p.price)
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      priceMin.value = isFinite(min) ? Math.floor(min) : 0
      priceMax.value = isFinite(max) ? Math.ceil(max) : 0
      priceFrom.value = priceMin.value
      priceTo.value = priceMax.value
    } catch (err) {
      console.error(err)
      toast.show('Erreur lors du chargement du catalogue', 'danger')
    } finally {
      loading.value = false
      hasLoaded.value = true
    }
  }

  onMounted(loadProducts)

  /* Derived lists */
  const categories = computed(() =>
    Array.from(new Set(products.value.map((p) => p.category).filter(Boolean))).sort(),
  )

  const categoryItemsWithCounts = computed(() => {
    const counts: Record<string, number> = {}
    for (const p of priceFiltered.value) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return categories.value.map((c) => ({ id: c, label: `${c} (${counts[c] || 0})` }))
  })

  const allTags = computed(() => {
    const set = new Set<string>()
    for (const p of products.value) (p.tags || []).forEach((t) => set.add(t))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })

  const tagItemsWithCounts = computed(() => {
    const counts: Record<string, number> = {}
    for (const p of priceFiltered.value) {
      for (const t of p.tags || []) {
        counts[t] = (counts[t] || 0) + 1
      }
    }
    return allTags.value.map((t) => ({ id: t, label: t, count: counts[t] || 0 }))
  })

  /* Dynamic counts */
  const stockCount = computed(() => priceFiltered.value.filter((p) => !!p.stock).length)

  /* Filtering pipeline (dans l’ordre : prix → texte → categories → stock → tags) */
  const priceFiltered = computed(() =>
    products.value.filter((p) => p.price >= priceFrom.value && p.price <= priceTo.value),
  )

  const searchFiltered = computed(() => {
    const q = searchTerm.value.trim().toLowerCase()
    if (!q) return priceFiltered.value
    return priceFiltered.value.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q)),
    )
  })

  const categoryFiltered = computed(() => {
    if (selectedCategories.value.length === 0) return searchFiltered.value
    const set = new Set(selectedCategories.value)
    return searchFiltered.value.filter((p) => set.has(p.category))
  })

  const stockFiltered = computed(() =>
    inStockOnly.value ? categoryFiltered.value.filter((p) => !!p.stock) : categoryFiltered.value,
  )

  const tagFiltered = computed(() => {
    if (selectedTags.value.length === 0) return stockFiltered.value
    const set = new Set(selectedTags.value)
    return stockFiltered.value.filter((p) => (p.tags || []).some((t) => set.has(t)))
  })

  /* Sorting */
  const sortedProducts = computed(() => {
    const arr = [...tagFiltered.value]
    switch (sortBy.value) {
      case 'price-asc':
        return arr.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return arr.sort((a, b) => b.price - a.price)
      case 'new':
        return arr.sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
        )
      default:
        return arr.sort((a, b) => a.name.localeCompare(b.name))
    }
  })

  /* Pagination */
  const filteredProducts = sortedProducts

  const nbPages = computed(() =>
    Math.max(1, Math.ceil(filteredProducts.value.length / pageSize.value)),
  )

  const paginatedProducts = computed(() => {
    page.value = Math.min(page.value, nbPages.value)
    const start = (page.value - 1) * pageSize.value
    return filteredProducts.value.slice(start, start + pageSize.value)
  })

  watch(
    [
      searchTerm,
      selectedCategories,
      inStockOnly,
      selectedTags,
      priceFrom,
      priceTo,
      sortBy,
      pageSize,
    ],
    () => {
      page.value = 1
    },
  )

  /* Actions */
  function resetAll() {
    searchTerm.value = ''
    selectedCategories.value = []
    inStockOnly.value = false
    selectedTags.value = []
    priceFrom.value = priceMin.value
    priceTo.value = priceMax.value
    sortBy.value = 'default'
    page.value = 1
  }

  function toggleTag(id: string) {
    if (selectedTags.value.includes(id)) {
      selectedTags.value = selectedTags.value.filter((t) => t !== id)
    } else {
      selectedTags.value.push(id)
    }
  }

  function viewProduct(id: string) {
    router.push(`/catalogue/${id}`)
  }

  function addToCart(product: Product, qty = 1) {
    cart.addToCart({
      ...product,
      stock: product.stock ?? false,
      image: product.image ?? '',
      quantity: qty,
    })
    toast.show(`✅ ${product.name} ajouté au panier`, 'success')
  }
</script>

<style scoped lang="less">
  .catalogue {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
    overflow: hidden;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid fade(@neutral-200, 70%);
      flex-shrink: 0;
      box-shadow: 0 2px 8px fade(@neutral-900, 6%);
      gap: 16px;
    }

    &__header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    &__sorts {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    &__body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    &__filters {
      width: 280px;
      background: fade(@secondary-800, 6%);
      border-right: 1px solid fade(@neutral-100, 25%);
      padding: 20px 16px;
      flex-shrink: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 18px;

      .filters__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    &__filter {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #fff;
      border: 1px solid @neutral-200;
      border-radius: 12px;
      padding: 12px;
    }

    .filter__label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: @neutral-800;
    }

    &__list {
      flex: 1;
      overflow-y: auto;
      padding: 24px 32px;
      background: linear-gradient(to bottom, @neutral-50, @neutral-100);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    &__summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 8px 8px;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 28px 22px;
    }

    &__pagination-bottom {
      display: flex;
      justify-content: center;
      padding: 12px 0;
    }

    @media (max-width: 1000px) {
      &__body {
        flex-direction: column;
      }
      &__filters {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid @neutral-200;
        background: white;
        padding: 12px;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 12px;
      }
      &__filter {
        width: calc(50% - 8px);
      }
      &__list {
        padding: 16px;
      }
      &__grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
      }
    }

    @media (max-width: 640px) {
      &__filter {
        width: 100%;
      }
    }
  }

  /* ===== Double range slider ===== */
  .price-range {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__slider {
      position: relative;
      height: 30px;
    }

    .range {
      position: absolute;
      left: 0;
      right: 0;
      top: 8px;
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      background: none;
      pointer-events: none; /* on capture la poignée uniquement */

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        pointer-events: all;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: @primary-600;
        border: 2px solid white;
        box-shadow: 0 0 0 1px fade(@primary-600, 30%);
        cursor: pointer;
      }
      &::-moz-range-thumb {
        pointer-events: all;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: @primary-600;
        border: 2px solid white;
        box-shadow: 0 0 0 1px fade(@primary-600, 30%);
        cursor: pointer;
      }
      &::-webkit-slider-runnable-track,
      &::-moz-range-track {
        height: 4px;
        background: @neutral-300;
        border-radius: 2px;
      }
      &::-webkit-slider-runnable-track,
      &::-moz-range-track {
        height: 4px;
        background: @neutral-300;
        border-radius: 2px;
      }
    }

    .range-track {
      position: absolute;
      top: 10px;
      height: 4px;
      background: @primary-500;
      border-radius: 2px;
    }

    &__inputs {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
  }

  /* ===== Tags ===== */
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .tag-option {
      display: flex;
      align-items: center;
      gap: 6px;
      background: fade(@neutral-200, 40%);
      border-radius: 6px;
      padding: 4px 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      input {
        display: none;
      }

      &__label {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: @neutral-800;
      }

      &__count {
        font-size: 12px;
        color: @neutral-500;
      }

      &:hover {
        background: fade(@primary-600, 10%);
      }

      input:checked + &__label {
        font-weight: 600;
        color: @primary-700;
      }
    }
  }
</style>
