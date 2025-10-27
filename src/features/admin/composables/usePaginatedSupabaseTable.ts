import { supabase } from '@/services/supabaseClient'
import type { Database } from '@/types/supabase'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { computed, onMounted, ref, watch } from 'vue'

interface UsePaginatedSupabaseTableOptions<T> {
  table: keyof Database['public']['Tables'] | string
  perPage?: number
  orderBy?: keyof T | string
  ascending?: boolean
  filters?: Record<string, any>
  searchFn?: (item: T, query: string) => boolean
  transformFn?: (data: T[]) => T[]
}

export function usePaginatedSupabaseTable<T extends Record<string, any>>(
  options: UsePaginatedSupabaseTableOptions<T>,
) {
  const {
    table,
    perPage = 8,
    orderBy = 'created_at',
    ascending = false,
    filters = {},
    searchFn,
    transformFn,
  } = options

  const data = ref<T[]>([])
  const total = ref(0)
  const loading = ref(false)
  const hasLoaded = ref(false)
  const page = ref(1)
  const search = ref('')
  const sortKey = ref(orderBy as string)
  const sortAsc = ref(ascending)

  const nbPages = computed(() => Math.ceil(total.value / perPage))

  async function fetchData() {
    loading.value = true
    const from = (page.value - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from(table as any)
      .select('*', { count: 'exact' })
      .range(from, to)

    if (sortKey.value) query = query.order(sortKey.value, { ascending: sortAsc.value })

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== 'all') query = query.eq(key, value)
    })

    const { data: rows, count, error } = (await query) as PostgrestSingleResponse<T[]>

    loading.value = false
    hasLoaded.value = true // ✅ ici

    if (error) {
      console.error(`Erreur chargement table "${String(table)}":`, error)
      return
    }

    let finalData = rows ?? []
    if (transformFn) finalData = transformFn(finalData)

    data.value = finalData
    total.value = count ?? 0
  }

  const filteredData = computed(() => {
    let list = [...(data.value as T[])]
    if (searchFn && search.value.trim()) {
      const q = search.value.trim().toLowerCase()
      list = list.filter((item: T) => searchFn(item, q))
    }
    return list
  })

  function reset() {
    search.value = ''
    page.value = 1
    sortKey.value = orderBy as string
    sortAsc.value = ascending
  }

  watch([page, sortKey, sortAsc], fetchData)
  onMounted(fetchData)

  return {
    data,
    filteredData,
    total,
    nbPages,
    loading,
    hasLoaded, // ✅
    page,
    search,
    sortKey,
    sortAsc,
    fetchData,
    reset,
  }
}
