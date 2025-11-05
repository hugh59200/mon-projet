import { supabase } from '@/supabase/supabaseClient'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { reactive, ref } from 'vue'
import { chatApi } from '../services/chatApi'
import type { ChatRole, Message } from '../types/chat'
import type { useScrollMessages } from './useScrollMessages'

const PAGE_SIZE = 30

interface UseChatMessagesOptions {
  role: ChatRole
  getActiveUser: () => string | null
  onUnread?: (userId: string) => void
  scroll?: ReturnType<typeof useScrollMessages>
}

export function useChatMessages({ role, getActiveUser, onUnread, scroll }: UseChatMessagesOptions) {
  const messages = ref<Message[]>([])
  const isMessagesLoading = ref(false)
  const hasMore = ref(true)
  const oldest = ref<string | null>(null)

  let channel: RealtimeChannel | null = null
  let unreadChannel: RealtimeChannel | null = null

  /** ✅ Marquer comme lus (avec senderRole obligatoire) */
  let readTimeout: number | undefined
  const markRead = () => {
    const uid = getActiveUser()
    if (!uid) return

    if (readTimeout) clearTimeout(readTimeout)
    readTimeout = window.setTimeout(() => {
      const unreadFrom: ChatRole = role === 'admin' ? 'user' : 'admin'
      chatApi.markMessagesAsRead(uid, unreadFrom)
    }, 300)
  }

  /** ✅ Charger les 30 derniers */
  const fetchInitialMessages = async (uid: string) => {
    isMessagesLoading.value = true
    try {
      const { data, error } = await chatApi.fetchMessages(uid, PAGE_SIZE)
      if (error) throw error

      messages.value = (data ?? []).map((m) => reactive(m))
      hasMore.value = (data?.length ?? 0) === PAGE_SIZE
      oldest.value = data?.[0]?.created_at ?? null
    } finally {
      isMessagesLoading.value = false
    }

    await scroll?.scrollToEnd(true)
    markRead()
  }

  /** ✅ Pagination */
  const loadOlderMessages = async () => {
    if (!hasMore.value || !oldest.value || isMessagesLoading.value) return

    const uid = getActiveUser()
    if (!uid) return

    isMessagesLoading.value = true
    const prevHeight = scroll?.getScrollEl()?.scrollHeight ?? 0

    try {
      const { data, error } = await chatApi.fetchMessagesBefore(uid, oldest.value, PAGE_SIZE)
      if (error) throw error

      if (!data?.length) {
        hasMore.value = false
        return
      }

      messages.value.unshift(...data.map((m) => reactive(m)))
      oldest.value = data[0]?.created_at ?? null
    } finally {
      isMessagesLoading.value = false
      scroll?.keepScrollOnPrepend(prevHeight)
    }
  }

  /** ✅ Envoi message (role requis) */
  const sendMessage = async (text: string) => {
    const uid = getActiveUser()
    if (!uid || !text.trim()) return

    await chatApi.sendMessage(uid, role, text.trim())
  }

  /** ✅ Abonnement unread global (admin) — léger */
  const subscribeUnreadForAdmin = () => {
    if (unreadChannel) supabase.removeChannel(unreadChannel)
    if (role !== 'admin' || !onUnread) return

    unreadChannel = supabase.channel('chat-admin-unread', {
      config: { broadcast: { self: false } },
    })

    unreadChannel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: 'sender_role=eq.user' },
      (payload) => {
        const msg = payload.new as Message
        const active = getActiveUser()
        if (msg?.user_id && msg.user_id !== active) onUnread(msg.user_id)
      },
    )

    unreadChannel.subscribe()
  }

  /** ✅ Realtime propre (filtré par user_id) */
  const subscribeRealtime = (target: string | null) => {
    if (channel) supabase.removeChannel(channel)

    // pas d'abonnement si pas de cible (ex: admin sans thread sélectionné)
    if (!target) return

    const filter = `user_id=eq.${target}`

    channel = supabase.channel(`chat-${role}-${target}`, {
      config: { broadcast: { self: false } },
    })

    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter },
      async (payload) => {
        const msg: Message = payload.new as Message
        if (!msg?.user_id) return
        messages.value.push(reactive(msg))
        await scroll?.scrollToEnd(true)
        markRead()
      },
    )

    channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages', filter },
      (payload) => {
        const updated: Message = payload.new as Message
        const idx = messages.value.findIndex((m) => m.id === updated.id)
        if (idx !== -1) messages.value[idx] = reactive({ ...messages.value[idx], ...updated })
      },
    )

    channel.subscribe()
  }

  const cleanup = () => {
    if (readTimeout) clearTimeout(readTimeout)
    if (channel) supabase.removeChannel(channel)
    if (unreadChannel) supabase.removeChannel(unreadChannel)
    channel = null
    unreadChannel = null
  }

  return {
    messages,
    hasMore,
    isMessagesLoading,
    fetchInitialMessages,
    loadOlderMessages,
    sendMessage,
    subscribeRealtime,
    subscribeUnreadForAdmin,
    cleanup,
  }
}
