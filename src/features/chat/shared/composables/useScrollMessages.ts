import { nextTick, onUnmounted, ref, type Ref } from 'vue'

interface UseScrollMessagesOptions {
  /** Seuil en pixels pour considérer qu'on est "proche du bas" */
  threshold?: number
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
  /** Scroll vers un message par son ID */
  scrollToMessage: (messageId: string, behavior?: ScrollBehavior) => boolean
  /** Trouver le premier message visible */
  getFirstVisibleMessageId: () => string | null
  /** Cacher l'indicateur de nouveaux messages */
  hideNewMessagesIndicator: () => void
  /** Vérifier si proche du bas */
  checkNearBottom: () => boolean
}

export function useScrollMessages(
  options: UseScrollMessagesOptions = {},
): UseScrollMessagesReturn {
  const { threshold = 100 } = options

  const scrollRef = ref<HTMLElement | null>(null)
  const isNearBottom = ref(true)
  const showNewMessagesIndicator = ref(false)

  // ─────────────────────────────────────────
  // Vérifier si proche du bas
  // ─────────────────────────────────────────

  const checkNearBottom = (): boolean => {
    const el = scrollRef.value
    if (!el) return true

    const { scrollTop, scrollHeight, clientHeight } = el
    return scrollHeight - scrollTop - clientHeight <= threshold
  }

  // ─────────────────────────────────────────
  // Scroll vers le bas
  // ─────────────────────────────────────────

  const scrollToEnd = async (instant = false): Promise<void> => {
    await nextTick()

    const el = scrollRef.value
    if (!el) return

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

      isNearBottom.value = true
      showNewMessagesIndicator.value = false
    })
  }

  // ─────────────────────────────────────────
  // Scroll vers un message spécifique
  // ─────────────────────────────────────────

  const scrollToMessage = (messageId: string, behavior: ScrollBehavior = 'auto'): boolean => {
    const el = scrollRef.value
    if (!el || !messageId) return false

    // Trouver l'élément du message par data-message-id
    const messageEl = el.querySelector(`[data-message-id="${messageId}"]`)
    if (!messageEl) {
      console.log('[Scroll] Message not found:', messageId)
      return false
    }

    messageEl.scrollIntoView({ behavior, block: 'start' })
    console.log('[Scroll] Scrolled to message:', messageId)
    return true
  }

  // ─────────────────────────────────────────
  // Trouver le premier message visible
  // ─────────────────────────────────────────

  const getFirstVisibleMessageId = (): string | null => {
    const el = scrollRef.value
    if (!el) return null

    // Récupérer tous les messages
    const messages = el.querySelectorAll('[data-message-id]')
    if (!messages.length) return null

    const containerRect = el.getBoundingClientRect()
    const containerTop = containerRect.top

    // Trouver le premier message visible
    for (const msg of Array.from(messages)) {
      const msgRect = msg.getBoundingClientRect()
      // Le message est visible si son top est dans le viewport du conteneur
      if (msgRect.top >= containerTop - 50) {
        const id = msg.getAttribute('data-message-id')
        if (id) return id
      }
    }

    // Fallback: retourner le premier message
    return messages[0]?.getAttribute('data-message-id') ?? null
  }

  // ─────────────────────────────────────────
  // Cacher l'indicateur
  // ─────────────────────────────────────────

  const hideNewMessagesIndicator = () => {
    showNewMessagesIndicator.value = false
    scrollToEnd()
  }

  // Auto-cleanup au démontage
  onUnmounted(() => {
    // Rien à nettoyer pour l'instant
  })

  return {
    scrollRef,
    isNearBottom,
    showNewMessagesIndicator,
    scrollToEnd,
    scrollToMessage,
    getFirstVisibleMessageId,
    hideNewMessagesIndicator,
    checkNearBottom,
  }
}
