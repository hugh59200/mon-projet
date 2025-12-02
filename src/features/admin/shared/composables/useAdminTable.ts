import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { Database, Tables } from '@/supabase/types/supabase'
import { onMounted, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/** 🕐 Utilitaire de debounce pour les recherches */
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 400) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// ✅ inclut les Tables ET Views
type TableName = keyof (Database['public']['Tables'] & Database['public']['Views']) & string
type Row<T extends TableName> = Tables<T> extends infer R ? R : never
type SearchFunction<T> = (row: T, query: string) => boolean

interface UseAdminTableOptions<T extends TableName, R = Row<T>> {
  table: T
  orderBy?: keyof R & string
  ascending?: boolean
  filters?: Record<string, any>
  searchFn?: SearchFunction<R>
  limit?: number
  select?: string // permet d'ajouter un SELECT personnalisé
  persistInUrl?: boolean // persister search, page, sort dans l'URL
}

/** ⚙️ Helper typé : gère les surcharges .from() Tables / Views */
function fromRelation<T extends TableName>(table: T) {
  if (
    [
      'conversation_overview',
      'messages_by_conversation_view',
      'messages_unread_view',
      'orders_detailed_view',
      'orders_full_view',
      'orders_overview_for_admin',
      'user_cart_view',
      'user_overview',
    ].includes(table)
  ) {
    return supabase.from(table as keyof Database['public']['Views'])
  } else {
    return supabase.from(table as keyof Database['public']['Tables'])
  }
}

/** ⚙️ Hook générique admin */
export function useAdminTable<T extends TableName, R = Row<T>>(
  options: UseAdminTableOptions<T, R>,
) {
  const {
    table,
    orderBy = 'created_at',
    ascending = false,
    filters = {},
    searchFn,
    limit = 20,
    select = '*',
    persistInUrl = false,
  } = options

  // Router pour la persistance URL
  const route = persistInUrl ? useRoute() : null
  const router = persistInUrl ? useRouter() : null

  // Fonction pour lire les valeurs depuis l'URL
  const getInitialValue = <V>(key: string, defaultValue: V): V => {
    if (!route) return defaultValue
    const urlValue = route.query[key]
    if (urlValue === undefined || urlValue === null) return defaultValue
    if (typeof defaultValue === 'number') return parseInt(urlValue as string, 10) as V
    if (typeof defaultValue === 'boolean') return (urlValue === 'true') as V
    return urlValue as V
  }

  const data = ref([]) as Ref<R[]>
  const filteredData = ref([]) as Ref<R[]>
  const total = ref(0)
  const nbPages = ref(1)
  const page = ref(getInitialValue('page', 1))
  const search = ref(getInitialValue('search', ''))
  const sortKey = ref(getInitialValue('sort', orderBy))
  const sortAsc = ref(getInitialValue('asc', ascending))
  const activeFilters = ref(filters)
  const loading = ref(false)
  const hasLoaded = ref(false)

  // Fonction pour mettre à jour l'URL
  const updateUrl = () => {
    if (!router || !route) return
    const query: Record<string, string> = { ...route.query as Record<string, string> }

    // Search
    if (search.value) {
      query.search = search.value
    } else {
      delete query.search
    }

    // Page (ne pas mettre page=1)
    if (page.value > 1) {
      query.page = String(page.value)
    } else {
      delete query.page
    }

    // Sort (ne pas mettre si c'est la valeur par défaut)
    if (sortKey.value !== orderBy) {
      query.sort = sortKey.value
    } else {
      delete query.sort
    }

    // Ascending (ne pas mettre si c'est la valeur par défaut)
    if (sortAsc.value !== ascending) {
      query.asc = String(sortAsc.value)
    } else {
      delete query.asc
    }

    router.replace({ query })
  }

  async function fetchData() {
    loading.value = true
    try {
      const from = (page.value - 1) * limit
      const to = page.value * limit - 1

      let query = fromRelation(table)
        .select(select, { count: 'exact' }) // 🆕 ← custom SELECT ici
        .order(sortKey.value, { ascending: sortAsc.value })
        .range(from, to)

      for (const [key, value] of Object.entries(activeFilters.value)) {
        if (value && value !== 'all') query = query.eq(key, value)
      }

      const { data: rows, count, error } = await query
      if (error) throw error

      const validRows = Array.isArray(rows) ? (rows as R[]) : []
      data.value = validRows
      total.value = count ?? validRows.length
      nbPages.value = Math.ceil(total.value / limit) || 1

      if (searchFn && search.value) {
        const q = search.value.toLowerCase().trim()
        filteredData.value = validRows.filter((row) =>
          (searchFn as (r: R, q: string) => boolean)(row, q),
        )
      } else {
        filteredData.value = validRows
      }
    } catch (err) {
      console.error('Erreur fetchData:', err)
      filteredData.value = []
    } finally {
      hasLoaded.value = true
      loading.value = false
    }
  }

  const debouncedFetch = debounce(fetchData, 400)
  const debouncedUpdateUrl = debounce(updateUrl, 300)

  watch(search, () => {
    debouncedFetch()
    if (persistInUrl) debouncedUpdateUrl()
  })

  watch([sortKey, sortAsc, activeFilters, page], () => {
    fetchData()
    if (persistInUrl) updateUrl()
  })

  function reset() {
    search.value = ''
    sortKey.value = orderBy
    sortAsc.value = ascending
    activeFilters.value = filters
    page.value = 1
    fetchData()
  }

  onMounted(fetchData)

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
    // Helpers URL pour les filtres additionnels
    updateUrl,
    getInitialValue,
    route,
    router,
  }
}
