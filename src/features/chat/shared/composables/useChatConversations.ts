import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { supabase } from '@/supabase/supabaseClient'
import type { RealtimeChannel, RealtimePostgresInsertPayload } from '@supabase/supabase-js'
import { computed, ref } from 'vue'
import { chatApi } from '../services/chatApi'
import type { ConversationOverview, Message } from '../types/chat'

interface ExtendedConversation extends ConversationOverview {
  last_message_short: string
  last_message_date: string
  is_online: boolean
  unread_count: number
  user_id: string
}

export function useChatConversations() {
  const auth = useAuthStore()
  const conversations = ref<ExtendedConversation[]>([])
  const onlineUsers = ref<Set<string>>(new Set())

  let presenceChannel: RealtimeChannel | null = null
  let messagesChannel: RealtimeChannel | null = null

  /** --- 🔧 Format helpers --- **/
  const formatMessage = (content: string | null): string => {
    if (!content) return ''
    const flat = content.replace(/\s+/g, ' ') // supprime les sauts de ligne
    return flat.length <= 30 ? flat : flat.slice(0, 27) + '...'
  }

  const toTs = (d?: string | null): number => (d ? Date.parse(d) || 0 : 0)

  const dtf = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  })

  const formatDate = (date: string | null): string => (date ? dtf.format(new Date(toTs(date))) : '')

  /** --- 📥 Fetch initial list --- **/
  const fetchConversations = async (): Promise<void> => {
    const { data } = await chatApi.fetchAllConversations()
    const rows = (data ?? [])
      .filter((c) => c.user_id !== null)
      .sort((a, b) => toTs(b.last_message_at) - toTs(a.last_message_at))

    conversations.value = rows.map((c) => ({
      ...c,
      user_id: c.user_id as string,
      last_message_short: formatMessage(c.last_message ?? ''),
      last_message_date: formatDate(c.last_message_at),
      is_online: onlineUsers.value.has(c.user_id as string),
      unread_count: c.unread_count_admin ?? 0,
    }))
  }

  /** --- 🟢 Presence realtime --- **/
  const setupPresence = (): void => {
    if (presenceChannel) return

    const presenceKey = auth.user?.id ?? 'anon-admin'

    presenceChannel = supabase.channel('chat-presence', {
      config: { presence: { key: presenceKey } },
    })

    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel!.presenceState() as Record<string, Array<{ role: string }>>
      const online = new Set(
        Object.entries(state)
          .filter(([, metas]) => metas.some((m) => m.role === 'user'))
          .map(([key]) => key),
      )

      onlineUsers.value = online

      conversations.value = conversations.value.map((c) => ({
        ...c,
        is_online: online.has(c.user_id),
      }))
    })

    presenceChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') presenceChannel!.track({ role: 'admin' })
      if (status === 'CHANNEL_ERROR') console.warn('presence channel error')
      if (status === 'CLOSED') console.info('presence channel closed')
    })
  }

  /** --- 💬 Realtime messages --- **/
  const listenRealtimeConversations = (getActiveUserId?: () => string | null): void => {
    if (messagesChannel) return

    messagesChannel = supabase.channel('chat-conv', {
      config: { broadcast: { self: false } },
    })

    messagesChannel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload: RealtimePostgresInsertPayload<Message>) => {
        const msg = payload.new
        const uid = msg.user_id
        if (!uid) return

        const item = conversations.value.find((c) => c.user_id === uid)

        if (item) {
          item.last_message = msg.content
          item.last_message_short = formatMessage(msg.content ?? '')
          item.last_message_at = msg.created_at
          item.last_message_date = formatDate(msg.created_at)

          const isUserMsg = msg.sender_role === 'user'
          const isActive = getActiveUserId?.() === uid

          if (isUserMsg && !isActive) {
            item.unread_count = (item.unread_count ?? 0) + 1
          }
        } else {
          // Nouvelle conversation détectée → on recharge
          void fetchConversations()
        }

        conversations.value = [...conversations.value].sort(
          (a, b) => toTs(b.last_message_at) - toTs(a.last_message_at),
        )
      },
    )

    messagesChannel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR') console.warn('messages channel error')
      if (status === 'CLOSED') console.info('messages channel closed')
    })
  }

  /** --- 🔄 Refresh unread count --- **/
  const refreshUnreadCount = async (): Promise<void> => {
    const { data } = await chatApi.fetchAllConversations()
    const rows = (data ?? []).filter((c) => c.user_id !== null)

    const mapped = rows.map((c) => ({
      ...c,
      user_id: c.user_id as string,
      last_message_short: formatMessage(c.last_message ?? ''),
      last_message_date: formatDate(c.last_message_at),
      is_online: onlineUsers.value.has(c.user_id as string),
      unread_count: c.unread_count_admin ?? 0,
    }))

    conversations.value = mapped.sort((a, b) => toTs(b.last_message_at) - toTs(a.last_message_at))
  }

  /** --- 🧹 Cleanup channels --- **/
  const cleanup = (): void => {
    if (presenceChannel) {
      void supabase.removeChannel(presenceChannel)
      presenceChannel = null
    }
    if (messagesChannel) {
      void supabase.removeChannel(messagesChannel)
      messagesChannel = null
    }
  }

  /** --- 🧾 Return composable API --- **/
  return {
    conversations: computed(() => conversations.value),
    fetchConversations,
    setupPresence,
    listenRealtimeConversations,
    refreshUnreadCount,
    cleanup,
  }
}
