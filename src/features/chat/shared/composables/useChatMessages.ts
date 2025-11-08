import { supabase } from '@/supabase/supabaseClient'
import type { Messages } from '@/supabase/types/supabase.types'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { ref } from 'vue'
import { chatApi } from '../services/chatApi'
import type { ChatRole } from '../types/chat'
import type { useScrollMessages } from './useScrollMessages'

const PAGE_SIZE = 30

interface UseChatMessagesOptions {
  role: ChatRole
  getActiveUser: () => string | null
  onUnread?: (userId: string) => void
  onMarkedRead?: () => void | Promise<void>
  scroll?: ReturnType<typeof useScrollMessages>
}

// Typage léger pour les payloads realtime
type RealtimeMessageRow = {
  id: string | number
  user_id: string | null
  content: string | null
  created_at: string | null
  sender_role: ChatRole
}

export function useChatMessages({
  role,
  getActiveUser,
  onUnread,
  onMarkedRead,
  scroll,
}: UseChatMessagesOptions) {
  const messages = ref<Messages[]>([])
  const isMessagesLoading = ref(false)
  const hasMore = ref(true)
  const oldest = ref<string | null>(null)

  let channel: RealtimeChannel | null = null
  let unreadChannel: RealtimeChannel | null = null

  // Supporte id number | string selon DB, mais uniformisé en string
  const seenIds = new Set<string>()
  const keyOf = (id: unknown) => String(id)

  // anti-race sur fetchInitialMessages
  let lastFetchTarget: string | null = null

  const ingest = (m: Messages) => {
    if (!m?.id) return
    const key = keyOf(m.id)
    if (seenIds.has(key)) {
      const idx = messages.value.findIndex((x) => x.id === m.id)
      if (idx !== -1) messages.value[idx] = { ...messages.value[idx], ...m }
      return
    }
    seenIds.add(key)
    messages.value.push(m)
  }

  /** Marquer comme lus (avec senderRole obligatoire) */
  let readTimeout: ReturnType<typeof setTimeout> | undefined
  const markRead = () => {
    const uid = getActiveUser()
    if (!uid) return

    if (readTimeout) clearTimeout(readTimeout)
    readTimeout = setTimeout(async () => {
      const unreadFrom: ChatRole = role === 'admin' ? 'user' : 'admin'
      await chatApi.markMessagesAsRead(uid, unreadFrom)
      await onMarkedRead?.()
    }, 800) // debounce un poil plus long pour réduire les hits API
  }

  /** Charger les 30 derniers (ordre chronologique) */
  const fetchInitialMessages = async (uid: string) => {
    lastFetchTarget = uid
    isMessagesLoading.value = true
    try {
      const { data, error } = await chatApi.fetchMessages(uid, PAGE_SIZE)
      if (error) throw error

      // si l'utilisateur a basculé de thread entre temps -> on abandonne l'applique
      if (getActiveUser() !== uid || lastFetchTarget !== uid) return

      const list = (data ?? [])
        .slice()
        .sort(
          (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime(),
        )

      messages.value = []
      seenIds.clear()
      list.forEach((m) => ingest(m as Messages))

      hasMore.value = list.length === PAGE_SIZE
      oldest.value = list[0]?.created_at ?? null

      await scroll?.scrollToEnd(true)
      markRead()
    } finally {
      if (lastFetchTarget === uid) isMessagesLoading.value = false
    }
  }

  /** Pagination (prépend en conservant l'ordre) */
  const loadOlderMessages = async () => {
    if (!hasMore.value || !oldest.value || isMessagesLoading.value) return

    const uid = getActiveUser()
    if (!uid) return

    isMessagesLoading.value = true
    const prevHeight = scroll?.getScrollEl()?.scrollHeight ?? 0

    try {
      const { data, error } = await chatApi.fetchMessagesBefore(uid, oldest.value, PAGE_SIZE)
      if (error) throw error

      const batch = data ?? []
      if (!batch.length) {
        hasMore.value = false
        return
      }

      const toPrepend = batch
        .slice()
        .sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateA - dateB
        })
        .map((m) => m as Messages)

      // insère en tête dans l'ordre et enregistre dans seenIds
      toPrepend.forEach((m: any) => {
        const key = keyOf(m.id)
        if (!seenIds.has(key)) seenIds.add(key)
      })
      messages.value.splice(0, 0, ...toPrepend)

      oldest.value = toPrepend[0]?.created_at ?? oldest.value
      hasMore.value = batch.length === PAGE_SIZE
    } finally {
      isMessagesLoading.value = false
      scroll?.keepScrollOnPrepend(prevHeight)
    }
  }

  /** Envoi message (role requis) */
  const sendMessage = async (text: string) => {
    const uid = getActiveUser()
    if (!uid || !text.trim()) return
    await chatApi.sendMessage(uid, role, text.trim())
  }

  /** Abonnement unread global (admin) — léger */
  const subscribeUnreadForAdmin = () => {
    if (unreadChannel) {
      void supabase.removeChannel(unreadChannel)
      unreadChannel = null
    }
    if (role !== 'admin' || !onUnread) return

    unreadChannel = supabase.channel('chat-admin-unread', {
      config: { broadcast: { self: false } },
    })

    unreadChannel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: 'sender_role=eq.user' },
      (payload) => {
        const msg = payload.new as RealtimeMessageRow
        const active = getActiveUser()
        if (msg?.user_id && msg.user_id !== active) onUnread(msg.user_id)
      },
    )

    unreadChannel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR') console.warn('admin unread channel error')
      if (status === 'CLOSED') console.info('admin unread channel closed')
    })
  }

  /** Realtime propre (filtré par user_id) */
  const subscribeRealtime = async (target: string | null) => {
    if (channel) {
      await supabase.removeChannel(channel)
      channel = null
    }

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
        const msg = payload.new as RealtimeMessageRow
        if (!msg?.user_id) return
        ingest(msg as unknown as Messages)
        await scroll?.scrollToEnd(true)
        markRead()
      },
    )

    channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages', filter },
      (payload) => {
        const updated = payload.new as RealtimeMessageRow
        const idx = messages.value.findIndex((m) => m.id === (updated as any).id)
        if (idx !== -1) messages.value[idx] = { ...messages.value[idx], ...(updated as any) }
      },
    )

    channel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR') console.warn('messages channel error')
      if (status === 'CLOSED') console.info('messages channel closed')
    })
  }

  const cleanup = () => {
    if (readTimeout) clearTimeout(readTimeout)
    if (channel) void supabase.removeChannel(channel)
    if (unreadChannel) void supabase.removeChannel(unreadChannel)
    channel = null
    unreadChannel = null
    seenIds.clear()
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
