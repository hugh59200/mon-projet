import { supabase } from '@/services/supabaseClient'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { ChatRole, Message } from '../types/chat'

export function useUserChat() {
  const role: ChatRole = 'user'

  /* -------------------------------------------------------------------------- */
  /* 🧱 States                                                                  */
  /* -------------------------------------------------------------------------- */
  const messages = ref<Message[]>([])
  const newMessage = ref('')
  const isReady = ref(false)
  const userId = ref<string | null>(null)
  const isTyping = ref(false) // 👈 indique si l’admin est en train d’écrire

  let typingTimer: ReturnType<typeof setTimeout> | null = null
  const channels: any[] = []

  /* -------------------------------------------------------------------------- */
  /* 🧹 Helpers                                                                 */
  /* -------------------------------------------------------------------------- */
  function cleanup() {
    for (const ch of channels) {
      try {
        supabase.removeChannel(ch)
      } catch (e) {
        console.warn('[useUserChat] cleanup error', e)
      }
    }
    channels.length = 0
  }

  function scrollToEnd() {
    const el = document.querySelector('.chat-messages') as HTMLElement | null
    if (!el) return
    nextTick(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }))
  }

  function sendTyping(event: 'user_typing' | 'admin_typing') {
    const channel = supabase.channel('typing-status', { config: { broadcast: { self: false } } })
    channels.push(channel)
    channel.send({ type: 'broadcast', event, payload: { isTyping: true } })
    if (typingTimer) clearTimeout(typingTimer)
    typingTimer = setTimeout(() => {
      channel.send({ type: 'broadcast', event, payload: { isTyping: false } })
    }, 1500)
  }

  /* -------------------------------------------------------------------------- */
  /* 🔐 Init User + Messages                                                    */
  /* -------------------------------------------------------------------------- */
  async function initUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.error('[useUserChat:initUser]', error)
      return
    }
    userId.value = data.user?.id ?? null
    if (userId.value) await fetchMessages()
    isReady.value = true
  }

  async function fetchMessages() {
    if (!userId.value) return
    isReady.value = false

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId.value)
      .order('created_at', { ascending: true })

    if (error) return console.error('[fetchMessages]', error)
    messages.value = data ?? []
    isReady.value = true
    subscribeRealtime()
  }

  /* -------------------------------------------------------------------------- */
  /* 🔔 Realtime                                                                */
  /* -------------------------------------------------------------------------- */
  function subscribeRealtime() {
    cleanup()

    const msgCh = supabase
      .channel(`messages-${userId.value}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${userId.value}`,
        },
        (payload: RealtimePostgresChangesPayload<Message>) => {
          messages.value.push(payload.new as Message)
          nextTick(scrollToEnd)
        },
      )
      .subscribe()

    // ✅ L'utilisateur écoute les "admin_typing"
    const typingCh = supabase.channel('typing-status', { config: { broadcast: { self: false } } })
    typingCh
      .on('broadcast', { event: 'admin_typing' }, (payload: { payload: { isTyping: boolean } }) => {
        isTyping.value = payload.payload.isTyping
      })
      .subscribe()

    channels.push(msgCh, typingCh)
  }

  /* -------------------------------------------------------------------------- */
  /* ✉️ Send Message + Input                                                    */
  /* -------------------------------------------------------------------------- */
  async function sendMessage() {
    const text = newMessage.value.trim()
    if (!text || !userId.value) return

    const { error } = await supabase.from('messages').insert({
      user_id: userId.value,
      sender_role: role,
      content: text,
      created_at: new Date().toISOString(),
    })

    if (error) return console.error('[sendMessage]', error)
    newMessage.value = ''
    nextTick(scrollToEnd)
  }

  // ✅ L’utilisateur envoie "user_typing"
  function handleInput() {
    sendTyping('user_typing')
  }

  /* -------------------------------------------------------------------------- */
  /* ♻️ Lifecycle                                                               */
  /* -------------------------------------------------------------------------- */
  onMounted(initUser)
  onUnmounted(cleanup)

  return {
    type: role,
    messages,
    newMessage,
    isTyping,
    isReady,
    fetchMessages,
    sendMessage,
    handleInput,
  }
}
