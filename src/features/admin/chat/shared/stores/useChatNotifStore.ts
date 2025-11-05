import { useAuthStore } from '@/features/auth/useAuthStore'
import { supabase } from '@/supabase/supabaseClient'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useChatWidgetStore } from '../../user/useChatWidgetStore'
import { chatApi } from '../services/chatApi'
import type { ChatRole, Message } from '../types/chat'

export const useChatNotifStore = defineStore('chatNotif', () => {
  const auth = useAuthStore()
  const chatWidget = useChatWidgetStore()

  /** Rôle actuel (admin ou user) */
  const role = ref<ChatRole>('admin')

  /** Non-lus totaux (affichés sur badge) */
  const unreadCount = ref(0)

  /** Pour admin : non-lus par user */
  const unreadByUser = ref<Record<string, number>>({})

  let realtimeChannel: ReturnType<typeof supabase.channel> | null = null

  const isAdmin = computed(() => role.value === 'admin')

  const setRole = (r: ChatRole) => (role.value = r)

  const computeTotal = () =>
    (unreadCount.value = Object.values(unreadByUser.value).reduce((a, b) => a + b, 0))

  /** Charge état des non lus */
  const fetchUnreadByUser = async () => {
    if (isAdmin.value) {
      const { data } = await supabase.from('messages_unread_view').select('*')

      unreadByUser.value = Object.fromEntries(
        (data ?? []).map((row) => [row.user_id, Number(row.count)]),
      )

      computeTotal()
      return
    }

    /** Pour un user */
    const uid = auth.user?.id
    if (!uid) return

    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', uid)
      .eq('sender_role', 'admin')
      .eq('is_read', false)

    unreadCount.value = count ?? 0
    unreadByUser.value = {}
  }

  /** Marquer une conversation comme lue */
  const markAsRead = async (userId: string, lastMessageId?: number) => {
    const senderRoleToMark = isAdmin.value ? 'user' : 'admin'

    await Promise.all([
      chatApi.markMessagesAsRead(userId, senderRoleToMark),
      chatApi.markConversationRead(userId, lastMessageId),
    ])

    if (isAdmin.value) {
      unreadByUser.value[userId] = 0
      computeTotal()
    } else {
      unreadCount.value = 0
    }
  }

  /** Temps réel — nouveaux messages */
  const listenRealtime = () => {
    if (realtimeChannel) return

    realtimeChannel = supabase.channel('chat-notifications', {
      config: { broadcast: { self: false } },
    })

    realtimeChannel.on<Message>(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        const msg = payload.new
        if (!msg.user_id || msg.is_read) return

        /** USER → message admin */
        if (!isAdmin.value && msg.sender_role === 'admin') {
          if (!chatWidget.isOpen) unreadCount.value++
          return
        }

        /** ADMIN → message user */
        if (isAdmin.value && msg.sender_role === 'user') {
          const uid = msg.user_id

          // si admin a la fenêtre ouverte sur ce user → pas de badge
          if (chatWidget.isOpen && chatWidget.currentUserId === uid) return

          unreadByUser.value[uid] = (unreadByUser.value[uid] ?? 0) + 1
          computeTotal()
        }
      },
    )

    realtimeChannel.subscribe()
  }

  const resetUnread = () => {
    unreadCount.value = 0
    unreadByUser.value = {}
  }

  return {
    role,
    isAdmin,
    unreadCount,
    unreadByUser,

    setRole,
    fetchUnreadByUser,
    listenRealtime,
    markAsRead,
    resetUnread,
  }
})
