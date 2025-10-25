import { supabase } from '@/services/supabaseClient'
import type { TablesUpdate } from '@/types/supabase'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from '../types/chat'

export const useChatNotifStore = defineStore('chatNotif', () => {
  /** 🔢 Total global des non-lus */
  const unreadCount = ref<number>(0)

  /** 🗺️ Détail des non-lus par utilisateur */
  const unreadByUser = ref<Record<string, number>>({})

  /** 🧭 Dernier message lu par utilisateur (synchro cross-device) */
  const lastReadByUser = ref<Record<string, number | null>>({})

  // ============================================================
  // 🔄 Chargement des non-lus (basé sur la vue SQL messages_unread_view)
  // ============================================================
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

  // ============================================================
  // 🧠 Marque une conversation comme lue
  //   → met à jour la table messages (pour rétrocompatibilité)
  //   → met aussi à jour conversations.last_read_message_id
  // ============================================================
  const markAsRead = async (userId: string, lastMessageId?: number) => {
    if (!userId) return

    // ⚡ Mise à jour immédiate de l’état local
    unreadByUser.value[userId] = 0
    unreadCount.value = Object.values(unreadByUser.value).reduce((a, b) => a + b, 0)

    // 🧠 1. Met à jour les messages non lus de cet utilisateur
    await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      } satisfies TablesUpdate<'messages'>)
      .eq('user_id', userId)
      .eq('sender_role', 'user')
      .eq('is_read', false)

    // 🗂️ 2. Met à jour la table conversations
    const { error } = await supabase.from('conversations').upsert({
      user_id: userId,
      last_read_message_id: lastMessageId ?? null,
      last_read_at: new Date().toISOString(),
    })

    if (error) console.error('[markAsRead]', error)

    // 🔄 3. Synchronisation (vue SQL)
    await fetchUnreadByUser()
  }

  // ============================================================
  // 🔔 Realtime : nouveau message utilisateur = incrément compteur
  // ============================================================
  const listenRealtime = () => {
    supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: 'sender_role=eq.user',
        },
        (payload) => {
          const msg = payload.new as Message
          if (!msg.user_id) return

          // Incrémente localement
          unreadByUser.value[msg.user_id] = (unreadByUser.value[msg.user_id] || 0) + 1
          unreadCount.value = Object.values(unreadByUser.value).reduce((a, b) => a + b, 0)
        },
      )
      .subscribe()
  }

  return {
    unreadCount,
    unreadByUser,
    lastReadByUser,
    fetchUnreadByUser,
    markAsRead,
    listenRealtime,
  }
})
