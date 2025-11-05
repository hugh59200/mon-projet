import { ref } from 'vue'
import { chatApi } from '../services/chatApi'
import type { ConversationOverview } from '../types/chat'

export function useChatConversations() {
  const conversations = ref<ConversationOverview[]>([])

  const fetchConversations = async () => {
    const { data } = await chatApi.fetchAllConversations()
    conversations.value = (data ?? [])
      .filter((c) => c.user_id !== null)
      .map((c) => ({
        user_id: c.user_id!,
        user_email: c.user_email,
        full_name: c.full_name,
        last_read_message_id: c.last_read_message_id,
        last_read_at: c.last_read_at,
        last_admin_message_id: c.last_admin_message_id,
        last_admin_read_at: c.last_admin_read_at,
        last_message: c.last_message,
        last_message_at: c.last_message_at,
        unread_count: c.unread_count_admin ?? 0,
      }))
  }

  return { conversations, fetchConversations }
}
