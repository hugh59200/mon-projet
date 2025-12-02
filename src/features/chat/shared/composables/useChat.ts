import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useChatNotifStore } from '../stores/useChatNotifStore'
import type { ChatRole } from '../types/chat'
import { useChatConversations } from './useChatConversations'
import { useChatMessages } from './useChatMessages'
import { useChatTyping } from './useChatTyping'

export function useChat(role: ChatRole) {
  const auth = useAuthStore()
  const notif = useChatNotifStore()

  const userId = computed(() => auth.user?.id ?? null)
  const selectedUserId = ref<string | null>(null)

  const activeUserId = computed<string | null>(() =>
    role === 'admin' ? selectedUserId.value : userId.value,
  )

  const isReady = ref(false)
  const newMessage = ref('')

  const conv = role === 'admin' ? useChatConversations() : null

  // Le scroll est maintenant géré par ChatCore.vue via ResizeObserver
  const msgs = useChatMessages({
    role,
    getActiveUser: () => activeUserId.value,
    onUnread: (uid) => notif.incrementUserUnread(uid),
    onMarkedRead: async () => {
      if (role === 'admin') await conv?.refreshUnreadCount()
    },
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
        conv!.listenRealtimeConversations()
        msgs.subscribeUnreadForAdmin?.()
      } else if (userId.value) {
        await msgs.fetchInitialMessages(userId.value)
        await msgs.subscribeRealtime(userId.value) // attendre la (ré)subscription propre
      }

      typing.setup()
      if (!disposed) isReady.value = true
    } catch (e) {
      initialized = false
      console.error(e)
    }
  }

  const selectConversation = (uid: string) => {
    selectedUserId.value = uid
  }

  const sendMessage = async () => {
    const text = newMessage.value.trim()
    if (!text) return
    try {
      await msgs.sendMessage(text)
      newMessage.value = ''
    } catch (e) {
      console.error(e)
      ;(notif as any)?.toast?.('Envoi impossible. Réessaie.')
    }
  }

  onMounted(() => {
    init()
  })

  watch(userId, (id) => {
    if (role === 'user' && id && !isReady.value) init()
  })

  watch(selectedUserId, async (uid, old) => {
    if (!uid || uid === old) return
    try {
      notif.clearUserUnread(uid)
      await msgs.fetchInitialMessages(uid)
      await msgs.subscribeRealtime(uid) // écoute filtrée (attendre l'unsubscribe précédent)
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
