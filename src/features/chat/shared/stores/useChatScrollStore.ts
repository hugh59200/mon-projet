import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ScrollState {
  /** ID du premier message visible */
  firstVisibleMessageId: string | null
  /** Était proche du bas ? */
  wasNearBottom: boolean
}

/**
 * Store pour persister la position de scroll par conversation.
 * Utilise l'ID du message plutôt que la position pixel pour plus de fiabilité.
 */
export const useChatScrollStore = defineStore('chat-scroll', () => {
  // Map: conversationId -> ScrollState
  const scrollStates = ref<Map<string, ScrollState>>(new Map())

  /**
   * Sauvegarder l'état de scroll pour une conversation
   */
  const saveScrollState = (
    conversationId: string,
    firstVisibleMessageId: string | null,
    wasNearBottom: boolean,
  ) => {
    if (!conversationId) return

    scrollStates.value.set(conversationId, {
      firstVisibleMessageId,
      wasNearBottom,
    })

    console.log('[ScrollStore] Saved:', conversationId, {
      firstVisibleMessageId,
      wasNearBottom,
    })
  }

  /**
   * Récupérer l'état de scroll pour une conversation
   */
  const getScrollState = (conversationId: string): ScrollState | null => {
    if (!conversationId) return null
    return scrollStates.value.get(conversationId) ?? null
  }

  /**
   * Vérifier si une conversation a un état sauvegardé
   */
  const hasScrollState = (conversationId: string): boolean => {
    return scrollStates.value.has(conversationId)
  }

  /**
   * Effacer l'état d'une conversation
   */
  const clearScrollState = (conversationId: string) => {
    scrollStates.value.delete(conversationId)
  }

  /**
   * Effacer tous les états
   */
  const clearAll = () => {
    scrollStates.value.clear()
  }

  return {
    scrollStates,
    saveScrollState,
    getScrollState,
    hasScrollState,
    clearScrollState,
    clearAll,
  }
})
