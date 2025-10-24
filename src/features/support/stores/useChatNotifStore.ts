import { supabase } from '@/services/supabaseClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatNotifStore = defineStore('chatNotif', () => {
  const unreadCount = ref(0)

  /** 🔄 Charge le nombre de messages non lus */
  const fetchUnreadCount = async () => {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .eq('sender_role', 'user') // on ne compte que les messages clients

    if (!error && count !== null) unreadCount.value = count
  }

  /** 🧠 Marque tous les messages comme lus pour un user_id */
  const markAsRead = async (userId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('sender_role', 'user')

    if (!error) await fetchUnreadCount()
  }

  /** 🔔 Écoute Realtime pour nouveaux messages */
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
        (_payload) => {
          unreadCount.value++
        },
      )
      .subscribe()
  }

  return { unreadCount, fetchUnreadCount, markAsRead, listenRealtime }
})
