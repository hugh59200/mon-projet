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

  /** ✅ Marquer comme lus (avec senderRole obligatoire) */
  let readTimeout: number | undefined
  const markRead = () => {
    const uid = getActiveUser()
    if (!uid) return

    clearTimeout(readTimeout)
    readTimeout = window.setTimeout(() => {
      const unreadFrom: ChatRole = role === 'admin' ? 'user' : 'admin'
      chatApi.markMessagesAsRead(uid, unreadFrom)
    }, 300)
  }

  /** ✅ Charger les 30 derniers */
  const fetchInitialMessages = async (uid: string) => {
    isMessagesLoading.value = true
    const { data } = await chatApi.fetchMessages(uid, PAGE_SIZE)

    messages.value = (data ?? []).map((m) => reactive(m))
    hasMore.value = (data?.length ?? 0) === PAGE_SIZE
    oldest.value = data?.[0]?.created_at ?? null
    isMessagesLoading.value = false

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

    const { data } = await chatApi.fetchMessagesBefore(uid, oldest.value, PAGE_SIZE)

    if (!data?.length) {
      hasMore.value = false
      isMessagesLoading.value = false
      return
    }

    messages.value.unshift(...data.map((m) => reactive(m)))
    oldest.value = data[0]?.created_at ?? null

    isMessagesLoading.value = false
    scroll?.keepScrollOnPrepend(prevHeight)
  }

  /** ✅ Envoi message (role requis) */
  const sendMessage = async (text: string) => {
    const uid = getActiveUser()
    if (!uid || !text.trim()) return

    await chatApi.sendMessage(uid, role, text.trim())
  }

  /** ✅ Realtime propre ✅ */
  const subscribeRealtime = (target: string | null) => {
    if (channel) supabase.removeChannel(channel)

    channel = supabase.channel(`chat-${role}-${target ?? 'none'}`, {
      config: { broadcast: { self: false } },
    })

    // ✅ Nouvelle syntaxe Supabase TS
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      async (payload) => {
        const msg: Message = payload.new as Message
        if (!msg?.user_id) return

        const active = getActiveUser()

        // ✅ si message du user actif → push + scroll
        if (msg.user_id === active) {
          messages.value.push(reactive(msg))
          await scroll?.scrollToEnd(true)
          markRead()
        }
        // ✅ sinon → notifier unread admin
        else if (onUnread) {
          onUnread(msg.user_id)
        }
      },
    )

    channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages' },
      (payload) => {
        const updated: Message = payload.new as Message
        const idx = messages.value.findIndex((m) => m.id === updated.id)
        if (idx !== -1) messages.value[idx] = reactive({ ...messages.value[idx], ...updated })
      },
    )

    channel.subscribe()
  }

  const cleanup = () => {
    if (channel) supabase.removeChannel(channel)
    channel = null
  }

  return {
    messages,
    hasMore,
    isMessagesLoading,
    fetchInitialMessages,
    loadOlderMessages,
    sendMessage,
    subscribeRealtime,
    cleanup,
  }
}
