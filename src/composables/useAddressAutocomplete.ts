/**
 * Composable pour l'autocomplétion d'adresses via l'API Adresse Gouv.fr
 * https://adresse.data.gouv.fr/api-doc/adresse
 */

import { ref, watch } from 'vue'

export interface AddressSuggestion {
  /** Adresse complète formatée */
  label: string
  /** Score de pertinence (0-1) */
  score: number
  /** Numéro de rue */
  housenumber?: string
  /** Nom de la rue */
  street?: string
  /** Nom de la commune */
  city: string
  /** Code postal */
  postcode: string
  /** Code INSEE de la commune */
  citycode: string
  /** Contexte (département, région) */
  context: string
  /** Type de résultat: housenumber, street, locality, municipality */
  type: 'housenumber' | 'street' | 'locality' | 'municipality'
  /** Coordonnées GPS */
  coordinates: {
    lat: number
    lon: number
  }
}

export interface AddressAutocompleteOptions {
  /** Nombre de résultats max (défaut: 5) */
  limit?: number
  /** Type de résultat souhaité */
  type?: 'housenumber' | 'street' | 'locality' | 'municipality'
  /** Code postal pour filtrer */
  postcode?: string
  /** Code INSEE pour filtrer */
  citycode?: string
  /** Délai avant recherche en ms (défaut: 300) */
  debounce?: number
  /** Longueur minimum pour déclencher la recherche (défaut: 3) */
  minLength?: number
}

const API_BASE_URL = 'https://api-adresse.data.gouv.fr'

/**
 * Composable pour l'autocomplétion d'adresses françaises
 */
export function useAddressAutocomplete(options: AddressAutocompleteOptions = {}) {
  const {
    limit = 5,
    type,
    postcode,
    citycode,
    debounce = 300,
    minLength = 3,
  } = options

  const query = ref('')
  const suggestions = ref<AddressSuggestion[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedAddress = ref<AddressSuggestion | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * Recherche d'adresses
   */
  async function search(searchQuery: string): Promise<AddressSuggestion[]> {
    if (!searchQuery || searchQuery.length < minLength) {
      suggestions.value = []
      return []
    }

    isLoading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: limit.toString(),
        autocomplete: '1',
      })

      if (type) params.append('type', type)
      if (postcode) params.append('postcode', postcode)
      if (citycode) params.append('citycode', citycode)

      const response = await fetch(`${API_BASE_URL}/search/?${params}`)

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`)
      }

      const data = await response.json()

      const results: AddressSuggestion[] = data.features.map((feature: any) => ({
        label: feature.properties.label,
        score: feature.properties.score,
        housenumber: feature.properties.housenumber,
        street: feature.properties.street,
        city: feature.properties.city,
        postcode: feature.properties.postcode,
        citycode: feature.properties.citycode,
        context: feature.properties.context,
        type: feature.properties.type,
        coordinates: {
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0],
        },
      }))

      suggestions.value = results
      return results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de recherche'
      suggestions.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Recherche avec debounce
   */
  function debouncedSearch(searchQuery: string) {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    if (!searchQuery || searchQuery.length < minLength) {
      suggestions.value = []
      return
    }

    debounceTimer = setTimeout(() => {
      search(searchQuery)
    }, debounce)
  }

  /**
   * Sélectionner une adresse
   */
  function selectAddress(address: AddressSuggestion) {
    selectedAddress.value = address
    query.value = address.label
    suggestions.value = []
  }

  /**
   * Réinitialiser
   */
  function reset() {
    query.value = ''
    suggestions.value = []
    selectedAddress.value = null
    error.value = null
  }

  /**
   * Fermer les suggestions
   */
  function closeSuggestions() {
    suggestions.value = []
  }

  // Watch query pour debounce automatique
  watch(query, (newQuery) => {
    if (selectedAddress.value?.label !== newQuery) {
      selectedAddress.value = null
      debouncedSearch(newQuery)
    }
  })

  return {
    query,
    suggestions,
    isLoading,
    error,
    selectedAddress,
    search,
    debouncedSearch,
    selectAddress,
    reset,
    closeSuggestions,
  }
}

/**
 * Recherche inverse (coordonnées vers adresse)
 */
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<AddressSuggestion | null> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
    })

    const response = await fetch(`${API_BASE_URL}/reverse/?${params}`)

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const data = await response.json()

    if (!data.features || data.features.length === 0) {
      return null
    }

    const feature = data.features[0]
    return {
      label: feature.properties.label,
      score: feature.properties.score,
      housenumber: feature.properties.housenumber,
      street: feature.properties.street,
      city: feature.properties.city,
      postcode: feature.properties.postcode,
      citycode: feature.properties.citycode,
      context: feature.properties.context,
      type: feature.properties.type,
      coordinates: {
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
      },
    }
  } catch {
    return null
  }
}

/**
 * Recherche de communes uniquement
 */
export function useCityAutocomplete(options: Omit<AddressAutocompleteOptions, 'type'> = {}) {
  return useAddressAutocomplete({
    ...options,
    type: 'municipality',
  })
}
