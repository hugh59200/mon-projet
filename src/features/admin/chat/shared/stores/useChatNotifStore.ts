import { useChatWidgetStore } from '@/features/admin/chat/user/useChatWidgetStore'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { supabase } from '@/supabase/supabaseClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { chatApi } from '../services/chatApi'
import type { ChatRole, Message } from '../types/chat'

export const useChatNotifStore = defineStore('chatNotif', () => {
  const role = ref<ChatRole>('admin')
  const auth = useAuthStore()
  const chatWidget = useChatWidgetStore()

  const unreadCount = ref<number>(0)
  const unreadByUser = ref<Record<string, number>>({})
  const lastReadByUser = ref<Record<string, number | null>>({})
  let isRealtimeListening = false

  const setRole = (newRole: ChatRole) => {
    role.value = newRole
  }

  /* --------------------- Load unread from DB --------------------- */
  const fetchUnreadByUser = async () => {
    if (role.value === 'admin') {
      const { data } = await supabase.from('messages_unread_view').select('*')
      unreadByUser.value = Object.fromEntries(
        (data ?? []).map((row) => [row.user_id, Number(row.count)]),
      )
      unreadCount.value = Object.values(unreadByUser.value).reduce((a, b) => a + b, 0)
    }

    if (role.value === 'user') {
      const uid = auth.user?.id
      if (!uid) return

      const { data } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('user_id', uid)
        .eq('sender_role', 'admin')
        .eq('is_read', false)

      unreadCount.value = data?.length ?? 0
      unreadByUser.value = {}
    }
  }

  /* --------------------- Mark messages read --------------------- */
  const markAsRead = async (userId: string, lastMessageId?: number) => {
    if (!userId) return

    const senderRoleToMark = role.value === 'admin' ? 'user' : 'admin'
    unreadByUser.value[userId] = 0
    unreadCount.value =
      role.value === 'admin' ? Object.values(unreadByUser.value).reduce((a, b) => a + b, 0) : 0

    await Promise.all([
      chatApi.markMessagesAsRead(userId, senderRoleToMark),
      chatApi.markConversationRead(userId, lastMessageId),
    ])

    if (role.value === 'admin') {
      await fetchUnreadByUser()
    }
  }

  /* --------------------- Realtime NEW messages --------------------- */
  const listenRealtime = () => {
    if (isRealtimeListening) return
    isRealtimeListening = true

    supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const msg = payload.new as Message
          if (!msg.user_id || msg.is_read) return

          const shouldCount =
            (role.value === 'admin' && msg.sender_role === 'user') ||
            (role.value === 'user' && msg.sender_role === 'admin')

          if (!shouldCount) return

          // ✅ chat ouvert → mark as read et aucun badge
          if (chatWidget.isOpen) {
            // await chatApi.markMessagesAsRead(msg.user_id, role.value === 'admin' ? 'user' : 'admin')
            return
          }

          // ✅ chat fermé → badge
          unreadByUser.value[msg.user_id] = (unreadByUser.value[msg.user_id] || 0) + 1
          unreadCount.value = Object.values(unreadByUser.value).reduce((a, b) => a + b, 0)
        },
      )
      .subscribe()
  }

  const resetUnread = () => {
    unreadCount.value = 0
    unreadByUser.value = {}
    lastReadByUser.value = {}
  }

  return {
    role,
    setRole,
    unreadCount,
    unreadByUser,
    lastReadByUser,
    fetchUnreadByUser,
    markAsRead,
    listenRealtime,
    resetUnread,
  }
})
