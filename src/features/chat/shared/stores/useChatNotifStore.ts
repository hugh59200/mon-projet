import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { supabase } from '@/supabase/supabaseClient'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useChatWidgetStore } from '../../user/useChatWidgetStore'
import { chatApi } from '../services/chatApi'
import type { ChatRole, Message } from '../types/chat'

export const useChatNotifStore = defineStore('chatNotif', () => {
  const auth = useAuthStore()
  const chatWidget = useChatWidgetStore()

  const role = ref<ChatRole>('admin')
  const unreadByUser = ref<Record<string, number>>({})

  const unreadCount = computed(() => Object.values(unreadByUser.value).reduce((a, b) => a + b, 0))

  const isAdmin = computed(() => role.value === 'admin')

  const setRole = (r: ChatRole) => (role.value = r)

  const incrementUserUnread = (uid: string) => {
    unreadByUser.value[uid] = (unreadByUser.value[uid] ?? 0) + 1
  }

  const clearUserUnread = (uid: string) => {
    unreadByUser.value[uid] = 0
  }

  const resetUnread = () => {
    unreadByUser.value = {}
  }

  /** Récupération initiale */
  const fetchUnreadByUser = async () => {
    if (isAdmin.value) {
      const { data } = await supabase.from('messages_unread_view').select('*')
      unreadByUser.value = Object.fromEntries(
        (data ?? []).map((row) => [row.user_id, Number(row.count)]),
      )
      return
    }

    const uid = auth.user?.id
    if (!uid) return

    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', uid)
      .eq('sender_role', 'admin')
      .eq('is_read', false)

    unreadByUser.value = { [uid]: count ?? 0 }
  }

  const markAsRead = async (userId: string, lastMessageId?: number) => {
    const senderRoleToMark = isAdmin.value ? 'user' : 'admin'

    await Promise.all([
      chatApi.markMessagesAsRead(userId, senderRoleToMark),
      chatApi.markConversationRead(userId, lastMessageId),
    ])

    clearUserUnread(userId)
  }

  let realtimeChannel: ReturnType<typeof supabase.channel> | null = null

  const listenRealtime = () => {
    if (realtimeChannel) return

    realtimeChannel = supabase.channel('chat-notifications', {
      config: { broadcast: { self: false } },
    })

    realtimeChannel.on<Message>(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      ({ new: msg }) => {
        if (!msg?.user_id || msg.is_read) return

        /** user reçoit un message admin */
        if (!isAdmin.value && msg.sender_role === 'admin') {
          if (!chatWidget.isOpen) unreadByUser.value[msg.user_id] = 1
          return
        }

        /** admin reçoit un message user */
        if (isAdmin.value && msg.sender_role === 'user') {
          const uid = msg.user_id

          if (chatWidget.isOpen && chatWidget.currentUserId === uid) return

          incrementUserUnread(uid)
        }
      },
    )

    realtimeChannel.subscribe()
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
    incrementUserUnread,
    clearUserUnread,
  }
})
