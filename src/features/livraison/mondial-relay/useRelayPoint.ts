// composables/useRelayPoint.ts
import { computed, ref } from 'vue'
import { supabase } from '@/supabase/supabaseClient'
import type { OrderRelayData, RelayPoint } from './relay'

// Points relais mock pour le développement
const MOCK_RELAY_POINTS: RelayPoint[] = [
  {
    id: 'FR-001234',
    name: 'Tabac Presse Le Central',
    address: '12 Avenue de la République',
    zipCode: '75011',
    city: 'Paris',
    country: 'FR',
    latitude: 48.8566,
    longitude: 2.3522,
    distance: 250,
  },
  {
    id: 'FR-001235',
    name: 'Carrefour City Bastille',
    address: '45 Rue de la Roquette',
    zipCode: '75011',
    city: 'Paris',
    country: 'FR',
    latitude: 48.8534,
    longitude: 2.3688,
    distance: 480,
  },
  {
    id: 'FR-001236',
    name: 'Relay Gare de Lyon',
    address: 'Place Louis-Armand',
    zipCode: '75012',
    city: 'Paris',
    country: 'FR',
    latitude: 48.8443,
    longitude: 2.3737,
    distance: 890,
  },
  {
    id: 'FR-001237',
    name: 'Pharmacie du Commerce',
    address: '78 Boulevard Voltaire',
    zipCode: '75011',
    city: 'Paris',
    country: 'FR',
    latitude: 48.8589,
    longitude: 2.3773,
    distance: 650,
  },
  {
    id: 'FR-001238',
    name: 'Pressing Saint-Antoine',
    address: '156 Rue du Faubourg Saint-Antoine',
    zipCode: '75012',
    city: 'Paris',
    country: 'FR',
    latitude: 48.8498,
    longitude: 2.3856,
    distance: 1100,
  },
]

export function useRelayPoint() {
  const selectedPoint = ref<RelayPoint | null>(null)
  const searchResults = ref<RelayPoint[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Recherche des points relais
   * DEV: données mock
   * PROD: Edge Function Supabase
   */
  async function searchByPostcode(postcode: string, country = 'FR'): Promise<RelayPoint[]> {
    isLoading.value = true
    error.value = null

    try {
      // ============ MODE DEV : Mock data ============
      if (import.meta.env.DEV) {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 600))

        // Adapter les codes postaux au code recherché
        const results = MOCK_RELAY_POINTS.map((point) => ({
          ...point,
          zipCode: postcode.substring(0, 2) + point.zipCode.substring(2),
        }))

        searchResults.value = results
        return results
      }

      // ============ MODE PROD : Edge Function ============
      const { data, error: fnError } = await supabase.functions.invoke('search-relay-points', {
        body: { postcode, country, nbResults: 10 },
      })

      if (fnError) {
        throw new Error(fnError.message)
      }

      if (!data.success) {
        throw new Error(data.error || 'Erreur inconnue')
      }

      const points = data.data.points as RelayPoint[]
      searchResults.value = points

      return points
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de recherche'
      error.value = message
      return []
    } finally {
      isLoading.value = false
    }
  }

  function selectPoint(point: RelayPoint) {
    selectedPoint.value = point
  }

  function clearSelection() {
    selectedPoint.value = null
    searchResults.value = []
  }

  const orderRelayData = computed<OrderRelayData | null>(() => {
    if (!selectedPoint.value) return null
    return {
      relay_id: selectedPoint.value.id,
      relay_name: selectedPoint.value.name,
      relay_address: selectedPoint.value.address,
      relay_zipcode: selectedPoint.value.zipCode,
      relay_city: selectedPoint.value.city,
      relay_country: selectedPoint.value.country,
    }
  })

  const hasSelection = computed(() => selectedPoint.value !== null)

  return {
    selectedPoint: computed(() => selectedPoint.value),
    searchResults: computed(() => searchResults.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    hasSelection,
    orderRelayData,
    searchByPostcode,
    selectPoint,
    clearSelection,
  }
}
