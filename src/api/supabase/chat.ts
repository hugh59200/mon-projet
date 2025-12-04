import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { TablesInsert } from '@/supabase/types/supabase'

export type ChatRole = 'user' | 'admin'

export const chatApi = {
  async fetchMessages(userId: string, limit = 30) {
    if (!userId) throw new Error('fetchMessages → userId manquant')

    return await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit)
  },

  async fetchMessagesBefore(userId: string, beforeDate: string, limit = 30) {
    if (!userId) throw new Error('fetchMessagesBefore → userId manquant')
    if (!beforeDate) throw new Error('fetchMessagesBefore → beforeDate manquant')

    return await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .lt('created_at', beforeDate)
      .order('created_at', { ascending: false })
      .limit(limit)
      .then((res) => {
        if (res.data) res.data.reverse()
        return res
      })
  },

  async sendMessage(userId: string, sender: ChatRole, content: string) {
    if (!userId || !content.trim()) throw new Error('sendMessage → données invalides')

    const payload: TablesInsert<'messages'> = {
      user_id: userId,
      sender_role: sender,
      content: content.trim(),
      created_at: new Date().toISOString(),
      is_read: false,
      read_at: null,
    }

    return await supabase.from('messages').insert(payload).select('*').single()
  },

  async fetchAllConversations() {
    return await supabase.from('conversation_overview').select('*')
  },

  async markConversationRead(userId: string, lastMessageId?: number) {
    if (!userId) throw new Error('markConversationRead → userId manquant')

    const payload: TablesInsert<'conversations'> = {
      user_id: String(userId),
      last_read_message_id: lastMessageId ?? null,
      last_read_at: new Date().toISOString(),
    }

    return await supabase.from('conversations').upsert(payload)
  },

  async markMessagesAsRead(userId: string, senderRole: ChatRole) {
    if (!userId) throw new Error('markMessagesAsRead → userId manquant')

    const { data, error } = await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('sender_role', senderRole)
      .eq('is_read', false)
      .select('id')

    return { data, error }
  },

  async fetchUnreadMessagesView() {
    return await supabase.from('messages_unread_view').select('*')
  },

  async fetchUserUnreadCount(userId: string) {
    return await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('sender_role', 'admin')
      .eq('is_read', false)
  },
}
