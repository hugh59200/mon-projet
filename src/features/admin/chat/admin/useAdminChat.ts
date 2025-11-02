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

    // ✅ L'admin écoute TOUS les users
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
    if (!error && data) conversations.value = data as ConversationOverview[]
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

    // ✅ Scroll automatique
    setTimeout(() => {
      const el = document.querySelector('.chat-messages') as HTMLElement | null
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'auto' })
    }, 100)
  }

  /* ------------------------------ Realtime ------------------------------ */
  const subscribeRealtime = (userId: string) => {
    if (msgChannel) supabase.removeChannel(msgChannel)

    msgChannel = supabase
      .channel(`admin-messages-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `user_id=eq.${userId}` },
        async (payload) => {
          const msg = payload.new as Message
          const idx = messages.value.findIndex((m) => m.id === msg.id)

          if (payload.eventType === 'INSERT' && idx === -1) {
            messages.value.push(reactive(msg))
            await nextTick()

            const el = document.querySelector('.chat-messages') as HTMLElement | null
            if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })

            // ✅ Marque automatiquement en lu si c’est un message user visible
            if (msg.sender_role === 'user' && selectedUserId.value === userId) {
              await chatNotif.markAsRead(userId, msg.id)
            }
          }

          if (payload.eventType === 'UPDATE' && idx !== -1)
            Object.assign(messages.value[idx] ?? {}, msg)
        },
      )
      .subscribe()
  }

  /* ------------------------------ Sélection conversation ------------------------------ */
  const selectConversation = async (uid: string) => {
    selectedUserId.value = uid
    await fetchMessages(uid)
    subscribeRealtime(uid)

    // ✅ Marque tous les messages user comme lus à l’ouverture
    const lastUserMsg = messages.value.filter((m) => m.sender_role === 'user').at(-1)
    if (lastUserMsg) {
      await chatNotif.markAsRead(uid, lastUserMsg.id)
    } else {
      chatNotif.unreadByUser[uid] = 0
    }

    await chatNotif.fetchUnreadByUser()
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
    }
  }

  /* ------------------------------ Lifecycle ------------------------------ */
  onMounted(() => {
    fetchConversations()
    ensureTypingChannel()
    chatNotif.fetchUnreadByUser()
    chatNotif.listenRealtime() // ✅ écoute globale des nouveaux messages
  })

  onUnmounted(() => {
    if (typingChannel) supabase.removeChannel(typingChannel)
    if (msgChannel) supabase.removeChannel(msgChannel)
  })

  /* ------------------------------ Return ------------------------------ */
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
