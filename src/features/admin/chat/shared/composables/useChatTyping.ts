import { supabase } from '@/supabase/supabaseClient'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { ref } from 'vue'
import type { ChatRole } from '../types/chat'

interface UseChatTypingOptions {
  role: ChatRole
  getActiveUser: () => string | null
}

export function useChatTyping({ role, getActiveUser }: UseChatTypingOptions) {
  const isTyping = ref(false)
  const isTypingByUser = ref<Record<string, boolean>>({})
  let chan: RealtimeChannel | null = null
  let last = 0

  const setup = () => {
    if (chan) return

    chan = supabase.channel('chat-typing', {
      config: { broadcast: { self: false } },
    })

    chan.on('broadcast', { event: 'typing' }, ({ payload }) => {
      const { fromRole, toUserId, isTyping: t } = payload

      // user → admin
      if (role === 'admin' && fromRole === 'user' && toUserId) {
        isTypingByUser.value = { ...isTypingByUser.value, [toUserId]: t }
      }

      // admin → user
      if (role === 'user' && fromRole === 'admin' && toUserId === getActiveUser()) {
        isTyping.value = t
      }
    })

    chan.subscribe()
  }

  const sendTyping = () => {
    const uid = getActiveUser()
    if (!uid) return

    const now = Date.now()
    if (now - last < 500) return
    last = now

    chan?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { fromRole: role, toUserId: uid, isTyping: true },
    })

    setTimeout(() => {
      chan?.send({
        type: 'broadcast',
        event: 'typing',
        payload: { fromRole: role, toUserId: uid, isTyping: false },
      })
    }, 600)
  }

  const cleanup = () => {
    if (chan) supabase.removeChannel(chan)
    chan = null
  }

  return {
    isTyping,
    isTypingByUser,
    setup,
    sendTyping,
    cleanup,
  }
}
