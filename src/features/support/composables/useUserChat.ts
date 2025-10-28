import { supabase } from '@/supabase/supabaseClient'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { chatApi } from '../services/chatApi'
import type { ChatRole, Message } from '../types/chat'

export function useUserChat() {
  const role: ChatRole = 'user'

  const messages = ref<Message[]>([])
  const newMessage = ref('')
  const isReady = ref(false)
  const isTyping = ref(false)
  const userId = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)

  let typingTimer: ReturnType<typeof setTimeout> | null = null
  let typingChannel: ReturnType<typeof supabase.channel> | null = null
  let msgChannel: ReturnType<typeof supabase.channel> | null = null
  let observer: MutationObserver | null = null

  /* ------------------------------ Helpers ------------------------------ */
  const getMessagesEl = () =>
    document.querySelector('.chat-messages, .messages-list') as HTMLElement | null

  const scrollToEnd = (instant = false) => {
    const el = getMessagesEl()
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: instant ? 'auto' : 'smooth',
      })
    })
  }

  const observeMessages = () => {
    const el = getMessagesEl()
    if (!el) return
    observer?.disconnect()
    observer = new MutationObserver(() => scrollToEnd())
    observer.observe(el, { childList: true, subtree: true })
  }

  /* ------------------------------ Typing ------------------------------- */
  const ensureTypingChannel = () => {
    if (typingChannel) return
    typingChannel = supabase.channel('typing-status', {
      config: { broadcast: { self: false } },
    })
    typingChannel
      .on('broadcast', { event: 'admin_typing' }, (e) => {
        isTyping.value = e.payload.isTyping
      })
      .subscribe()
  }

  const sendTyping = () => {
    ensureTypingChannel()
    typingChannel!.send({
      type: 'broadcast',
      event: 'user_typing',
      payload: { isTyping: true },
    })
    clearTimeout(typingTimer!)
    typingTimer = setTimeout(
      () =>
        typingChannel!.send({
          type: 'broadcast',
          event: 'user_typing',
          payload: { isTyping: false },
        }),
      1500,
    )
  }

  /* ------------------------------ Messages ------------------------------ */
  const subscribeRealtime = () => {
    if (!userId.value) return
    if (msgChannel) supabase.removeChannel(msgChannel)
    ensureTypingChannel()

    msgChannel = supabase
      .channel(`user-messages-${userId.value}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${userId.value}`,
        },
        async (payload) => {
          const msg = payload.new as Message
          messages.value.unshift(msg)
          await nextTick()
          scrollToEnd()
        },
      )
      .subscribe()
  }

  const fetchMessages = async () => {
    if (!userId.value) return
    isReady.value = false

    const { data, error } = await chatApi.fetchMessages(userId.value)
    if (error) {
      console.error('[fetchMessages]', error)
      errorMessage.value = 'Impossible de charger les messages.'
      isReady.value = true
      return
    }

    messages.value = data ?? []
    isReady.value = true

    await nextTick()
    observeMessages()
    scrollToEnd(true)
    subscribeRealtime()
  }

  const sendMessage = async () => {
    if (!newMessage.value.trim() || !userId.value) return
    const content = newMessage.value
    newMessage.value = ''
    const { error } = await chatApi.sendMessage(userId.value, role, content)
    if (!error) {
      await nextTick()
      scrollToEnd(true)
    }
  }

  /* ------------------------------ Lifecycle ------------------------------ */
  onMounted(async () => {
    const { data } = await supabase.auth.getUser()
    userId.value = data.user?.id ?? null

    if (!userId.value) {
      isReady.value = true
      console.warn('[useUserChat] Aucun utilisateur connecté.')
      return
    }

    await fetchMessages()
    ensureTypingChannel()
  })

  watch(
    () => messages.value.length,
    async () => {
      await nextTick()
      scrollToEnd()
    },
  )

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
    errorMessage,
    sendMessage,
    sendTyping,
    observeMessages,
  }
}
