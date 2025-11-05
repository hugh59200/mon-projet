import { supabase } from '@/supabase/supabaseClient'
import type { Database } from '@/supabase/types/supabase'
import { nextTick, reactive, ref } from 'vue'
import { chatApi } from '../services/chatApi'
import type { ChatRole, Message } from '../types/chat'

type MessageRow = Database['public']['Tables']['messages']['Row']
const PAGE_SIZE = 30

export function useChatMessages(
  role: ChatRole,
  userIdRef: () => string | null,
  selectedUserRef: () => string | null,
  onUnread?: (uid: string) => void,
  getScrollEl?: () => HTMLElement | null, // 🚀 scroll déporté à la vue
) {
  const messages = ref<Message[]>([])
  const isMessagesLoading = ref(false)
  const oldestMessageDate = ref<string | null>(null)
  const hasMore = ref(true)

  let realtimeChannel: ReturnType<typeof supabase.channel> | null = null

  const getActiveUser = () => (role === 'admin' ? selectedUserRef() : userIdRef())

  /** ✅ Scroll helpers */
  const scrollToEnd = async (instant = false) => {
    await nextTick()
    const el = getScrollEl?.()
    if (!el) return

    el.scrollTo({
      top: el.scrollHeight,
      behavior: instant ? 'auto' : 'smooth',
    })
  }

  const keepScrollOnPrepend = async (prevHeight: number) => {
    await nextTick()
    const el = getScrollEl?.()
    if (el) el.scrollTop = el.scrollHeight - prevHeight
  }

  /** ✅ Debounce markAsRead */
  let readTimeout: number | undefined
  const markVisibleAsRead = () => {
    const target = getActiveUser()
    if (!target) return

    clearTimeout(readTimeout)

    readTimeout = window.setTimeout(async () => {
      const unreadFrom = role === 'admin' ? 'user' : 'admin'
      await chatApi.markMessagesAsRead(target, unreadFrom)
    }, 400)
  }

  /** ✅ Load initial */
  const fetchInitialMessages = async (uid: string) => {
    isMessagesLoading.value = true

    const { data } = await chatApi.fetchMessages(uid, PAGE_SIZE)
    messages.value = (data ?? []).map((m) => reactive(m))

    hasMore.value = (data?.length ?? 0) === PAGE_SIZE
    oldestMessageDate.value = data?.[0]?.created_at ?? null

    isMessagesLoading.value = false
    await scrollToEnd(true)
    markVisibleAsRead()
  }

  /** ✅ Pagination */
  const loadOlderMessages = async () => {
    if (!hasMore.value || !oldestMessageDate.value || isMessagesLoading.value) return

    const target = getActiveUser()
    if (!target) return

    isMessagesLoading.value = true

    const prevHeight = getScrollEl?.()?.scrollHeight ?? 0
    const { data } = await chatApi.fetchMessagesBefore(target, oldestMessageDate.value, PAGE_SIZE)

    if (!data?.length) {
      hasMore.value = false
      isMessagesLoading.value = false
      return
    }

    const existing = new Set(messages.value.map((m) => m.id))
    const newOnes = data.filter((m) => !existing.has(m.id))

    messages.value.unshift(...newOnes.map((m) => reactive(m)))
    oldestMessageDate.value = data[0]?.created_at ?? oldestMessageDate.value

    isMessagesLoading.value = false
    keepScrollOnPrepend(prevHeight)
  }

  /** ✅ Send */
  const sendMessage = async (text: string) => {
    const target = getActiveUser()
    if (!target || !text.trim()) return
    await chatApi.sendMessage(target, role, text.trim())
  }

  /** ✅ Realtime */
  const subscribeRealtime = (currentTarget: string | null) => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
    }

    const active = currentTarget || 'none'
    realtimeChannel = supabase.channel(`chat-${role}-${active}`, {
      config: { broadcast: { self: false } },
    })

    /** INSERT */
    realtimeChannel.on<MessageRow>(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      async ({ new: msg }) => {
        if (!msg?.user_id) return
        const activeUser = getActiveUser()

        // ✅ USER → reçoit uniquement ses messages
        if (role === 'user') {
          if (msg.user_id === currentTarget) {
            messages.value.push(reactive(msg))
            await scrollToEnd(true)
            markVisibleAsRead()
          }
          return
        }

        // ✅ ADMIN
        if (role === 'admin') {
          if (msg.user_id === activeUser) {
            messages.value.push(reactive(msg))
            await scrollToEnd(true)
            markVisibleAsRead()
          } else if (onUnread) {
            onUnread(msg.user_id)
          }
        }
      },
    )

    /** UPDATE → read receipts */
    realtimeChannel.on<MessageRow>(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages' },
      ({ new: msg }) => {
        const i = messages.value.findIndex((m) => m.id === msg.id)
        if (i !== -1) {
          messages.value[i] = reactive({ ...messages.value[i], ...msg })
        }
      },
    )

    realtimeChannel.subscribe()
  }

  /** ✅ Cleanup */
  const cleanup = () => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
    }
  }

  return {
    messages,
    hasMore,
    isMessagesLoading,
    sendMessage,
    loadOlderMessages,
    fetchInitialMessages,
    subscribeRealtime,
    cleanup,
  }
}
