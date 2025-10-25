import { supabase } from '@/services/supabaseClient'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { chatApi } from '../services/chatApi'
import { useChatNotifStore } from '../stores/useChatNotifStore'
import type { ChatRole, ConversationOverview, Message } from '../types/chat'

export function useAdminChat() {
  const role: ChatRole = 'admin'
  const chatNotif = useChatNotifStore()

  const messages = ref<Message[]>([])
  const conversations = ref<ConversationOverview[]>([])
  const newMessage = ref('')
  const selectedUserId = ref<string | null>(null)
  const isReady = ref(false)
  const isMessagesLoading = ref(false)
  const isTyping = ref(false)

  let typingTimer: ReturnType<typeof setTimeout> | null = null
  let typingChannel: ReturnType<typeof supabase.channel> | null = null
  let msgChannel: ReturnType<typeof supabase.channel> | null = null

  /* ------------------------------ Realtime ------------------------------ */
  const subscribeRealtime = (userId: string) => {
    if (!userId) return
    if (msgChannel) supabase.removeChannel(msgChannel)

    msgChannel = supabase
      .channel(`admin-messages-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          const msg = payload.new as Message
          console.log('⚡ Nouveau message reçu (admin):', msg)
          messages.value.unshift(msg)
          await nextTick()

          // ✅ Si c’est dans la conversation active
          if (selectedUserId.value === userId) {
            chatNotif.unreadByUser[userId] = 0
            await chatNotif.markAsRead(userId, msg.id)
            await chatNotif.fetchUnreadByUser()
          }
        },
      )
      .subscribe()
  }

  /* ------------------------------ Typing ------------------------------- */
  const ensureTypingChannel = () => {
    if (typingChannel) return
    typingChannel = supabase.channel('typing-status', {
      config: { broadcast: { self: false } },
    })
    typingChannel
      .on('broadcast', { event: 'user_typing' }, (e) => {
        isTyping.value = e.payload.isTyping
      })
      .subscribe()
  }

  const sendTyping = () => {
    ensureTypingChannel()
    typingChannel!.send({
      type: 'broadcast',
      event: 'admin_typing',
      payload: { isTyping: true },
    })
    clearTimeout(typingTimer!)
    typingTimer = setTimeout(
      () =>
        typingChannel!.send({
          type: 'broadcast',
          event: 'admin_typing',
          payload: { isTyping: false },
        }),
      1500,
    )
  }

  /* -------------------------- Conversations ---------------------------- */
  const fetchConversations = async () => {
    isReady.value = false
    const { data, error } = await chatApi.fetchAllConversations()
    if (!error && data) {
      conversations.value = data as ConversationOverview[]
    }
    isReady.value = true
  }

  /* ----------------------------- Messages ------------------------------ */
  const fetchMessages = async (userId: string) => {
    isMessagesLoading.value = true
    const { data, error } = await chatApi.fetchMessages(userId)
    if (!error && data) messages.value = data
    isMessagesLoading.value = false

    const lastMsg = messages.value.at(-1)
    if (lastMsg) await chatNotif.markAsRead(userId, lastMsg.id)
  }

  /* ----------------------------- Sélection ----------------------------- */
  const selectConversation = async (uid: string) => {
    selectedUserId.value = uid
    await fetchMessages(uid)
    subscribeRealtime(uid)
    await chatNotif.fetchUnreadByUser()
  }

  /* --------------------------- Envoi message --------------------------- */
  const sendMessage = async () => {
    if (!newMessage.value.trim() || !selectedUserId.value) return
    const content = newMessage.value
    newMessage.value = ''
    const { error } = await chatApi.sendMessage(selectedUserId.value, role, content)
    if (!error) await nextTick()
  }

  /* ----------------------------- Lifecycle ----------------------------- */
  onMounted(() => {
    fetchConversations()
    ensureTypingChannel()
    chatNotif.fetchUnreadByUser()
    chatNotif.listenRealtime()
  })

  onUnmounted(() => {
    typingChannel && supabase.removeChannel(typingChannel)
    msgChannel && supabase.removeChannel(msgChannel)
  })

  return {
    messages,
    newMessage,
    isTyping,
    isReady,
    isMessagesLoading,
    conversations,
    selectedUserId,
    fetchConversations,
    sendMessage,
    selectConversation,
    sendTyping,
  }
}
