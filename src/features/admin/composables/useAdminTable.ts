import { supabase } from '@/services/supabaseClient'
import type { Database, Tables } from '@/types/supabase'
import { onMounted, ref, watchEffect } from 'vue'

type TableName = Extract<keyof Database['public']['Tables'], string>

type RowType<T extends TableName> = Tables<T>

interface AdminTableOptions<T extends TableName> {
  table: T
  orderBy?: keyof RowType<T> & string
  ascending?: boolean
  filters?: Record<string, any>
  searchFn?: (row: RowType<T>, query: string) => boolean
  perPage?: number
  autoFetch?: boolean
}

export function useAdminTable<T extends TableName>(options: AdminTableOptions<T>) {
  const {
    table,
    orderBy = 'created_at',
    ascending = false,
    filters = {},
    searchFn,
    perPage = 10,
    autoFetch = true,
  } = options

  const data = ref<RowType<T>[]>([])
  const filteredData = ref<RowType<T>[]>([])
  const total = ref(0)
  const nbPages = ref(1)
  const page = ref(1)
  const search = ref('')
  const sortKey = ref(orderBy as keyof RowType<T> & string)
  const sortAsc = ref(ascending)
  const activeFilters = ref<Record<string, any>>({ ...filters })
  const loading = ref(false)
  const hasLoaded = ref(false)

  async function fetchData() {
    loading.value = true
    const from = (page.value - 1) * perPage
    const to = from + perPage - 1

    const {
      data: rows,
      count,
      error,
    } = await supabase.from(table).select('*', { count: 'exact' }).range(from, to)

    loading.value = false

    if (error) {
      console.error(`[useAdminTable] ${table}:`, error)
      return
    }

    data.value = (rows ?? []) as RowType<T>[]
    total.value = count ?? 0
    nbPages.value = Math.ceil((count ?? 0) / perPage)
    hasLoaded.value = true
    applyFilters()
  }

  function applyFilters() {
    let result = [...data.value]
    for (const [key, val] of Object.entries(activeFilters.value)) {
      if (val && val !== 'all') result = result.filter((r: any) => r[key] === val)
    }
    if (search.value && searchFn)
      result = result.filter((r) => searchFn(r as RowType<T>, search.value.toLowerCase()))

    result.sort((a: any, b: any) => {
      const av = a[sortKey.value]
      const bv = b[sortKey.value]
      if (av == null || bv == null) return 0
      if (typeof av === 'string') return sortAsc.value ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortAsc.value ? av - bv : bv - av
    })

    filteredData.value = result
  }

  watchEffect(applyFilters)

  function reset() {
    search.value = ''
    activeFilters.value = { ...filters }
    sortKey.value = orderBy as string
    sortAsc.value = ascending
    fetchData()
  }

  if (autoFetch) onMounted(fetchData)

  return {
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
