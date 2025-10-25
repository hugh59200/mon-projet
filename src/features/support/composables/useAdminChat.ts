import { supabase } from '@/services/supabaseClient'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useChatNotifStore } from '../stores/useChatNotifStore'
import type { ChatRole, Conversation, Message } from '../types/chat'

export function useAdminChat() {
  const role: ChatRole = 'admin'
  const chatNotif = useChatNotifStore()

  /* -------------------------------------------------------------------------- */
  /* 🧱 States                                                                  */
  /* -------------------------------------------------------------------------- */
  const messages = ref<Message[]>([])
  const newMessage = ref('')
  const isReady = ref(false)
  const conversations = ref<Conversation[]>([])
  const selectedUserId = ref<string | null>(null)
  const isTyping = ref(false) // 👈 indique si l'utilisateur tape

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
        console.warn('[useAdminChat] cleanup error:', e)
      }
    }
    channels.length = 0
  }

  function scrollToEnd() {
    const el = document.querySelector('.messages-list, .chat-messages') as HTMLElement | null
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
  /* 💬 Conversations + Messages                                                */
  /* -------------------------------------------------------------------------- */
  async function fetchConversations() {
    isReady.value = false
    const { data, error } = await supabase
      .from('messages')
      .select(`user_id, content, created_at, profiles(email)`)
      .order('created_at', { ascending: false })

    if (error || !data) return console.error('[fetchConversations]', error)

    const map = new Map<string, Conversation>()
    for (const msg of data) {
      if (msg.user_id && !map.has(msg.user_id)) {
        map.set(msg.user_id, {
          user_id: msg.user_id,
          user_email: msg.profiles?.email,
          lastMessagePreview: msg.content.slice(0, 50),
          lastDate: msg.created_at,
        })
      }
    }
    conversations.value = [...map.values()]
    isReady.value = true
  }

  async function fetchMessages(userId: string) {
    if (!userId) return
    isReady.value = false

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) return console.error('[fetchMessages]', error)
    messages.value = data ?? []
    isReady.value = true
    subscribeRealtime(userId)
  }

  /* -------------------------------------------------------------------------- */
  /* 🔔 Realtime                                                                */
  /* -------------------------------------------------------------------------- */
  function subscribeRealtime(userId: string) {
    cleanup()

    const msgCh = supabase
      .channel(`admin-messages-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${userId}` },
        (payload) => {
          messages.value.push(payload.new as Message)
          scrollToEnd()
        },
      )
      .subscribe()

    // ✅ L’admin écoute les "user_typing"
    const typingCh = supabase.channel('typing-status', { config: { broadcast: { self: false } } })
    typingCh
      .on('broadcast', { event: 'user_typing' }, (payload: { payload: { isTyping: boolean } }) => {
        isTyping.value = payload.payload.isTyping // ✅ correction ici
      })
      .subscribe()

    channels.push(msgCh, typingCh)
  }

  /* -------------------------------------------------------------------------- */
  /* ✉️ Send + Typing + Select                                                  */
  /* -------------------------------------------------------------------------- */
  async function sendMessage() {
    if (!newMessage.value.trim() || !selectedUserId.value) return

    const { error } = await supabase.from('messages').insert({
      user_id: selectedUserId.value,
      sender_role: role,
      content: newMessage.value,
      created_at: new Date().toISOString(),
    })

    if (!error) {
      newMessage.value = ''
      scrollToEnd()
    }
  }

  // ✅ L’admin envoie "admin_typing"
  function handleInput() {
    sendTyping('admin_typing')
  }

  async function selectConversation(uid: string) {
    selectedUserId.value = uid
    await fetchMessages(uid)
    await chatNotif.markAsRead(uid)
  }

  /* -------------------------------------------------------------------------- */
  /* ♻️ Lifecycle                                                               */
  /* -------------------------------------------------------------------------- */
  onMounted(fetchConversations)
  onUnmounted(cleanup)

  return {
    type: role,
    messages,
    newMessage,
    isTyping,
    isReady,
    conversations,
    selectedUserId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    selectConversation,
    handleInput,
  }
}
