import { useAuthStore } from '@/features/auth/useAuthStore'
import { supabase } from '@/services/supabaseClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<any[]>([])

  /** 🔄 Récupère les messages de l'utilisateur connecté */
  const fetchMessages = async () => {
    const user = useAuthStore().user
    if (!user) return

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id) // ✅ important : filtre RLS
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[Chat] fetchMessages error:', error)
      return
    }

    if (data) messages.value = data
  }

  /** 💬 Envoie un nouveau message utilisateur */
  const sendMessage = async (content: string) => {
    const user = useAuthStore().user
    if (!user) return console.warn('[Chat] Aucun utilisateur connecté')

    const { error } = await supabase.from('messages').insert({
      user_id: user.id,
      sender_role: 'user',
      content,
      created_at: new Date().toISOString(),
    })

    if (error) console.error('[Chat] sendMessage error:', error)
    // ⛔️ ne pas rappeler fetchMessages ici
    // on laisse Realtime pousser le message
  }

  /** ➕ Ajoute un message localement (Realtime) */
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
