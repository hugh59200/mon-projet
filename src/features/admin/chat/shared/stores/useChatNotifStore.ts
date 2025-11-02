import { supabase } from '@/supabase/supabaseClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserChat } from '../../user/useUserChat'
import { chatApi } from '../services/chatApi'
import type { ChatRole, Message } from '../types/chat'

export const useChatNotifStore = defineStore('chatNotif', () => {
  const role = ref<ChatRole>('admin')
  const unreadCount = ref<number>(0)
  const unreadByUser = ref<Record<string, number>>({})
  const lastReadByUser = ref<Record<string, number | null>>({})
  let isRealtimeListening = false

  const setRole = (newRole: ChatRole) => {
    role.value = newRole
  }

  /* --------------------- 🔄 Récupération DB --------------------- */
  const fetchUnreadByUser = async () => {
    const { data, error } = await supabase.from('messages_unread_view').select('*')
    if (error) {
      console.error('[fetchUnreadByUser]', error)
      return
    }

    const map: Record<string, number> = {}
    for (const row of data || []) {
      if (!row.user_id) continue
      map[row.user_id] = Number(row.count)
    }

    unreadByUser.value = map
    unreadCount.value = Object.values(map).reduce((a, b) => a + b, 0)
  }

  /* --------------------- ✅ Marquer comme lu --------------------- */
  const markAsRead = async (userId: string, lastMessageId?: number) => {
    if (!userId) return

    const senderRoleToMark = role.value === 'admin' ? 'user' : 'admin'

    unreadByUser.value[userId] = 0
    unreadByUser.value = { ...unreadByUser.value }
    unreadCount.value = Object.values(unreadByUser.value).reduce((a, b) => a + b, 0)

    if (role.value === 'user') {
      unreadByUser.value = {}
      unreadCount.value = 0
    }

    await Promise.all([
      chatApi.markMessagesAsRead(userId, senderRoleToMark),
      chatApi.markConversationRead(userId, lastMessageId),
    ])

    if (role.value === 'admin') {
      await fetchUnreadByUser()
    }
  }

  /* --------------------- 🔔 Realtime listener --------------------- */
  const listenRealtime = () => {
    if (isRealtimeListening) return
    isRealtimeListening = true

    const { isChatOpen } = useUserChat()

    supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const msg = payload.new as Message
          if (!msg.user_id || msg.is_read) return

          // ⚙️ On compte uniquement les messages "pertinents"
          const shouldCount =
            (role.value === 'admin' && msg.sender_role === 'user') ||
            (role.value === 'user' && msg.sender_role === 'admin')

          if (!shouldCount) return

          // 🚨 Si le chat est ouvert → marquer direct comme lu
          if (isChatOpen.value) {
            await chatApi.markMessagesAsRead(msg.user_id, role.value === 'admin' ? 'user' : 'admin')
            return
          }

          // ✅ Sinon, on incrémente le compteur
          unreadByUser.value[msg.user_id] = (unreadByUser.value[msg.user_id] || 0) + 1
          unreadByUser.value = { ...unreadByUser.value }
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
