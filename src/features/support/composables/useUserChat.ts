import { supabase } from '@/services/supabaseClient'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
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

  const cleanup = () => {
    typingChannel && supabase.removeChannel(typingChannel)
    msgChannel && supabase.removeChannel(msgChannel)
    observer?.disconnect()
    typingChannel = msgChannel = observer = null
  }

  const scrollToEnd = (force = false) => {
    const el = document.querySelector('.chat-messages, .messages-list') as HTMLElement | null
    if (!el) return
    requestAnimationFrame(() => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100 || force
      if (nearBottom) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    })
  }

  const observeMessages = () => {
    const el = document.querySelector('.chat-messages, .messages-list') as HTMLElement | null
    if (!el) return
    observer?.disconnect()
    observer = new MutationObserver(() => scrollToEnd())
    observer.observe(el, { childList: true })
  }

  const ensureTypingChannel = () => {
    if (typingChannel) return
    typingChannel = supabase.channel('typing-status', { config: { broadcast: { self: false } } })
    typingChannel
      .on('broadcast', { event: 'admin_typing' }, (e) => (isTyping.value = e.payload.isTyping))
      .subscribe()
  }

  const sendTyping = () => {
    ensureTypingChannel()
    typingChannel!.send({ type: 'broadcast', event: 'user_typing', payload: { isTyping: true } })
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

  const fetchMessages = async () => {
    if (!userId.value) return
    isReady.value = false
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId.value)
      .order('created_at', { ascending: true })

    if (error) console.error('[fetchMessages]', error)

    messages.value = data ?? []
    isReady.value = true
    subscribeRealtime()
    await nextTick()
    observeMessages()
    scrollToEnd(true)
  }

  const subscribeRealtime = () => {
    if (!userId.value) return
    msgChannel && supabase.removeChannel(msgChannel)
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
        (payload) => messages.value.push(payload.new as Message),
      )
      .subscribe()
  }

  const sendMessage = async () => {
    if (!newMessage.value.trim() || !userId.value) return
    const { error } = await supabase.from('messages').insert({
      user_id: userId.value,
      sender_role: role,
      content: newMessage.value,
      created_at: new Date().toISOString(),
    })
    if (!error) {
      newMessage.value = ''
      scrollToEnd(true)
    }
  }

  onMounted(async () => {
    const { data } = await supabase.auth.getUser()
    userId.value = data.user?.id ?? null
    if (!userId.value) {
      isReady.value = true
      console.warn('[useUserChat] Aucun utilisateur connecté.')
      return
    }

    ensureTypingChannel()
    await fetchMessages()
    await nextTick()
    observeMessages()
  })

  watch(
    () => messages.value.length,
    async () => {
      await nextTick()
      scrollToEnd()
    },
  )

  onUnmounted(cleanup)

  return {
    messages,
    newMessage,
    isTyping,
    isReady,
    errorMessage,
    fetchMessages,
    sendMessage,
    sendTyping,
    observeMessages, // 👈 rendu accessible pour le widget
  }
}
