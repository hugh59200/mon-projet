import { supabase } from '@/supabase/supabaseClient'
import type { Database, Tables } from '@/supabase/types/supabase'
import { onMounted, ref, watch } from 'vue'

/** 🕐 Utilitaire de debounce pour les recherches */
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 400) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

type TableName = keyof Database['public']['Tables'] & string
type SearchFunction<T> = (row: T, query: string) => boolean

interface UseAdminTableOptions<T extends TableName> {
  table: T
  orderBy?: keyof Tables<T> & string
  ascending?: boolean
  filters?: Record<string, any>
  searchFn?: SearchFunction<Tables<T>>
  limit?: number // 🧩 ajout pagination dynamique
}

export function useAdminTable<T extends TableName>(options: UseAdminTableOptions<T>) {
  const {
    table,
    orderBy = 'created_at',
    ascending = false,
    filters = {},
    searchFn,
    limit = 20,
  } = options

  // --- State
  const data = ref<Tables<T>[]>([])
  const filteredData = ref<Tables<T>[]>([])
  const total = ref(0)
  const nbPages = ref(1)
  const page = ref(1)
  const search = ref('')
  const sortKey = ref(orderBy)
  const sortAsc = ref(ascending)
  const activeFilters = ref(filters)
  const loading = ref(false)
  const hasLoaded = ref(false)

  // --- Main fetch
  async function fetchData() {
    loading.value = true
    try {
      const from = (page.value - 1) * limit
      const to = page.value * limit - 1

      let query = supabase
        .from(table)
        .select('*', { count: 'exact' })
        .order(sortKey.value, { ascending: sortAsc.value })
        .range(from, to)

      // Appliquer les filtres actifs
      for (const [key, value] of Object.entries(activeFilters.value)) {
        if (value && value !== 'all') query = query.eq(key, value)
      }

      const { data: rows, count, error } = await query
      if (error) throw error

      const validRows = Array.isArray(rows) ? (rows as Tables<T>[]) : []
      data.value = validRows
      total.value = count ?? validRows.length
      nbPages.value = Math.ceil(total.value / limit) || 1
      hasLoaded.value = true

      // Filtrage local (search)
      if (searchFn && search.value) {
        const q = search.value.toLowerCase().trim()
        const safeSearch = searchFn as (r: any, q: string) => boolean
        filteredData.value = validRows.filter((row) => safeSearch(row, q))
      } else {
        filteredData.value = validRows
      }
    } catch (err) {
      console.error('Erreur fetchData:', err)
    } finally {
      loading.value = false
    }
  }

  // --- Debounce sur la recherche
  const debouncedFetch = debounce(fetchData, 400)
  watch(search, () => debouncedFetch())

  // --- Rafraîchissement sur tri / filtres / pagination
  watch([sortKey, sortAsc, activeFilters, page], () => {
    fetchData()
  })

  // --- Reset complet
  function reset() {
    search.value = ''
    sortKey.value = orderBy
    sortAsc.value = ascending
    activeFilters.value = filters
    page.value = 1
    fetchData()
  }

  // --- Fetch initial
  onMounted(() => {
    fetchData()
  })

  return {
    data,
    filteredData,
    total,
    nbPages,
    page,
    search,
    sortKey,
    sortAsc,
    activeFilters,
    loading,
    hasLoaded,
    fetchData,
    reset,
  }
}
