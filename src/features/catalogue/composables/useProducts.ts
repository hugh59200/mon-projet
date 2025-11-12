import { supabase } from '@/supabase/supabaseClient'
import type { Products } from '@/supabase/types/supabase.types'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { computed, ref } from 'vue'

export interface PriceRange {
  min: number
  max: number
  from: number
  to: number
  step: number
}

export function useProducts() {
  const toast = useToastStore()

  const products = ref<Products[]>([])
  const loading = ref(false)
  const hasLoaded = ref(false)

  const priceRange = ref<PriceRange>({
    min: 0,
    max: 100,
    from: 0,
    to: 100,
    step: 0.1,
  })

  async function loadProducts() {
    loading.value = true

    try {
      const { data, error } = await supabase.from('products').select('*')
      if (error) throw error

      const rows: Products[] = (data || []).map((r) => ({
        ...r,
        price: typeof r.price === 'string' ? parseFloat(r.price) : (r.price as number),
        purity:
          r.purity === null
            ? null
            : typeof r.purity === 'string'
              ? parseFloat(r.purity)
              : (r.purity as number),
        tags: Array.isArray(r.tags) ? r.tags : [],
      }))

      products.value = rows

      const prices = rows.map((p) => p.price).filter((n) => typeof n === 'number' && !isNaN(n))
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      const rawMin = isFinite(min) ? Math.floor(min) : 0
      const rawMax = isFinite(max) ? Math.ceil(max) : 0

      if (rawMax <= rawMin) {
        priceRange.value.min = rawMin
        priceRange.value.max = rawMin + (priceRange.value.step || 0.1)
      } else {
        priceRange.value.min = rawMin
        priceRange.value.max = rawMax
      }

      priceRange.value.from = priceRange.value.min
      priceRange.value.to = priceRange.value.max
    } catch (err: any) {
      console.error(err)
      toast.show('Erreur lors du chargement du catalogue', 'danger')
    } finally {
      loading.value = false
      hasLoaded.value = true
    }
  }

  const nbProducts = computed(() => products.value.length)

  const averagePrice = computed(() =>
    products.value.length
      ? products.value.reduce((acc, p) => acc + (p.price ?? 0), 0) / products.value.length
      : 0,
  )

  return {
    products,
    priceRange,
    loadProducts,
    loading,
    hasLoaded,
    nbProducts,
    averagePrice,
  }
}
