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

  /** ✅ Modules */
  const msgs = useChatMessages(
    role,
    () => userId.value,
    () => selectedUserId.value,
    (uid) => notif.incrementUserUnread(uid),
    () => document.querySelector('.messages-list, .chat-messages') as HTMLElement | null,
  )

  const typing = useChatTyping(
    role,
    () => userId.value,
    () => selectedUserId.value,
  )

  const conv = isAdmin ? useChatConversations() : null

  /** ✅ Admin choisit une conversation */
  const selectConversation = async (uid: string) => {
    selectedUserId.value = uid
    notif.clearUserUnread(uid)

    await msgs.fetchInitialMessages(uid)
    msgs.subscribeRealtime(uid)
  }

  /** ✅ Init User */
  const initUser = async () => {
    if (!userId.value) return
    await msgs.fetchInitialMessages(userId.value)
    msgs.subscribeRealtime(userId.value)
    typing.setupTypingChannel()
    isReady.value = true
  }

  /** ✅ Init Admin */
  const initAdmin = async () => {
    await conv?.fetchConversations()
    msgs.subscribeRealtime(null)

    // ✅ absolument obligatoire
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

  /** ✅ Envoi */
  const sendMessage = () => {
    const text = newMessage.value.trim()
    if (!text) return
    newMessage.value = ''
    msgs.sendMessage(text)
  }

  return {
    role,
    userId,
    isReady,

    // messages
    messages: msgs.messages,
    hasMore: msgs.hasMore,
    isMessagesLoading: msgs.isMessagesLoading,
    loadOlderMessages: msgs.loadOlderMessages,

    // input & typing
    newMessage,
    sendMessage,
    sendTyping: typing.sendTyping,
    isTypingByUser: typing.isTypingByUser,
    isTyping: typing.isTyping, // pour le côté client
    setupTypingChannel: typing.setupTypingChannel,

    // admin specific
    conversations: conv?.conversations,
    fetchConversations: conv?.fetchConversations,
    selectedUserId,
    selectConversation,
  }
}
