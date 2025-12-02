import { nextTick, onUnmounted, ref, type Ref } from 'vue'

interface UseScrollMessagesOptions {
  /** Seuil en pixels pour considérer qu'on est "proche du bas" */
  threshold?: number
  /** Délai de debounce pour l'événement scroll (ms) */
  scrollDebounce?: number
}

interface ScrollPosition {
  scrollTop: number
  scrollHeight: number
  wasNearBottom: boolean
}

interface UseScrollMessagesReturn {
  /** Ref vers l'élément scrollable */
  scrollRef: Ref<HTMLElement | null>
  /** True si l'utilisateur est proche du bas */
  isNearBottom: Ref<boolean>
  /** True si on doit afficher le bouton "nouveaux messages" */
  showNewMessagesIndicator: Ref<boolean>
  /** Scroll vers le bas */
  scrollToEnd: (instant?: boolean) => Promise<void>
  /** Maintenir la position de scroll lors d'un prepend de messages */
  keepScrollOnPrepend: (prevHeight: number) => Promise<void>
  /** Initialiser les observers (à appeler dans onMounted) */
  initScrollObserver: () => void
  /** Nettoyer les observers */
  cleanup: () => void
  /** Cacher l'indicateur de nouveaux messages */
  hideNewMessagesIndicator: () => void
  /** Getter pour l'élément (compatibilité) */
  getScrollEl: () => HTMLElement | null
  /** Sauvegarder la position de scroll pour une conversation */
  saveScrollPosition: (conversationId: string) => void
  /** Restaurer la position de scroll pour une conversation */
  restoreScrollPosition: (conversationId: string) => Promise<boolean>
  /** Effacer la position sauvegardée d'une conversation */
  clearScrollPosition: (conversationId: string) => void
}

// Store global des positions de scroll par conversation
// Persiste en mémoire pendant la session
const scrollPositions = new Map<string, ScrollPosition>()

export function useScrollMessages(
  options: UseScrollMessagesOptions = {},
): UseScrollMessagesReturn {
  const { threshold = 100, scrollDebounce = 16 } = options

  const scrollRef = ref<HTMLElement | null>(null)
  const isNearBottom = ref(true)
  const showNewMessagesIndicator = ref(false)

  let resizeObserver: ResizeObserver | null = null
  let scrollDebounceTimer: ReturnType<typeof setTimeout> | null = null
  let lastScrollHeight = 0
  let isAutoScrolling = false
  let isRestoring = false

  // ─────────────────────────────────────────
  // Utilitaires
  // ─────────────────────────────────────────

  const getScrollEl = () => scrollRef.value

  /** Vérifie si l'utilisateur est proche du bas */
  const checkNearBottom = (): boolean => {
    const el = scrollRef.value
    if (!el) return true

    const { scrollTop, scrollHeight, clientHeight } = el
    return scrollHeight - scrollTop - clientHeight <= threshold
  }

  /** Mise à jour de l'état isNearBottom avec debounce */
  const updateNearBottomState = () => {
    if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer)

    scrollDebounceTimer = setTimeout(() => {
      const wasNearBottom = isNearBottom.value
      isNearBottom.value = checkNearBottom()

      // Si l'utilisateur scroll vers le bas, masquer l'indicateur
      if (isNearBottom.value && showNewMessagesIndicator.value) {
        showNewMessagesIndicator.value = false
      }

      // Si l'utilisateur scroll vers le haut depuis le bas
      if (wasNearBottom && !isNearBottom.value) {
        // Rien à faire pour l'instant
      }
    }, scrollDebounce)
  }

  // ─────────────────────────────────────────
  // Scroll vers le bas
  // ─────────────────────────────────────────

  const scrollToEnd = async (instant = false): Promise<void> => {
    await nextTick()

    const el = scrollRef.value
    if (!el) return

    isAutoScrolling = true

    // Utiliser requestAnimationFrame pour un timing optimal
    requestAnimationFrame(() => {
      if (!el) return

      const targetScroll = el.scrollHeight - el.clientHeight

      if (instant) {
        el.scrollTop = targetScroll
      } else {
        el.scrollTo({
          top: targetScroll,
          behavior: 'smooth',
        })
      }

      // Réinitialiser l'état après le scroll
      requestAnimationFrame(() => {
        isNearBottom.value = true
        showNewMessagesIndicator.value = false
        isAutoScrolling = false
      })
    })
  }

  // ─────────────────────────────────────────
  // Maintenir la position lors du prepend
  // ─────────────────────────────────────────

  const keepScrollOnPrepend = async (prevHeight: number): Promise<void> => {
    await nextTick()

    const el = scrollRef.value
    if (!el) return

    requestAnimationFrame(() => {
      const heightDiff = el.scrollHeight - prevHeight
      if (heightDiff > 0) {
        el.scrollTop += heightDiff
      }
    })
  }

  // ─────────────────────────────────────────
  // Persistance de la position de scroll
  // ─────────────────────────────────────────

  /** Sauvegarder la position de scroll pour une conversation */
  const saveScrollPosition = (conversationId: string): void => {
    const el = scrollRef.value
    if (!el || !conversationId) return

    const position: ScrollPosition = {
      scrollTop: el.scrollTop,
      scrollHeight: el.scrollHeight,
      wasNearBottom: checkNearBottom(),
    }

    scrollPositions.set(conversationId, position)
  }

  /** Restaurer la position de scroll pour une conversation */
  const restoreScrollPosition = async (conversationId: string): Promise<boolean> => {
    if (!conversationId) return false

    const savedPosition = scrollPositions.get(conversationId)
    if (!savedPosition) return false

    // Si l'utilisateur était proche du bas, scroller vers le bas
    // (il pourrait y avoir de nouveaux messages)
    if (savedPosition.wasNearBottom) {
      await scrollToEnd(true)
      return true
    }

    await nextTick()

    const el = scrollRef.value
    if (!el) return false

    isRestoring = true

    // Attendre que le contenu soit rendu
    await nextTick()

    requestAnimationFrame(() => {
      if (!el) return

      // Calculer la position proportionnelle si la hauteur a changé
      const currentScrollHeight = el.scrollHeight
      const heightRatio = currentScrollHeight / savedPosition.scrollHeight

      // Restaurer la position (ajustée si la hauteur a changé)
      const adjustedScrollTop = savedPosition.scrollTop * heightRatio
      el.scrollTop = adjustedScrollTop

      // Mettre à jour l'état
      requestAnimationFrame(() => {
        isNearBottom.value = checkNearBottom()
        isRestoring = false
      })
    })

    return true
  }

  /** Effacer la position sauvegardée d'une conversation */
  const clearScrollPosition = (conversationId: string): void => {
    scrollPositions.delete(conversationId)
  }

  // ─────────────────────────────────────────
  // Auto-scroll intelligent sur nouveaux contenus
  // ─────────────────────────────────────────

  const handleContentResize = () => {
    const el = scrollRef.value
    if (!el || isAutoScrolling || isRestoring) return

    const currentScrollHeight = el.scrollHeight

    // Détecter si du contenu a été ajouté
    if (currentScrollHeight > lastScrollHeight) {
      const heightDiff = currentScrollHeight - lastScrollHeight

      // Si l'utilisateur était proche du bas, auto-scroll
      if (isNearBottom.value) {
        scrollToEnd(true)
      } else if (heightDiff > 50) {
        // Sinon, afficher l'indicateur de nouveaux messages
        showNewMessagesIndicator.value = true
      }
    }

    lastScrollHeight = currentScrollHeight
  }

  // ─────────────────────────────────────────
  // Initialisation des observers
  // ─────────────────────────────────────────

  const initScrollObserver = () => {
    const el = scrollRef.value
    if (!el) return

    // Initialiser la hauteur de référence
    lastScrollHeight = el.scrollHeight

    // Observer les changements de taille du contenu
    resizeObserver = new ResizeObserver(() => {
      handleContentResize()
    })

    // Observer le conteneur des messages (premier enfant)
    const contentContainer = el.firstElementChild
    if (contentContainer) {
      resizeObserver.observe(contentContainer)
    }

    // Aussi observer l'élément lui-même pour les changements de viewport
    resizeObserver.observe(el)

    // Écouter l'événement scroll avec passive pour de meilleures performances
    el.addEventListener('scroll', updateNearBottomState, { passive: true })

    // Scroll initial vers le bas
    scrollToEnd(true)
  }

  // ─────────────────────────────────────────
  // Cleanup
  // ─────────────────────────────────────────

  const cleanup = () => {
    if (scrollDebounceTimer) {
      clearTimeout(scrollDebounceTimer)
      scrollDebounceTimer = null
    }

    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    const el = scrollRef.value
    if (el) {
      el.removeEventListener('scroll', updateNearBottomState)
    }
  }

  const hideNewMessagesIndicator = () => {
    showNewMessagesIndicator.value = false
    scrollToEnd()
  }

  // Auto-cleanup au démontage
  onUnmounted(cleanup)

  return {
    scrollRef,
    isNearBottom,
    showNewMessagesIndicator,
    scrollToEnd,
    keepScrollOnPrepend,
    initScrollObserver,
    cleanup,
    hideNewMessagesIndicator,
    getScrollEl,
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
  }
}
