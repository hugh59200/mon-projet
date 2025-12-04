// useRelayPoint.ts - Composable pour la sélection de points relais
import { computed, ref } from 'vue'

export interface RelayPoint {
  id: string
  name: string
  address: string
  address2?: string
  zipCode: string
  city: string
  country: string
  latitude: number
  longitude: number
  distance?: number
  openingHours?: Record<string, string>
}

export interface OrderRelayData {
  relay_id: string
  relay_name: string
  relay_address: string
  relay_zipcode: string
  relay_city: string
  relay_country: string
}

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
   * Recherche des points relais par code postal
   * En dev: retourne des données mock
   * En prod: appeler ton Edge Function qui interroge l'API MR
   */
  async function searchByPostcode(postcode: string): Promise<RelayPoint[]> {
    isLoading.value = true
    error.value = null

    try {
      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 800))

      // En dev, retourner les mocks filtrés
      if (import.meta.env.DEV) {
        console.log('[useRelayPoint] Mode DEV - Utilisation des données mock pour:', postcode)

        // Simuler une recherche basée sur le code postal
        const results = MOCK_RELAY_POINTS.map((point) => ({
          ...point,
          // Adapter le code postal pour la démo
          zipCode: postcode.substring(0, 2) + point.zipCode.substring(2),
        }))

        searchResults.value = results
        return results
      }

      // En PRODUCTION : appeler ton Edge Function Supabase
      // const { data, error: fetchError } = await supabase.functions.invoke('search-relay-points', {
      //   body: { postcode, country: 'FR' }
      // })
      // if (fetchError) throw fetchError
      // searchResults.value = data.points
      // return data.points

      return []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de recherche'
      console.error('[useRelayPoint] Erreur:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sélectionne un point relais
   */
  function selectPoint(point: RelayPoint) {
    selectedPoint.value = point
  }

  /**
   * Efface la sélection
   */
  function clearSelection() {
    selectedPoint.value = null
    searchResults.value = []
  }

  /**
   * Données formatées pour la commande (BDD)
   */
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
    // État (readonly)
    selectedPoint: computed(() => selectedPoint.value),
    searchResults: computed(() => searchResults.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    hasSelection,
    orderRelayData,

    // Méthodes
    searchByPostcode,
    selectPoint,
    clearSelection,
  }
}
