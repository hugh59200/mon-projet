import { computed, ref, type Ref } from 'vue'

/**
 * Liste des sections de filtres disponibles.
 * 👉 Ajoute ici de nouvelles sections si nécessaire.
 */
export type FilterSectionKey = 'price' | 'category' | 'stock' | 'tags'

export type FilterOpenState = Record<FilterSectionKey, boolean>

/**
 * Gère l’ouverture/fermeture des encadrés de filtres dans le catalogue
 */
export function useFilterSections() {
  // Etat réactif : quelles sections sont ouvertes
  const filterOpen: Ref<FilterOpenState> = ref({
    price: true,
    category: true,
    stock: true,
    tags: true,
  })

  // Renvoie true si toutes les sections sont ouvertes
  const allOpen = computed(() => Object.values(filterOpen.value).every(Boolean))

  /**
   * Bascule toutes les sections (tout ouvrir / tout réduire)
   */
  function toggleAll() {
    const newState = !allOpen.value
    for (const key in filterOpen.value) {
      filterOpen.value[key as FilterSectionKey] = newState
    }
  }

  /**
   * Permet d’ouvrir/fermer une seule section
   */
  function toggleOne(section: FilterSectionKey) {
    filterOpen.value[section] = !filterOpen.value[section]
  }

  return {
    filterOpen,
    allOpen,
    toggleAll,
    toggleOne,
  }
}
