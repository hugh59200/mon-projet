import { useAuthStore } from '@/features/auth/useAuthStore'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useChatNotifStore } from '../stores/useChatNotifStore'
import type { ChatRole } from '../types/chat'
import { useChatConversations } from './useChatConversations'
import { useChatMessages } from './useChatMessages'
import { useChatTyping } from './useChatTyping'
import { useScrollMessages } from './useScrollMessages'

export function useChat(role: ChatRole) {
  const auth = useAuthStore()
  const notif = useChatNotifStore()

  const userId = computed(() => auth.user?.id ?? null)
  const selectedUserId = ref<string | null>(null)

  // expose l'user actif (UI friendly)
  const activeUserId = computed<string | null>(() =>
    role === 'admin' ? selectedUserId.value : userId.value,
  )

  const isReady = ref(false)
  const newMessage = ref('')

  // SSR-safe: évite d'accéder à document côté serveur
  const scroll = useScrollMessages(() => {
    if (typeof window === 'undefined') return null
    return document.querySelector('.messages-list, .chat-messages') as HTMLElement | null
  })

  // conversations doit être initialisé avant useChatMessages pour onMarkedRead
  const conv = role === 'admin' ? useChatConversations() : null

  const msgs = useChatMessages({
    role,
    getActiveUser: () => activeUserId.value,
    onUnread: (uid) => notif.incrementUserUnread(uid),
    onMarkedRead: async () => {
      if (role === 'admin') await conv?.refreshUnreadCount()
    },
    scroll,
  })

  const typing = useChatTyping({
    role,
    getActiveUser: () => activeUserId.value,
  })

  let initialized = false
  let disposed = false

  const init = async () => {
    if (initialized || disposed) return
    initialized = true
    try {
      if (role === 'admin') {
        await conv!.fetchConversations()
        conv!.setupPresence()
        // passe l'user actif pour éviter le flicker des unread
        conv!.listenRealtimeConversations(() => activeUserId.value)
        // Flux léger pour les notifications globales (sans ouvrir un thread)
        msgs.subscribeUnreadForAdmin?.()
      } else if (userId.value) {
        await msgs.fetchInitialMessages(userId.value)
        msgs.subscribeRealtime(userId.value)
      }

      typing.setup()
      if (!disposed) isReady.value = true
    } catch (e) {
      // permet un retry si un appel a échoué (ex: réseau)
      initialized = false
      console.error(e)
    }
  }

  // Sélection conversation (la watch ci-dessous fait le reste)
  const selectConversation = (uid: string) => {
    selectedUserId.value = uid
    // plus de clear ici; la watch gère le clear, y compris pour les changements externes
  }

  const sendMessage = async () => {
    const text = newMessage.value.trim()
    if (!text) return
    try {
      await msgs.sendMessage(text)
      newMessage.value = ''
    } catch (e) {
      console.error(e)
      // Option: notif.toast('Envoi impossible. Réessaie.')
    }
  }

  onMounted(() => {
    init()
  })

  // Si l'auth arrive après le mount (cas fréquent), relance l'init côté user
  watch(userId, (id) => {
    if (role === 'user' && id && !isReady.value) init()
  })

  // Réagit à tout changement de thread sélectionné (navigation, actions externes)
  watch(selectedUserId, async (uid, old) => {
    if (!uid || uid === old) return
    try {
      notif.clearUserUnread(uid)
      await msgs.fetchInitialMessages(uid)
      msgs.subscribeRealtime(uid) // écoute filtrée
      await conv?.refreshUnreadCount()
    } catch (e) {
      console.error(e)
    }
  })

  onUnmounted(() => {
    disposed = true
    msgs.cleanup()
    typing.cleanup()
    conv?.cleanup()
  })

  return {
    role,
    userId,
    selectedUserId,
    activeUserId,
    newMessage,

    isReady,
    sendMessage,
    sendTyping: typing.sendTyping,
    selectConversation,

    messages: msgs.messages,
    hasMore: msgs.hasMore,
    isMessagesLoading: msgs.isMessagesLoading,
    loadOlderMessages: msgs.loadOlderMessages,

    isTyping: typing.isTyping,
    isTypingByUser: typing.isTypingByUser,

    conversations: conv?.conversations,
  }
}
