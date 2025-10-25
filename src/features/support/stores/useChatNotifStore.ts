import { supabase } from '@/services/supabaseClient'
import type { TablesUpdate } from '@/types/supabase'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from '../types/chat'

export const useChatNotifStore = defineStore('chatNotif', () => {
  const unreadCount = ref<number>(0)

  /** 🔄 Charge le nombre de messages non lus (messages sender_role='user') */
  const fetchUnreadCount = async () => {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .eq('sender_role', 'user')

    if (!error && count !== null) unreadCount.value = count
  }

  /** 🧠 Marque les messages d'un user comme lus */
  const markAsRead = async (userId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      } satisfies TablesUpdate<'messages'>)
      .eq('user_id', userId)
      .eq('sender_role', 'user')

    if (!error) await fetchUnreadCount()
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
          if (msg.sender_role === 'user') unreadCount.value++
        },
      )
      .subscribe()
  }

  return { unreadCount, fetchUnreadCount, markAsRead, listenRealtime }
})
