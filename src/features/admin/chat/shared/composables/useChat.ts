import { useAuthStore } from '@/features/auth/useAuthStore'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useChatNotifStore } from '../stores/useChatNotifStore'
import type { ChatRole } from '../types/chat'
import { useChatConversations } from './useChatConversations'
import { useChatMessages } from './useChatMessages'
import { useChatTyping } from './useChatTyping'

export function useChat(role: ChatRole) {
  const auth = useAuthStore()
  const notif = useChatNotifStore()

  const isAdmin = role === 'admin'
  const userId = computed(() => (role === 'user' ? (auth.user?.id ?? null) : null))
  const selectedUserId = ref<string | null>(null)
  const newMessage = ref('')
  const isReady = ref(false)

  /* ---- Modules ---- */
  const msgs = useChatMessages(
    role,
    () => userId.value,
    () => selectedUserId.value,
    (uid) => {
      notif.unreadByUser[uid] = (notif.unreadByUser[uid] ?? 0) + 1
      notif.unreadCount = Object.values(notif.unreadByUser).reduce((a, b) => a + b, 0)
    },
  )

  const typing = useChatTyping(
    role,
    () => userId.value,
    () => selectedUserId.value,
  )
  const conv = isAdmin ? useChatConversations() : null

  /* ---- ADMIN conversation pick ---- */
  const selectConversation = async (uid: string) => {
    selectedUserId.value = uid
    notif.unreadByUser[uid] = 0
    notif.unreadCount = Object.values(notif.unreadByUser).reduce((a, b) => a + b, 0)

    await msgs.fetchInitialMessages(uid)
    msgs.subscribeRealtime(uid)
  }

  /* ---- INIT ---- */
  const initUser = async () => {
    if (!userId.value) return
    await msgs.fetchInitialMessages(userId.value)
    msgs.subscribeRealtime(userId.value)
    typing.setupTypingChannel()
    isReady.value = true
  }

  const initAdmin = async () => {
    await conv?.fetchConversations()
    msgs.subscribeRealtime(null)
    typing.setupTypingChannel()
    isReady.value = true
  }

  onMounted(() => {
    isAdmin ? initAdmin() : initUser()
  })

  onUnmounted(() => {
    msgs.cleanup()
    typing.cleanup()
  })

  const sendMessage = () => {
    const text = newMessage.value.trim()
    if (!text) return
    newMessage.value = ''
    msgs.sendMessage(text)
  }

  return {
    /* shared */
    role,
    userId,
    isReady,
    messages: msgs.messages,
    hasMore: msgs.hasMore,
    isMessagesLoading: msgs.isMessagesLoading,
    loadOlderMessages: msgs.loadOlderMessages,

    newMessage,
    sendMessage,
    ...typing,

    /* admin */
    conversations: conv?.conversations,
    fetchConversations: conv?.fetchConversations,
    selectedUserId,
    selectConversation,
  }
}
