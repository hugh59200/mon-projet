import { useAuthStore } from '@/features/auth/useAuthStore'
import { supabase } from '@/services/supabaseClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<any[]>([])

  /** 🔄 Récupère les messages existants */
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) console.error('[Chat] fetchMessages error:', error)
    if (data) messages.value = data
  }

  /** 💬 Envoie un nouveau message */
  const sendMessage = async (content: string) => {
    const user = useAuthStore().user
    if (!user) return console.warn('[Chat] Aucun utilisateur connecté')

    const { error } = await supabase.from('messages').insert({
      user_id: user.id,
      content,
      created_at: new Date().toISOString(),
    })

    if (error) console.error('[Chat] sendMessage error:', error)
  }

  /** ➕ Ajoute un message localement (temps réel) */
  const addMessage = (message: any) => {
    messages.value.push(message)
  }

  return {
    messages,
    fetchMessages,
    sendMessage,
    addMessage,
  }
})
