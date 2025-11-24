import type { Products } from '@/supabase/types/supabase.types'
import { computed, ref, type Ref } from 'vue'

type Range = {
  min: number
  max: number
  from: number
  to: number
  step: number
}

/**
 * Gère les filtres dynamiques du catalogue (prix, stock, tags, catégories)
 */
export function useFilters(products: Ref<Products[]>, priceRange: Ref<Range>) {
  // 🧭 États des filtres
  const selectedCategories = ref<string[]>([])
  const inStockOnly = ref(false)
  const selectedTags = ref<string[]>([])

  // 💸 Filtrage par prix
  const priceFiltered = computed(() =>
    products.value.filter((p) => {
      // On prend le prix de vente (promo) s'il existe et est actif, sinon le prix normal
      const effectivePrice = p.is_on_sale && p.sale_price ? p.sale_price : p.price
      return effectivePrice >= priceRange.value.from && effectivePrice <= priceRange.value.to
    }),
  )

  // 🏷️ Tags
  const allTags = computed<string[]>(() => {
    const set = new Set<string>()
    for (const p of products.value) (p.tags || []).forEach((t) => set.add(t))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })

  const tagItemsWithCounts = computed(() =>
    allTags.value.map((tag) => ({
      id: tag,
      label: tag,
      count: priceFiltered.value.reduce(
        (acc, p) => acc + ((p.tags || []).includes(tag) ? 1 : 0),
        0,
      ),
    })),
  )

  // 📦 Catégories
  const categories = computed<string[]>(() =>
    Array.from(new Set(products.value.map((p) => p.category).filter(Boolean))).sort(),
  )

  const categoryItemsWithCounts = computed(() =>
    categories.value.map((cat) => ({
      id: cat,
      label: `${cat} (${priceFiltered.value.filter((p) => p.category === cat).length})`,
    })),
  )

  // 📊 Stock
  const stockCount = computed(() => priceFiltered.value.filter((p) => !!p.stock).length)

  // 🧮 Filtrage combiné
  const filteredProducts = computed<Products[]>(() => {
    return priceFiltered.value.filter((p) => {
      const catOk =
        selectedCategories.value.length === 0 || selectedCategories.value.includes(p.category ?? '')
      const stockOk = !inStockOnly.value || !!p.stock
      const tagOk =
        selectedTags.value.length === 0 ||
        (p.tags || []).some((t) => selectedTags.value.includes(t))
      return catOk && stockOk && tagOk
    })
  })

  // 🔁 Sélection tags
  function toggleTag(id: string) {
    selectedTags.value.includes(id)
      ? (selectedTags.value = selectedTags.value.filter((t) => t !== id))
      : selectedTags.value.push(id)
  }

  return {
    selectedCategories,
    inStockOnly,
    selectedTags,
    allTags,
    tagItemsWithCounts,
    categoryItemsWithCounts,
    stockCount,
    filteredProducts,
    toggleTag,
  }
}
