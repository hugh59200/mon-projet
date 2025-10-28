import { supabase } from '@/supabase/supabaseClient'
import type { Database, Tables } from '@/supabase/types/supabase'
import { ref, watch, watchEffect } from 'vue'

/** Simple utilitaire pour "debouncer" une fonction */
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 400) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

type TableName = keyof Database['public']['Tables'] & string

interface UseAdminTableOptions<T extends TableName> {
  table: T
  orderBy?: keyof Tables<T> & string
  ascending?: boolean
  filters?: Record<string, any>
  searchFn?: (row: Tables<T>, query: string) => boolean
}

export function useAdminTable<T extends TableName>(options: UseAdminTableOptions<T>) {
  const { table, orderBy = 'created_at', ascending = false, filters = {}, searchFn } = options

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
      const query = supabase
        .from(table)
        .select('*', { count: 'exact' })
        .order(sortKey.value, { ascending: sortAsc.value })

      // Appliquer les filtres si présents
      Object.entries(activeFilters.value).forEach(([key, value]) => {
        if (value && value !== 'all') query.eq(key, value)
      })

      // 🧩 TS ne sait pas que le résultat est bien typé — on le force légèrement
      const { data: rows, count, error } = await query

      if (error) throw error

      // ✅ Fix typage : cast explicite avec vérif runtime
      const validRows = Array.isArray(rows) ? (rows as Tables<T>[]) : []

      data.value = validRows
      total.value = count ?? validRows.length
      nbPages.value = Math.ceil(total.value / 20) || 1
      hasLoaded.value = true

      // Application du filtre de recherche local
      if (searchFn && search.value) {
        const q = search.value.toLowerCase().trim()
        filteredData.value = validRows.filter((row) => searchFn(row, q))
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

  // --- Rechargement auto sur tri / filtre
  watchEffect(() => {
    fetchData()
  })

  // --- Reset complet
  function reset() {
    search.value = ''
    sortKey.value = orderBy
    sortAsc.value = ascending
    activeFilters.value = filters
    fetchData()
  }

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
