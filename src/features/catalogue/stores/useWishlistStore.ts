import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { useI18n } from 'vue-i18n'

const STORAGE_KEY = 'fp-wishlist'

/**
 * Store Pinia pour la gestion des favoris (Wishlist)
 * 100% Client-Side - Persistance via localStorage uniquement
 */
export const useWishlistStore = defineStore('wishlist', () => {
  const toastStore = useToastStore()
  const { t } = useI18n()

  // State
  const items = ref<string[]>(loadFromStorage())

  // Getters
  const count = computed(() => items.value.length)

  function isInWishlist(productId: string): boolean {
    return items.value.includes(productId)
  }

  // Actions
  function toggle(productId: string): void {
    const index = items.value.indexOf(productId)

    if (index === -1) {
      // Ajouter aux favoris
      items.value.push(productId)
      toastStore.show(t('wishlist.added'), 'success')
    } else {
      // Retirer des favoris
      items.value.splice(index, 1)
      toastStore.show(t('wishlist.removed'), 'info')
    }

    saveToStorage()
  }

  function clear(): void {
    items.value = []
    saveToStorage()
    toastStore.show(t('wishlist.cleared'), 'info')
  }

  // Helpers localStorage
  function loadFromStorage(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  function saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch {
      console.warn('Impossible de sauvegarder les favoris dans le localStorage')
    }
  }

  return {
    // State
    items,
    // Getters
    count,
    isInWishlist,
    // Actions
    toggle,
    clear,
  }
})
