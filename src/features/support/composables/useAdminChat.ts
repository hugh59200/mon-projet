import { supabase } from '@/services/supabaseClient'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useChatNotifStore } from '../stores/useChatNotifStore'
import { useChatScrollStore } from '../stores/useChatScrollStore'
import type { ChatRole, Conversation, Message } from '../types/chat'

export function useAdminChat() {
  const role: ChatRole = 'admin'
  const chatNotif = useChatNotifStore()
  const scrollStore = useChatScrollStore()

  const messages = ref<Message[]>([])
  const conversations = ref<Conversation[]>([])
  const newMessage = ref('')
  const selectedUserId = ref<string | null>(null)
  const isReady = ref(false)
  const isMessagesLoading = ref(false)
  const isTyping = ref(false)

  let typingTimer: ReturnType<typeof setTimeout> | null = null
  let typingChannel: ReturnType<typeof supabase.channel> | null = null
  let msgChannel: ReturnType<typeof supabase.channel> | null = null
  let observer: MutationObserver | null = null

  /* ---------------------------------- Helpers ---------------------------------- */
  const getMessagesEl = () =>
    document.querySelector('.messages-list') as HTMLElement | null

  const scrollToEnd = (force = false) => {
    const el = getMessagesEl()
    if (!el) return
    requestAnimationFrame(() => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100 || force
      if (nearBottom) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    })
  }

  const observeMessages = () => {
    const el = getMessagesEl()
    if (!el) return
    observer?.disconnect()
    observer = new MutationObserver(() => scrollToEnd())
    observer.observe(el, { childList: true, subtree: true })
  }

  const ensureTypingChannel = () => {
    if (typingChannel) return
    typingChannel = supabase.channel('typing-status', { config: { broadcast: { self: false } } })
    typingChannel
      .on('broadcast', { event: 'user_typing' }, (e) => (isTyping.value = e.payload.isTyping))
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

  /* -------------------------------- Conversations -------------------------------- */
  const fetchConversations = async () => {
    isReady.value = false
    const { data, error } = await supabase
      .from('messages')
      .select('user_id, content, created_at, profiles(email)')
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('[fetchConversations]', error)
      return
    }

    const map = new Map<string, Conversation>()
    data.forEach((msg) => {
      if (!msg.user_id || map.has(msg.user_id)) return
      map.set(msg.user_id, {
        user_id: msg.user_id,
        user_email: msg.profiles?.email,
        lastMessagePreview: msg.content.slice(0, 50),
        lastDate: msg.created_at,
      })
    })

    conversations.value = [...map.values()]
    isReady.value = true
  }

  /* ---------------------------------- Messages ---------------------------------- */
  const fetchMessages = async (userId: string) => {
    isMessagesLoading.value = true
    messages.value = []

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[fetchMessages]', error)
      return
    }

    messages.value = data ?? []
    isMessagesLoading.value = false
    subscribeRealtime(userId)
  }

  const subscribeRealtime = (userId: string) => {
    msgChannel && supabase.removeChannel(msgChannel)
    ensureTypingChannel()

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
          messages.value.push(payload.new as Message)
          await nextTick()
          scrollToEnd()
        },
      )
      .subscribe()
  }

  /* ----------------------------------- Scroll ----------------------------------- */
  const restoreScrollAfterMount = async (userId: string) => {
    // attendre la fin de la transition fade-scale (~300ms)
    await new Promise((r) => setTimeout(r, 300))
    const el = getMessagesEl()
    if (!el) return
    const saved = scrollStore.getScroll(userId)
    requestAnimationFrame(() => {
      el.scrollTo({ top: saved, behavior: 'auto' })
    })
    el.onscroll = () => scrollStore.saveScroll(userId, el.scrollTop)
  }

  const selectConversation = async (uid: string) => {
    // sauvegarde la position avant de changer
    if (selectedUserId.value) {
      const el = getMessagesEl()
      if (el) scrollStore.saveScroll(selectedUserId.value, el.scrollTop)
    }

    selectedUserId.value = uid
    await fetchMessages(uid)
    await chatNotif.markAsRead(uid)

    // restauration différée
    restoreScrollAfterMount(uid)
  }

  /* -------------------------------- Envoi message -------------------------------- */
  const sendMessage = async () => {
    if (!newMessage.value.trim() || !selectedUserId.value) return

    const content = newMessage.value
    newMessage.value = ''

    const { error } = await supabase.from('messages').insert({
      user_id: selectedUserId.value,
      sender_role: role,
      content,
      created_at: new Date().toISOString(),
    })

    if (!error) {
      await nextTick()
      scrollToEnd(true)
    }
  }

  /* -------------------------------- Lifecycle -------------------------------- */
  onMounted(() => {
    fetchConversations()
    ensureTypingChannel()
    chatNotif.fetchUnreadByUser()
    chatNotif.listenRealtime()
  })

  onUnmounted(() => {
    typingChannel && supabase.removeChannel(typingChannel)
    msgChannel && supabase.removeChannel(msgChannel)
    observer?.disconnect()
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
    fetchMessages,
    sendMessage,
    selectConversation,
    sendTyping,
    observeMessages,
  }
}
