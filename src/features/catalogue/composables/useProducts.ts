import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { Products } from '@/supabase/types/supabase.types'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useProductsStore = defineStore(
  'products',
  () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products: Ref<Products[]> = ref([] as any)
    const hasLoaded = ref(false)
    const loading = ref(false)

    const priceRange = ref({
      min: 0,
      max: 100,
      from: 0,
      to: 100,
      step: 1, // Changé à 1 pour des sliders plus propres, remets 0.1 si tu préfères
    })

    async function load() {
      // Si déjà chargé et non vide, on ne recharge pas (cache simple)
      if (hasLoaded.value && products.value.length > 0) return

      loading.value = true

      // ✅ MISE À JOUR DE LA REQUÊTE : Ajout de is_on_sale, sale_price, dosage, description
      const { data, error } = await supabase
        .from('products')
        .select(
          'id, name, slug, price, sale_price, is_on_sale, purity, tags, category, stock, image, dosage, description',
        )

      if (!error && data) {
        const rows = data.map((r: any) => ({
          ...r,
          // Sécurisation des types numériques (au cas où Supabase renverrait des strings)
          price: typeof r.price === 'string' ? parseFloat(r.price) : r.price,

          // ✅ Gestion du sale_price
          sale_price:
            r.sale_price == null
              ? null
              : typeof r.sale_price === 'string'
                ? parseFloat(r.sale_price)
                : r.sale_price,

          tags: Array.isArray(r.tags) ? r.tags : [],
        }))

        products.value = rows

        // Calcul dynamique du Range de prix (basé sur le prix standard pour l'instant)
        const prices = rows.map((p) => p.price).filter((n) => n != null)

        if (prices.length > 0) {
          const min = Math.floor(Math.min(...prices))
          const max = Math.ceil(Math.max(...prices))

          priceRange.value.min = min
          priceRange.value.max = max
          priceRange.value.from = min
          priceRange.value.to = max
        }
      }

      hasLoaded.value = true
      loading.value = false
    }

    // Optionnel : Une action pour forcer le rechargement (utile après une admin update)
    function reload() {
      hasLoaded.value = false
      return load()
    }

    return {
      products,
      priceRange,
      hasLoaded,
      loading,
      load,
      reload,
    }
  },
  {
    persist: {
      key: 'products-cache',
      storage: localStorage,
      // On persiste tout pour éviter le flickering au chargement
      pick: ['products', 'priceRange', 'hasLoaded'],
    },
  },
)
