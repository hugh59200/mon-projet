import { useAuthStore } from '@/features/auth/useAuthStore'
import { supabase } from '@/supabase/supabaseClient'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { chatApi } from '../shared/services/chatApi'
import { useChatNotifStore } from '../shared/stores/useChatNotifStore'
import type { ChatRole, Message } from '../shared/types/chat'
import { useChatWidgetStore } from './useChatWidgetStore'

export function useUserChat() {
  /* ---------------- STORES ---------------- */
  const auth = useAuthStore()
  const notif = useChatNotifStore()
  const chatWidget = useChatWidgetStore()

  /* ---------------- STATE ---------------- */
  const userId = computed(() => auth.user?.id!)
  const role: ChatRole = 'user'
  const messages = ref<Message[]>([])
  const newMessage = ref('')
  const isTyping = ref(false)
  const isReady = ref(false)
  const errorMessage = ref<string | null>(null)
  const isChatOpen = ref(false)

  /* ---------------- INTERNALS ---------------- */
  let msgChannel: ReturnType<typeof supabase.channel> | null = null
  let typingChannel: ReturnType<typeof supabase.channel> | null = null
  let typingTimer: ReturnType<typeof setTimeout> | null = null
  let observer: MutationObserver | null = null

  /* ---------------- SCROLL UTILS ---------------- */
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

  /* ---------------- TYPING ---------------- */
  const ensureTypingChannel = () => {
    if (typingChannel) return

    typingChannel = supabase.channel('typing-status', {
      config: { broadcast: { self: false } },
    })

    typingChannel
      .on('broadcast', { event: 'admin_typing' }, (e) => {
        if (e.payload.userId !== userId.value) return
        isTyping.value = e.payload.isTyping
      })
      .subscribe()
  }

  const sendTyping = () => {
    ensureTypingChannel()

    typingChannel!.send({
      type: 'broadcast',
      event: 'user_typing',
      payload: { userId: userId.value, isTyping: true },
    })

    clearTimeout(typingTimer!)
    typingTimer = setTimeout(() => {
      typingChannel!.send({
        type: 'broadcast',
        event: 'user_typing',
        payload: { userId: userId.value, isTyping: false },
      })
    }, 1200)
  }

  /* ---------------- FETCH OLD MESSAGES ---------------- */
  const fetchMessages = async () => {
    isReady.value = false
    const { data, error } = await chatApi.fetchMessages(userId.value)

    if (error) {
      errorMessage.value = 'Erreur de chargement des messages.'
      isReady.value = true
      return
    }

    messages.value = (data ?? [])
      .sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime())
      .map((m) => reactive(m))

    isReady.value = true
    await nextTick()
    observeMessages()
    scrollToEnd(true)

    // ✅ Marque comme lus tous les messages admin non lus
    const unread = messages.value.filter((m) => m.sender_role === 'admin' && !m.is_read)
    if (unread.length > 0) {
      const last = unread.at(-1)!
      await notif.markAsRead(userId.value, last.id)

      // ✅ Mise à jour instant UI
      messages.value.forEach((m) => {
        if (m.sender_role === 'admin') m.is_read = true
      })

      chatWidget.resetUnread()
    }
  }

  /* ---------------- REALTIME ---------------- */
  const subscribeRealtime = () => {
    if (msgChannel) supabase.removeChannel(msgChannel)

    msgChannel = supabase
      .channel(`user-messages-${userId.value}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `user_id=eq.${userId.value}` },
        async (payload) => {
          const msg = payload.new as Message
          const idx = messages.value.findIndex((m) => m.id === msg.id)

          /* ✅ INSERT — ajoute seulement si pas déjà dedans */
          if (payload.eventType === 'INSERT' && idx === -1) {
            messages.value.push(reactive(msg))
            await nextTick()
            scrollToEnd(true)

            // ✅ Si message venant de l’admin
            if (msg.sender_role === 'admin') {
              if (isChatOpen.value) {
                await notif.markAsRead(userId.value, msg.id)
                msg.is_read = true
                chatWidget.resetUnread()
              } else {
                chatWidget.incrementUnread()
              }
            }
          }

          /* ✅ UPDATE — on met à jour sans doublon */
          if (payload.eventType === 'UPDATE' && idx !== -1) {
            Object.assign(messages.value[idx]!, msg)
          }
        },
      )
      .subscribe()
  }

  /* ---------------- SEND MESSAGE — pas de doublons ---------------- */
  const sendMessage = async () => {
    if (!newMessage.value.trim()) return
    const content = newMessage.value
    newMessage.value = ''

    // ✅ NE PAS PUSH — laisse Realtime gérer
    await chatApi.sendMessage(userId.value, role, content)
  }

  /* ---------------- INIT ---------------- */
  const initChat = async () => {
    if (!userId.value) return
    await fetchMessages()
    ensureTypingChannel()
    subscribeRealtime()
  }

  /* ---------------- LIFECYCLE ---------------- */
  onMounted(() => initChat())

  onUnmounted(() => {
    if (msgChannel) supabase.removeChannel(msgChannel)
    if (typingChannel) supabase.removeChannel(typingChannel)
    observer?.disconnect()
    clearTimeout(typingTimer!)
  })

  /* ---------------- WATCH ---------------- */
  watch(
    () => messages.value.length,
    async () => {
      await nextTick()
      scrollToEnd()
    },
  )

  return {
    messages,
    newMessage,
    isTyping,
    isReady,
    userId,
    errorMessage,
    sendMessage,
    sendTyping,
    initChat,
    isChatOpen,
  }
}
