import { supabase } from '@/supabase/supabaseClient'
import { ref } from 'vue'
import type { ChatRole } from '../types/chat'

interface TypingPayload {
  fromRole: ChatRole
  toUserId: string
  isTyping: boolean
}

export function useChatTyping(
  role: ChatRole,
  userIdRef: () => string | null,
  selectedUserRef: () => string | null,
) {
  const isTyping = ref(false)
  const isTypingByUser = ref<Record<string, boolean>>({})
  let typingChannel: ReturnType<typeof supabase.channel> | null = null

  const setupTypingChannel = () => {
    if (typingChannel) return

    typingChannel = supabase.channel('chat-typing', {
      config: { broadcast: { self: false } },
    })

    typingChannel.on(
      'broadcast',
      { event: 'typing' },
      ({ payload }: { payload: TypingPayload }) => {
        const { fromRole, toUserId, isTyping: t } = payload

        if (role === 'user' && fromRole === 'admin' && toUserId === userIdRef()) {
          isTyping.value = t
        }

        if (role === 'admin' && fromRole === 'user') {
          isTypingByUser.value[toUserId] = t
          if (t) setTimeout(() => (isTypingByUser.value[toUserId] = false), 2000)
        }
      },
    )

    typingChannel.subscribe()
  }

  const sendTyping = () => {
    setupTypingChannel()
    const targetId = role === 'admin' ? selectedUserRef() : userIdRef()
    if (!targetId) return

    const payload: TypingPayload = { fromRole: role, toUserId: targetId, isTyping: true }
    typingChannel!.send({ type: 'broadcast', event: 'typing', payload })

    setTimeout(
      () =>
        typingChannel!.send({
          type: 'broadcast',
          event: 'typing',
          payload: { ...payload, isTyping: false },
        }),
      1200,
    )
  }

  const cleanup = () => typingChannel && supabase.removeChannel(typingChannel)

  return { isTyping, isTypingByUser, sendTyping, setupTypingChannel, cleanup }
}
