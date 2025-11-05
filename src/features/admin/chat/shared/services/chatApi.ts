import { supabase } from '@/supabase/supabaseClient'
import type { TablesInsert } from '@/supabase/types/supabase'
import type { ChatRole } from '../types/chat'

export const chatApi = {
  /** ✅ Récupère les derniers messages d'un user */
  async fetchMessages(userId: string, limit = 30) {
    if (!userId) throw new Error('fetchMessages → userId manquant')

    return await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit)
  },

  /** ✅ Récupère des messages plus anciens que `beforeDate` */
  async fetchMessagesBefore(userId: string, beforeDate: string, limit = 30) {
    if (!userId) throw new Error('fetchMessagesBefore → userId manquant')
    if (!beforeDate) throw new Error('fetchMessagesBefore → beforeDate manquant')

    return await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .lt('created_at', beforeDate)
      .order('created_at', { ascending: false }) // récupère du plus récent au plus ancien
      .limit(limit)
      .then((res) => {
        // On inverse car asc=false renvoie du plus récent → plus ancien
        if (res.data) res.data.reverse()
        return res
      })
  },

  /** ✅ Envoie un message */
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

  /** ✅ Liste des conversations (vue SQL admin) */
  async fetchAllConversations() {
    return await supabase.from('conversation_overview').select('*')
  },

  /** ✅ Marque conversation comme lue */
  async markConversationRead(userId: string, lastMessageId?: number) {
    if (!userId) throw new Error('markConversationRead → userId manquant')

    const payload: TablesInsert<'conversations'> = {
      user_id: String(userId),
      last_read_message_id: lastMessageId ?? null,
      last_read_at: new Date().toISOString(),
    }

    return await supabase.from('conversations').upsert(payload)
  },

  /** ✅ Marque messages comme lus */
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
}
