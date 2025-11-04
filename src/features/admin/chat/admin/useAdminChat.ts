import { supabase } from '@/supabase/supabaseClient'
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { chatApi } from '../shared/services/chatApi'
import { useChatNotifStore } from '../shared/stores/useChatNotifStore'
import type { ChatRole, ConversationOverview, Message } from '../shared/types/chat'

export function useAdminChat() {
  const role: ChatRole = 'admin'
  const chatNotif = useChatNotifStore()

  /* -------------------- STATE -------------------- */
  const messages = ref<Message[]>([])
  const conversations = ref<ConversationOverview[]>([])
  const newMessage = ref('')
  const selectedUserId = ref<string | null>(null)
  const isMessagesLoading = ref(false)
  const isTypingByUser = ref<Record<string, boolean>>({})

  /* -------------------- CHANNELS -------------------- */
  let msgChannel: ReturnType<typeof supabase.channel> | null = null
  let typingChannel: ReturnType<typeof supabase.channel> | null = null
  let convChannel: ReturnType<typeof supabase.channel> | null = null
  let unreadChannel: ReturnType<typeof supabase.channel> | null = null

  /* -------------------- TYPING -------------------- */
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
    if (!selectedUserId.value) return
    ensureTypingChannel()

    typingChannel!.send({
      type: 'broadcast',
      event: 'admin_typing',
      payload: { userId: selectedUserId.value, isTyping: true },
    })

    setTimeout(() => {
      typingChannel!.send({
        type: 'broadcast',
        event: 'admin_typing',
        payload: { userId: selectedUserId.value, isTyping: false },
      })
    }, 1200)
  }

  /* -------------------- CONVERSATIONS -------------------- */
  const fetchConversations = async () => {
    const { data } = await chatApi.fetchAllConversations()
    if (!data) return

    conversations.value = data
      .filter((c): c is typeof c & { user_id: string } => !!c.user_id)
      .map((c) => ({
        ...c,
        unread_count: c.unread_count_admin ?? 0,
      }))
  }

  /* -------------------- MESSAGES -------------------- */
  const fetchMessages = async (userId: string) => {
    isMessagesLoading.value = true
    const { data } = await chatApi.fetchMessages(userId)

    messages.value = data
      ? data.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime())
      : []

    isMessagesLoading.value = false
    await nextTick()

    const el = document.querySelector('.chat-messages') as HTMLElement | null
    if (el) el.scrollTo({ top: el.scrollHeight })
  }

  /* -------------------- REALTIME MESSAGES -------------------- */
  const subscribeRealtime = (openedUser: string | null) => {
    if (msgChannel) supabase.removeChannel(msgChannel)

    msgChannel = supabase
      .channel('admin-messages-global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async (payload) => {
          const msg = payload.new as Message
          const uid = msg.user_id

          /* ✅ si AUCUNE conversation ouverte → update sidebar */
          if (!openedUser) {
            if (msg.sender_role === 'user' && uid) {
              chatNotif.unreadByUser[uid] = (chatNotif.unreadByUser[uid] ?? 0) + 1
            }

            conversations.value = conversations.value
              .map((c) =>
                c.user_id === uid
                  ? {
                      ...c,
                      last_message: msg.content,
                      last_message_at: msg.created_at,
                      unread_count: chatNotif.unreadByUser[uid] ?? 0,
                    }
                  : c,
              )
              .sort(
                (a, b) =>
                  new Date(b.last_message_at ?? 0).getTime() -
                  new Date(a.last_message_at ?? 0).getTime(),
              )
            return
          }

          /* ✅ si une conversation est ouverte mais ce message ne la concerne pas */
          if (uid !== openedUser) return

          /* ✅ INSERT → afficher le message dans la vue */
          const idx = messages.value.findIndex((m) => m.id === msg.id)
          if (payload.eventType === 'INSERT' && idx === -1) {
            messages.value.push(reactive(msg))
            await nextTick()
            scroll()
          }

          /* ✅ UPDATE → mettre à jour is_read */
          if (payload.eventType === 'UPDATE' && idx !== -1) {
            Object.assign(messages.value[idx]!, msg)

            // message utilisateur LU → reset compteur
            if (msg.sender_role === 'user' && msg.is_read) {
              chatNotif.unreadByUser[uid] = 0
            }
          }
        },
      )
      .subscribe()
  }

  /* -------------------- nouvelle conversation -------------------- */
  const subscribeConversationRealtime = () => {
    if (convChannel) supabase.removeChannel(convChannel)

    convChannel = supabase
      .channel('admin-conversations-global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversations' },
        async () => {
          await fetchConversations()
        },
      )
      .subscribe()
  }

  /* -------------------- unread propre -------------------- */
  const subscribeUnreadGlobal = () => {
    if (unreadChannel) supabase.removeChannel(unreadChannel)

    unreadChannel = supabase
      .channel('admin-unread-global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async (payload) => {
          const msg = payload.new as Message
          const uid = msg.user_id
          if (!uid) return

          /* ✅ message lu → compteur 0 */
          if (msg.sender_role === 'user' && msg.is_read) {
            chatNotif.unreadByUser[uid] = 0
            conversations.value = conversations.value.map((c) =>
              c.user_id === uid ? { ...c, unread_count: 0 } : c,
            )
            return
          }

          /* ✅ nouveau message user */
          if (payload.eventType === 'INSERT' && msg.sender_role === 'user') {
            // si conversation ouverte → pas de badge
            if (uid === selectedUserId.value) return
            chatNotif.unreadByUser[uid] = (chatNotif.unreadByUser[uid] ?? 0) + 1
            conversations.value = conversations.value
              .map((c) =>
                c.user_id === uid
                  ? {
                      ...c,
                      last_message: msg.content,
                      last_message_at: msg.created_at,
                      unread_count: chatNotif.unreadByUser[uid] ?? 0, // ✅ fix
                    }
                  : c,
              )
              .sort((a, b) => {
                const t1 = new Date(a.last_message_at ?? 0).getTime()
                const t2 = new Date(b.last_message_at ?? 0).getTime()
                return t2 - t1
              })
          }
        },
      )
      .subscribe()
  }

  /* -------------------- SELECT CONVERSATION -------------------- */
  const selectConversation = async (uid: string) => {
    selectedUserId.value = uid
    await fetchMessages(uid)
    subscribeRealtime(uid)

    /* ✅ mark last message as read */
    const lastUserMsg = messages.value.filter((m) => m.sender_role === 'user').at(-1)
    if (lastUserMsg) await chatNotif.markAsRead(uid, lastUserMsg.id)

    chatNotif.unreadByUser[uid] = 0

    conversations.value = conversations.value.map((c) =>
      c.user_id === uid ? { ...c, unread_count: 0 } : c,
    )
  }

  /* -------------------- SEND MESSAGE -------------------- */
  const sendMessage = async () => {
    if (!newMessage.value.trim() || !selectedUserId.value) return

    const content = newMessage.value
    newMessage.value = ''

    // pas de push → realtime s’en charge
    await chatApi.sendMessage(selectedUserId.value, role, content)
  }

  /* -------------------- UTILS -------------------- */
  const scroll = () => {
    const el = document.querySelector('.chat-messages') as HTMLElement | null
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }

  /* -------------------- LIFECYCLE -------------------- */
  onMounted(() => {
    fetchConversations()
    ensureTypingChannel()
    chatNotif.fetchUnreadByUser()
    chatNotif.listenRealtime()
    subscribeRealtime(null)
    subscribeConversationRealtime()
    subscribeUnreadGlobal()
  })

  onUnmounted(() => {
    if (typingChannel) supabase.removeChannel(typingChannel)
    if (msgChannel) supabase.removeChannel(msgChannel)
    if (convChannel) supabase.removeChannel(convChannel)
    if (unreadChannel) supabase.removeChannel(unreadChannel)
  })

  return {
    messages,
    conversations,
    newMessage,
    selectedUserId,
    isMessagesLoading,
    isTypingByUser,
    fetchConversations,
    sendMessage,
    selectConversation,
    sendTyping,
  }
}
