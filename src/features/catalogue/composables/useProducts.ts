import { supabase } from '@/supabase/supabaseClient'
import type { Products } from '@/supabase/types/supabase.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductsStore = defineStore(
  'products',
  () => {
    const products = ref<Products[]>([])
    const hasLoaded = ref(false)
    const loading = ref(false)

    const priceRange = ref({
      min: 0,
      max: 100,
      from: 0,
      to: 100,
      step: 0.1,
    })

    async function load() {
      if (hasLoaded.value && products.value.length > 0) return

      loading.value = true

      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, purity, tags, category, stock, image')

      if (!error && data) {
        const rows = data.map((r: any) => ({
          ...r,
          price: typeof r.price === 'string' ? parseFloat(r.price) : r.price,
          purity:
            r.purity == null
              ? null
              : typeof r.purity === 'string'
                ? parseFloat(r.purity)
                : r.purity,
          tags: Array.isArray(r.tags) ? r.tags : [],
        }))

        products.value = rows

        const prices = rows.map((p) => p.price).filter((n) => n != null)
        const min = Math.floor(Math.min(...prices))
        const max = Math.ceil(Math.max(...prices))

        priceRange.value.min = min
        priceRange.value.max = max
        priceRange.value.from = min
        priceRange.value.to = max
      }

      hasLoaded.value = true
      loading.value = false
    }

    return {
      products,
      priceRange,
      hasLoaded,
      loading,
      load,
    }
  },
  {
    persist: {
      key: 'products-cache',
      storage: localStorage,
      pick: ['products', 'priceRange', 'hasLoaded'],
    },
  },
)
