import { supabase } from '@/supabase/supabaseClient'
import type { Products } from '@/supabase/types/supabase.types'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { computed, ref } from 'vue'

/**
 * Type pour la plage de prix (slider)
 */
export interface PriceRange {
  min: number
  max: number
  from: number
  to: number
  step: number
}

/**
 * 🧠 Composable pour charger et gérer les produits du catalogue
 * - Gère le fetch depuis Supabase
 * - Calcule automatiquement la plage de prix
 * - Expose un state réactif : produits, loading, hasLoaded, priceRange
 */
export function useProducts() {
  const toast = useToastStore()

  // 🌐 Données
  const products = ref<Products[]>([])
  const loading = ref(false)
  const hasLoaded = ref(false)

  // 💰 Plage de prix pour les filtres
  const priceRange = ref<PriceRange>({
    min: 0,
    max: 100,
    from: 0,
    to: 100,
    step: 0.1,
  })

  /**
   * 🔄 Charge les produits depuis Supabase
   */
  async function loadProducts() {
    loading.value = true

    try {
      const { data, error } = await supabase.from('products').select('*')
      if (error) throw error

      // 🔧 Normalisation typée et sécurisée
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

      // 🧮 Calcule les bornes de prix
      const prices = rows.map((p) => p.price).filter((n) => typeof n === 'number' && !isNaN(n))
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      const rawMin = isFinite(min) ? Math.floor(min) : 0
      const rawMax = isFinite(max) ? Math.ceil(max) : 0

      if (rawMax <= rawMin) {
        // Sécurité pour éviter un range vide
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

  // 🧾 Infos dérivées (optionnelles)
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
