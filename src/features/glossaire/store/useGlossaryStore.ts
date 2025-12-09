import { fetchGlossaryTerms, type GlossaryTermListItem } from '@/api/supabase/glossary'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGlossaryStore = defineStore(
  'glossary',
  () => {
    const terms = ref<GlossaryTermListItem[]>([])
    const lastFetch = ref(0)
    const loading = ref(false)
    const searchQuery = ref('')
    const TTL = 1000 * 60 * 10 // 10 minutes cache

    /**
     * Termes filtrés par la recherche
     */
    const filteredTerms = computed(() => {
      if (!searchQuery.value.trim()) return terms.value

      const query = searchQuery.value.toLowerCase().trim()
      return terms.value.filter(
        (t) =>
          t.term.toLowerCase().includes(query) ||
          t.meta_description?.toLowerCase().includes(query),
      )
    })

    /**
     * Termes groupés par première lettre (A-Z)
     */
    const groupedTerms = computed(() => {
      const groups: Record<string, GlossaryTermListItem[]> = {}

      filteredTerms.value.forEach((term) => {
        const firstLetter = (term.term?.[0] ?? '#').toUpperCase()
        if (!groups[firstLetter]) {
          groups[firstLetter] = []
        }
        groups[firstLetter].push(term)
      })

      return groups
    })

    /**
     * Alphabet des lettres disponibles (triées)
     */
    const alphabet = computed(() => Object.keys(groupedTerms.value).sort())

    /**
     * Nombre total de termes
     */
    const totalCount = computed(() => terms.value.length)

    /**
     * Nombre de termes filtrés
     */
    const filteredCount = computed(() => filteredTerms.value.length)

    /**
     * Charge tous les termes publiés
     */
    async function loadTerms(force = false) {
      if (!force && terms.value.length > 0 && Date.now() - lastFetch.value < TTL) {
        return
      }

      loading.value = true
      try {
        terms.value = await fetchGlossaryTerms()
        lastFetch.value = Date.now()
      } finally {
        loading.value = false
      }
    }

    /**
     * Définit la recherche
     */
    function setSearch(query: string) {
      searchQuery.value = query
    }

    /**
     * Réinitialise la recherche
     */
    function clearSearch() {
      searchQuery.value = ''
    }

    return {
      terms,
      loading,
      searchQuery,
      filteredTerms,
      groupedTerms,
      alphabet,
      totalCount,
      filteredCount,
      loadTerms,
      setSearch,
      clearSearch,
    }
  },
  {
    persist: {
      key: 'glossary-cache-v1',
      storage: localStorage,
      pick: ['terms', 'lastFetch'],
    },
  },
)
