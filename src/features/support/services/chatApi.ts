import { supabase } from '@/services/supabaseClient'

export const chatApi = {
  /** 🔄 Récupère tous les messages d'un utilisateur */
  async fetchMessages(userId: string) {
    return await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
  },

  /** 💬 Envoie un message */
  async sendMessage(userId: string, sender: 'user' | 'admin', content: string) {
    return await supabase.from('messages').insert({
      user_id: userId,
      sender_role: sender,
      content,
      created_at: new Date().toISOString(),
    })
  },

  /** 📚 Liste des conversations (vue optimisée côté admin) */
  async fetchAllConversations() {
    return await supabase.from('conversation_overview').select('*')
  },

  /** 🧠 Marque une conversation comme lue */
  async markConversationRead(userId: string, lastMessageId?: number) {
    return await supabase.from('conversations').upsert({
      user_id: userId,
      last_read_message_id: lastMessageId ?? null,
      last_read_at: new Date().toISOString(),
    })
  },
}
