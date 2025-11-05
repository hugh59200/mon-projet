import { useAuthStore } from '@/features/auth/useAuthStore'
import { supabase } from '@/supabase/supabaseClient'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { computed, ref } from 'vue'
import { chatApi } from '../services/chatApi'
import type { ConversationOverview } from '../types/chat'

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

  /** ✅ Format helpers */
  const formatMessage = (content: string | null) => {
    if (!content) return ''
    return content.length <= 30 ? content : content.slice(0, 27) + '...'
  }

  // Instance unique pour éviter des variations
  const dtf = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  const formatDate = (date: string | null) => (date ? dtf.format(new Date(date)) : '')

  /** ✅ Fetch initial list, sorted newest first */
  const fetchConversations = async () => {
    const { data } = await chatApi.fetchAllConversations()
    const rows = (data ?? [])
      .filter((c) => c.user_id !== null)
      .sort((a, b) => {
        const da = a.last_message_at ? new Date(a.last_message_at).getTime() : 0
        const db = b.last_message_at ? new Date(b.last_message_at).getTime() : 0
        return db - da
      })

    conversations.value = rows.map((c) => ({
      ...c,
      user_id: c.user_id as string,
      last_message_short: formatMessage(c.last_message),
      last_message_date: formatDate(c.last_message_at),
      is_online: onlineUsers.value.has(c.user_id!),
      unread_count: c.unread_count_admin ?? 0,
    }))
  }

  /** ✅ Presence realtime → online / offline badge (ne compte que les users) */
  const setupPresence = () => {
    if (presenceChannel) return

    const presenceKey = auth.user?.id ?? 'anon-admin'

    presenceChannel = supabase.channel('chat-presence', {
      config: { presence: { key: presenceKey } },
    })

    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel!.presenceState() as Record<string, any[]>
      const online = new Set(
        Object.entries(state)
          .filter(([, metas]) => Array.isArray(metas) && metas.some((m: any) => m?.role === 'user'))
          .map(([key]) => key),
      )
      onlineUsers.value = online

      conversations.value = conversations.value.map((c) => ({
        ...c,
        is_online: online.has(c.user_id),
      }))
    })

    presenceChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        presenceChannel!.track({ role: 'admin' })
      }
    })
  }

  /**
   * ✅ Listen realtime messages → update last message + unread + re-sort
   * getActiveUserId? : injection légère pour éviter d'incrémenter le badge si le thread est déjà ouvert
   */
  const listenRealtimeConversations = (getActiveUserId?: () => string | null) => {
    if (messagesChannel) return

    messagesChannel = supabase.channel('chat-conv', {
      config: { broadcast: { self: false } },
    })

    messagesChannel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      ({ new: msg }) => {
        const uid = (msg as any).user_id as string | null
        if (!uid) return

        const item = conversations.value.find((c) => c.user_id === uid)

        if (item) {
          item.last_message = (msg as any).content
          item.last_message_short = formatMessage((msg as any).content)
          item.last_message_at = (msg as any).created_at
          item.last_message_date = formatDate((msg as any).created_at)

          const isUserMsg = (msg as any).sender_role === 'user'
          const isActive = getActiveUserId?.() === uid
          if (isUserMsg && !isActive) {
            item.unread_count = (item.unread_count ?? 0) + 1
          }
        } else {
          // Nouvelle conversation
          fetchConversations()
        }

        conversations.value = [...conversations.value].sort(
          (a, b) =>
            new Date(b.last_message_at ?? 0).getTime() - new Date(a.last_message_at ?? 0).getTime(),
        )
      },
    )

    messagesChannel.subscribe()
  }

  /** ✅ Unread update après markAsRead */
  const refreshUnreadCount = async () => {
    const { data } = await chatApi.fetchAllConversations()
    const rows = (data ?? []).filter((c) => c.user_id !== null)

    const mapped = rows.map((c) => ({
      ...c,
      user_id: c.user_id as string,
      last_message_short: formatMessage(c.last_message ?? ''),
      last_message_date: formatDate(c.last_message_at),
      is_online: onlineUsers.value.has(c.user_id!),
      unread_count: c.unread_count_admin ?? 0,
    }))

    conversations.value = mapped.sort(
      (a, b) =>
        new Date(b.last_message_at ?? 0).getTime() - new Date(a.last_message_at ?? 0).getTime(),
    )
  }

  /** ✅ Cleanup */
  const cleanup = () => {
    if (presenceChannel) {
      supabase.removeChannel(presenceChannel)
      presenceChannel = null
    }
    if (messagesChannel) {
      supabase.removeChannel(messagesChannel)
      messagesChannel = null
    }
  }

  return {
    conversations: computed(() => conversations.value),
    fetchConversations,
    setupPresence,
    listenRealtimeConversations,
    refreshUnreadCount,
    cleanup,
  }
}
