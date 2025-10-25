// src/services/chatApi.ts
import { supabase } from '@/services/supabaseClient'
import type { Message } from '../types/chat'

export const chatApi = {
  /** 🔄 Récupère tous les messages d'un utilisateur */
  async fetchMessages(userId: string) {
    return await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .returns<Message[]>()
  },

  /** 💬 Envoie un message */
  async sendMessage(userId: string, sender: 'user' | 'admin', content: string) {
    return await supabase
      .from('messages')
      .insert({
        user_id: userId,
        sender_role: sender,
        content,
        created_at: new Date().toISOString(),
      })
      .returns<Message[]>()
  },

  /** 📚 Liste des conversations pour l’admin */
  async fetchAllConversations() {
    return await supabase
      .from('messages')
      .select(`user_id, content, created_at, profiles(email)`)
      .order('created_at', { ascending: false })
  },
}
