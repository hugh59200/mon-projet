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

  /** 🔄 Charge les non-lus regroupés par utilisateur */
  const fetchUnreadByUser = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('user_id')
      .eq('is_read', false)
      .eq('sender_role', 'user')

    if (error) {
      console.error('[fetchUnreadByUser]', error)
      return
    }

    const map: Record<string, number> = {}
    for (const msg of data || []) {
      if (!msg.user_id) continue
      map[msg.user_id] = (map[msg.user_id] || 0) + 1
    }

    unreadByUser.value = map
    unreadCount.value = Object.values(map).reduce((a, b) => a + b, 0)
  }

  /** 🧠 Marque les messages d’un user comme lus */
  const markAsRead = async (userId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      } satisfies TablesUpdate<'messages'>)
      .eq('user_id', userId)
      .eq('sender_role', 'user')

    if (!error) await fetchUnreadByUser()
  }

  /** 🔔 Écoute Realtime pour nouveaux messages utilisateurs */
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

          unreadByUser.value[msg.user_id] = (unreadByUser.value[msg.user_id] || 0) + 1

          unreadCount.value = Object.values(unreadByUser.value).reduce((a, b) => a + b, 0)
        },
      )
      .subscribe()
  }

  return { unreadCount, unreadByUser, fetchUnreadByUser, markAsRead, listenRealtime }
})
