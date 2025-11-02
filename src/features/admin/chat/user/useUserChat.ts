import { useAuthStore } from '@/features/auth/useAuthStore'
import { supabase } from '@/supabase/supabaseClient'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { chatApi } from '../shared/services/chatApi'
import { useChatNotifStore } from '../shared/stores/useChatNotifStore'
import type { ChatRole, Message } from '../shared/types/chat'
import { useChatWidgetStore } from './useChatWidgetStore'

export function useUserChat() {
  /* ------------------------------ Stores ------------------------------ */
  const auth = useAuthStore()
  const notif = useChatNotifStore()
  const chatWidget = useChatWidgetStore()

  /* ------------------------------ State ------------------------------ */
  const userId = computed(() => auth.user?.id ?? null)
  const role: ChatRole = 'user'
  const isChatOpen = ref(false)
  const messages = ref<Message[]>([])
  const newMessage = ref('')
  const isTyping = ref(false)
  const isReady = ref(false)
  const errorMessage = ref<string | null>(null)

  /* ------------------------------ Internals ------------------------------ */
  let msgChannel: ReturnType<typeof supabase.channel> | null = null
  let typingChannel: ReturnType<typeof supabase.channel> | null = null
  let typingTimer: ReturnType<typeof setTimeout> | null = null
  let observer: MutationObserver | null = null

  /* ------------------------------ Scroll ------------------------------ */
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

  /* ------------------------------ Typing ------------------------------ */
  const ensureTypingChannel = () => {
    if (typingChannel) return
    typingChannel = supabase.channel('typing-status', {
      config: { broadcast: { self: false } },
    })

    // ✅ L'utilisateur écoute l'admin
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

  /* ------------------------------ Messages ------------------------------ */
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

    // ✅ Marque tous les messages admin comme lus à l’ouverture
    if (messages.value.some((m) => m.sender_role === 'admin' && !m.is_read)) {
      const lastAdminMsg = messages.value.filter((m) => m.sender_role === 'admin').at(-1)
      await notif.markAsRead(userId.value, lastAdminMsg?.id)
      messages.value.forEach((m) => {
        if (m.sender_role === 'admin') m.is_read = true
      })
    }
  }

  /* ------------------------------ Realtime ------------------------------ */
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

          // ➕ Nouveau message reçu
          if (payload.eventType === 'INSERT' && idx === -1) {
            messages.value.push(reactive(msg))
            await nextTick()
            scrollToEnd()

            // 👂 Si message vient de l’admin
            if (msg.sender_role === 'admin') {
              if (isChatOpen.value) {
                // ✅ Chat ouvert → on marque lu direct
                await notif.markAsRead(userId.value, msg.id)
                msg.is_read = true
                chatWidget.resetUnread()
              } else {
                // 🚨 Chat fermé → incrémente le badge rouge local
                chatWidget.incrementUnread()
              }
            }
          }

          // 🔁 Mise à jour message
          if (payload.eventType === 'UPDATE' && idx !== -1) {
            Object.assign(messages.value[idx] ?? {}, msg)
          }
        },
      )
      .subscribe()
  }

  /* ------------------------------ Envoi message ------------------------------ */
  const sendMessage = async () => {
    if (!newMessage.value.trim()) return
    const content = newMessage.value
    newMessage.value = ''

    const { data, error } = await chatApi.sendMessage(userId.value, role, content)
    if (!error && data) {
      messages.value.push(reactive(data))
      await nextTick()
      scrollToEnd(true)
    }
  }

  /* ------------------------------ Lifecycle ------------------------------ */
  const initChat = async () => {
    if (!userId.value) {
      console.warn('[initChat] userId manquant')
      return
    }
    await fetchMessages()
    ensureTypingChannel()
    subscribeRealtime()
  }

  onMounted(() => {
    initChat()
  })

  onUnmounted(() => {
    if (msgChannel) supabase.removeChannel(msgChannel)
    if (typingChannel) supabase.removeChannel(typingChannel)
    observer?.disconnect()
    clearTimeout(typingTimer!)
  })

  /* ------------------------------ Watchers ------------------------------ */
  watch(
    () => messages.value.length,
    async () => {
      await nextTick()
      scrollToEnd()
    },
  )

  /* ------------------------------ Return ------------------------------ */
  return {
    messages,
    newMessage,
    isTyping,
    isReady,
    errorMessage,
    sendMessage,
    sendTyping,
    initChat,
    isChatOpen,
  }
}
