import type { Products } from '@/supabase/types/supabase.types'
import type { DropdownItem } from '@designSystem/components/basic/dropdown/BasicDropdown.types'
import { computed, ref, watch, type Ref } from 'vue'

/**
 * Gère la recherche, le tri et la pagination
 */
export function usePagination(baseProducts: Ref<Products[]>) {
  const searchTerm = ref('')
  const sortBy = ref<'default' | 'price-asc' | 'price-desc' | 'new'>('default')
  const page = ref(1)
  const pageSize = ref<number>(24)

  const sortItems: DropdownItem[] = [
    { id: 'default', label: 'Tri : Par défaut' },
    { id: 'price-asc', label: 'Prix croissant' },
    { id: 'price-desc', label: 'Prix décroissant' },
    { id: 'new', label: 'Nouveautés' },
  ]

  const pageSizeItems: DropdownItem[] = [
    { id: 12, label: '12 / page' },
    { id: 24, label: '24 / page' },
    { id: 48, label: '48 / page' },
  ]

  // 🔍 Recherche
  const searchFiltered = computed<Products[]>(() => {
    const q = searchTerm.value.trim().toLowerCase()
    if (!q) return baseProducts.value
    return baseProducts.value.filter((p) => {
      const hay = [
        p.name ?? '',
        p.category ?? '',
        p.description ?? '',
        (p.tags || []).join(' '),
      ].join(' ')
      return hay.toLowerCase().includes(q)
    })
  })

  // ↕️ Tri
  const sortedProducts = computed<Products[]>(() => {
    const arr = [...searchFiltered.value]
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

  // 📄 Pagination
  const nbPages = computed(() =>
    Math.max(1, Math.ceil(sortedProducts.value.length / pageSize.value)),
  )

  const paginatedProducts = computed<Products[]>(() => {
    page.value = Math.min(page.value, nbPages.value)
    const start = (page.value - 1) * pageSize.value
    return sortedProducts.value.slice(start, start + pageSize.value)
  })

  // 🧹 Reset page quand un filtre change
  watch([searchTerm, sortBy, pageSize], () => (page.value = 1))

  return {
    searchTerm,
    sortBy,
    sortItems,
    page,
    pageSize,
    pageSizeItems,
    nbPages,
    paginatedProducts,
    filteredProducts: sortedProducts,
  }
}
