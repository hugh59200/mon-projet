// useChat.ts
import { useAuthStore } from '@/features/auth/useAuthStore'
import { computed, onMounted, onUnmounted, ref } from 'vue'
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

  const isReady = ref(false)
  const newMessage = ref('')

  const scroll = useScrollMessages(
    () => document.querySelector('.messages-list, .chat-messages') as HTMLElement | null,
  )

  const msgs = useChatMessages({
    role,
    getActiveUser: () => (role === 'admin' ? selectedUserId.value : userId.value),
    onUnread: notif.incrementUserUnread,
    scroll,
  })
  const typing = useChatTyping({
    role,
    getActiveUser: () => (role === 'admin' ? selectedUserId.value : userId.value),
  })

  const conv = role === 'admin' ? useChatConversations() : null

  const init = async () => {
    if (role === 'admin') {
      await conv!.fetchConversations()
      conv!.setupPresence()
      conv!.listenRealtimeConversations()
      msgs.subscribeRealtime(null)
    } else if (userId.value) {
      await msgs.fetchInitialMessages(userId.value)
      msgs.subscribeRealtime(userId.value)
    }

    typing.setup()
    isReady.value = true
  }

  const selectConversation = async (uid: string) => {
    selectedUserId.value = uid
    notif.clearUserUnread(uid)

    await msgs.fetchInitialMessages(uid)
    msgs.subscribeRealtime(uid)
  }

  const sendMessage = () => {
    if (!newMessage.value.trim()) return
    msgs.sendMessage(newMessage.value.trim())
    newMessage.value = ''
  }

  onMounted(init)
  onUnmounted(() => {
    msgs.cleanup()
    typing.cleanup()
    conv?.cleanup()
  })

  return {
    role,
    userId,
    selectedUserId,
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
