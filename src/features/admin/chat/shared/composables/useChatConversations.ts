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

  const formatDate = (date: string | null) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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

  /** ✅ Presence realtime → online / offline badge */
  const setupPresence = () => {
    if (presenceChannel) return

    const presenceKey = auth.user?.id ?? 'anon-admin'

    presenceChannel = supabase.channel('chat-presence', {
      config: { presence: { key: presenceKey } },
    })

    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel!.presenceState()
      const online = new Set(Object.keys(state))
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

  /** ✅ Listen realtime messages → update last message + unread + re-sort */
  const listenRealtimeConversations = () => {
    if (messagesChannel) return

    messagesChannel = supabase.channel('chat-conv', {
      config: { broadcast: { self: false } },
    })

    messagesChannel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      ({ new: msg }) => {
        const uid = msg.user_id
        if (!uid) return

        const item = conversations.value.find((c) => c.user_id === uid)

        if (item) {
          item.last_message = msg.content
          item.last_message_short = formatMessage(msg.content)
          item.last_message_at = msg.created_at
          item.last_message_date = formatDate(msg.created_at)

          if (msg.sender_role === 'user') {
            item.unread_count = (item.unread_count ?? 0) + 1
          }
        } else {
          // Nouvelle conversation
          fetchConversations()
        }

        conversations.value = [...conversations.value].sort(
          (a, b) => new Date(b.last_message_at!).getTime() - new Date(a.last_message_at!).getTime(),
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
