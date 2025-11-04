import { supabase } from '@/supabase/supabaseClient'
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { chatApi } from '../shared/services/chatApi'
import { useChatNotifStore } from '../shared/stores/useChatNotifStore'
import type { ChatRole, ConversationOverview, Message } from '../shared/types/chat'

export function useAdminChat() {
  const role: ChatRole = 'admin'
  const chatNotif = useChatNotifStore()

  /* ------------------------------ State ------------------------------ */
  const messages = ref<Message[]>([])
  const conversations = ref<ConversationOverview[]>([])
  const newMessage = ref('')
  const selectedUserId = ref<string | null>(null)
  const isReady = ref(false)
  const isMessagesLoading = ref(false)
  const isTypingByUser = ref<Record<string, boolean>>({})

  let msgChannel: ReturnType<typeof supabase.channel> | null = null
  let typingChannel: ReturnType<typeof supabase.channel> | null = null

  /* ------------------------------ Typing ------------------------------ */
  const ensureTypingChannel = () => {
    if (typingChannel) return

    typingChannel = supabase.channel('typing-status', {
      config: { broadcast: { self: false } },
    })

    typingChannel
      .on('broadcast', { event: 'user_typing' }, (e) => {
        const { userId, isTyping } = e.payload
        if (!userId) return

        isTypingByUser.value[userId] = isTyping

        if (isTyping) {
          setTimeout(() => {
            isTypingByUser.value[userId] = false
          }, 2000)
        }
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
    setTimeout(() => {
      typingChannel!.send({
        type: 'broadcast',
        event: 'admin_typing',
        payload: { isTyping: false },
      })
    }, 1200)
  }

  /* ------------------------------ Conversations ------------------------------ */
  const fetchConversations = async () => {
    isReady.value = false
    const { data, error } = await chatApi.fetchAllConversations()
    if (!error && data) {
      // ✅ Toujours injecter unread_count = number
      conversations.value = data.map((c) => ({
        ...c,
        unread_count: c.unread_count_admin ?? 0,
      })) as ConversationOverview[]
    }
    isReady.value = true
  }

  /* ------------------------------ Messages ------------------------------ */
  const fetchMessages = async (userId: string) => {
    isMessagesLoading.value = true
    const { data, error } = await chatApi.fetchMessages(userId)

    if (!error && data) {
      messages.value = data.sort(
        (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime(),
      )
    } else {
      messages.value = []
    }

    isMessagesLoading.value = false
    await nextTick()

    setTimeout(() => {
      const el = document.querySelector('.chat-messages') as HTMLElement | null
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'auto' })
    }, 100)
  }

  /* ------------------------------ Realtime ------------------------------ */
  const subscribeRealtime = (userId: string) => {
    if (msgChannel) supabase.removeChannel(msgChannel)

    msgChannel = supabase
      .channel('admin-messages-global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async (payload) => {
          const msg = payload.new as Message

          // ✅ message ne concerne PAS cette conversation → skip
          if (msg.user_id !== userId) return

          const idx = messages.value.findIndex((m) => m.id === msg.id)

          /* ✅ Nouveau message */
          if (payload.eventType === 'INSERT' && idx === -1) {
            messages.value.push(reactive(msg))
            await nextTick()

            scroll()

            // ✅ Met à jour le dernier message côté sidebar
            conversations.value = conversations.value.map((c) =>
              c.user_id === userId
                ? {
                    ...c,
                    last_message: msg.content,
                    last_message_at: msg.created_at,
                    unread_count:
                      msg.sender_role === 'user' && selectedUserId.value !== userId
                        ? (chatNotif.unreadByUser[userId] ?? 0) + 1
                        : 0,
                  }
                : c,
            )

            // ✅ Si admin regarde → marquer lu
            if (msg.sender_role === 'user' && selectedUserId.value === userId) {
              await chatNotif.markAsRead(userId, msg.id)
            }
          }

          /* ✅ Update */
          if (payload.eventType === 'UPDATE' && idx !== -1) {
            Object.assign(messages.value[idx]!, msg)
          }
        },
      )
      .subscribe()
  }

  function scroll() {
    const el = document.querySelector('.chat-messages') as HTMLElement | null
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }

  /* ------------------------------ Sélection conversation ------------------------------ */
  const selectConversation = async (uid: string) => {
    selectedUserId.value = uid
    await fetchMessages(uid)
    subscribeRealtime(uid)

    const lastUserMsg = messages.value.filter((m) => m.sender_role === 'user').at(-1)

    if (lastUserMsg) {
      await chatNotif.markAsRead(uid, lastUserMsg.id)
    } else {
      chatNotif.unreadByUser[uid] = 0
    }

    await chatNotif.fetchUnreadByUser()

    // ✅ Remet à jour le compteur visible dans conversations
    conversations.value = conversations.value.map((c) =>
      c.user_id === uid
        ? { ...c, unread_count: 0 }
        : { ...c, unread_count: chatNotif.unreadByUser[c.user_id] ?? 0 },
    )
  }

  /* ------------------------------ Envoi message ------------------------------ */
  const sendMessage = async () => {
    if (!newMessage.value.trim() || !selectedUserId.value) return

    const content = newMessage.value
    newMessage.value = ''

    const { data, error } = await chatApi.sendMessage(selectedUserId.value, role, content)

    if (!error && data) {
      const msg: Message = data
      messages.value.push(reactive(msg))
      await nextTick()

      const el = document.querySelector('.chat-messages') as HTMLElement | null
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })

      // ✅ Mise à jour du dernier message
      conversations.value = conversations.value.map((c) =>
        c.user_id === selectedUserId.value
          ? {
              ...c,
              last_message: msg.content,
              last_message_at: msg.created_at,
            }
          : c,
      )
    }
  }

  /* ------------------------------ Lifecycle ------------------------------ */
  onMounted(() => {
    fetchConversations()
    ensureTypingChannel()
    chatNotif.fetchUnreadByUser()
    chatNotif.listenRealtime()
  })

  onUnmounted(() => {
    if (typingChannel) supabase.removeChannel(typingChannel)
    if (msgChannel) supabase.removeChannel(msgChannel)
  })

  return {
    messages,
    conversations,
    newMessage,
    selectedUserId,
    isReady,
    isMessagesLoading,
    isTypingByUser,
    fetchConversations,
    sendMessage,
    selectConversation,
    sendTyping,
  }
}
