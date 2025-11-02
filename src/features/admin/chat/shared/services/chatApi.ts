import { supabase } from '@/supabase/supabaseClient'
import type { TablesInsert } from '@/supabase/types/supabase'
import type { ChatRole } from '../types/chat'

export const chatApi = {
  /** 🔄 Récupère tous les messages d'un utilisateur */
  async fetchMessages(userId: string) {
    if (!userId) throw new Error('fetchMessages → userId manquant')

    return await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
  },

  /** 💬 Envoie un message (admin ou user) */
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

  /** 📚 Liste des conversations (vue SQL optimisée côté admin) */
  async fetchAllConversations() {
    return await supabase.from('conversation_overview').select('*')
  },

  /** 🧠 Marque une conversation comme lue */
  async markConversationRead(userId: string, lastMessageId?: number) {
    if (!userId) throw new Error('markConversationRead → userId manquant')

    // 👇 Upsert = nécessite un objet compatible avec TablesInsert
    const payload: TablesInsert<'conversations'> = {
      user_id: String(userId),
      last_read_message_id: lastMessageId ?? null,
      last_read_at: new Date().toISOString(),
    }

    return await supabase.from('conversations').upsert(payload)
  },

  /** ✅ Marque tous les messages non lus d’un rôle comme lus */
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

    if (error) console.error('[chatApi.markMessagesAsRead]', error)
    else if (data?.length)
      console.info(`✅ ${data.length} messages marqués comme lus (${senderRole})`)

    return { data, error }
  },
}
