import { supabase } from '@/services/supabaseClient'
import { onUnmounted } from 'vue'
import type { Message } from '../types/chat'

interface ChatRealtimeOptions {
  onMessageInsert?: (msg: Message) => void
  onMessageUpdate?: (msg: Message) => void
  onAdminTyping?: (isTyping: boolean) => void
  onUserTyping?: (isTyping: boolean) => void
}

export function useChatRealtime(options: ChatRealtimeOptions) {
  const messageChannel = supabase.channel('messages')
  const typingChannel = supabase.channel('typing-status')

  messageChannel
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) =>
      options.onMessageInsert?.(payload.new as Message),
    )
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) =>
      options.onMessageUpdate?.(payload.new as Message),
    )
    .subscribe()

  typingChannel
    .on('broadcast', { event: 'admin_typing' }, (p: any) =>
      options.onAdminTyping?.(p.payload.isTyping),
    )
    .on('broadcast', { event: 'user_typing' }, (p: any) =>
      options.onUserTyping?.(p.payload.isTyping),
    )
    .subscribe()

  onUnmounted(() => {
    supabase.removeChannel(messageChannel)
    supabase.removeChannel(typingChannel)
  })
}
