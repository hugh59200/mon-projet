import { supabase } from '@/supabase/supabaseClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { chatApi } from '../services/chatApi'
import type { ChatRole, Message } from '../types/chat'

export const useChatNotifStore = defineStore('chatNotif', () => {
  /** 🧭 Rôle courant : 'admin' ou 'user' */
  const role = ref<ChatRole>('admin')

  /** 🔢 Total global des non-lus */
  const unreadCount = ref<number>(0)

  /** 🗺️ Détail des non-lus par utilisateur */
  const unreadByUser = ref<Record<string, number>>({})

  /** 🧭 Dernier message lu par utilisateur */
  const lastReadByUser = ref<Record<string, number | null>>({})

  /* ============================================================
   * 🔧 Changement de rôle (utile pour débogage ou multi-rôle)
   * ============================================================ */
  const setRole = (newRole: ChatRole) => {
    role.value = newRole
  }

  /* ============================================================
   * 🔄 Charge la vue SQL messages_unread_view
   * ============================================================ */
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

  /* ============================================================
   * 🧠 Marque une conversation comme lue
   * ============================================================ */
  const markAsRead = async (userId: string, lastMessageId?: number) => {
    if (!userId) return
    const senderRoleToMark = role.value === 'admin' ? 'user' : 'admin'

    // ✅ Mise à jour locale immédiate
    unreadByUser.value[userId] = 0
    unreadByUser.value = { ...unreadByUser.value } // force reactivité
    unreadCount.value = Object.values(unreadByUser.value).reduce((a, b) => a + b, 0)

    // 🔄 maj distante (DB)
    await chatApi.markMessagesAsRead(userId, senderRoleToMark)
    await chatApi.markConversationRead(userId, lastMessageId)

    // 🔁 Optionnel : re-sync complet
    await fetchUnreadByUser()
  }

  /* ============================================================
   * 🔔 Realtime : nouveau message = incrément compteur
   * ============================================================ */
  const listenRealtime = () => {
    supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const msg = payload.new as Message
          if (!msg.user_id || msg.is_read) return

          // Filtrage selon le rôle
          const shouldCount =
            (role.value === 'admin' && msg.sender_role === 'user') ||
            (role.value === 'user' && msg.sender_role === 'admin')

          if (!shouldCount) return

          unreadByUser.value[msg.user_id] = (unreadByUser.value[msg.user_id] || 0) + 1
          unreadByUser.value = { ...unreadByUser.value } // ⚡️ force le refresh visuel

          unreadCount.value = Object.values(unreadByUser.value).reduce((a, b) => a + b, 0)
        },
      )
      .subscribe()
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
  }
})
