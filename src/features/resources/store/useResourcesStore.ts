import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchResources,
  fetchResourceCategories,
  type ResourceWithCategory,
} from '@/api/supabase/resources'
import type { ResourceCategories } from '@/supabase/types/supabase.types'

export const useResourcesStore = defineStore('resources', () => {
  // State
  const resources = ref<ResourceWithCategory[]>([])
  const categories = ref<ResourceCategories[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function loadCategories() {
    try {
      categories.value = await fetchResourceCategories()
    } catch (e) {
      console.error('Erreur chargement catégories:', e)
      error.value = 'Impossible de charger les catégories'
    }
  }

  async function loadResources(categorySlug?: string, forceRefresh = false) {
    // Ne pas recharger si déjà en cache et pas de forceRefresh
    if (resources.value.length > 0 && !categorySlug && !forceRefresh) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      resources.value = await fetchResources(categorySlug)
    } catch (e) {
      console.error('Erreur chargement ressources:', e)
      error.value = 'Impossible de charger les ressources'
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    resources.value = []
    categories.value = []
    error.value = null
  }

  return {
    // State
    resources,
    categories,
    isLoading,
    error,
    // Actions
    loadCategories,
    loadResources,
    reset,
  }
})
