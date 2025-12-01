import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
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

  // TTL anti-stuck typing
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  const setup = () => {
    if (chan) return

    chan = supabase.channel('chat-typing', {
      config: { broadcast: { self: false } },
    })

    chan.on('broadcast', { event: 'typing' }, ({ payload }) => {
      const {
        fromRole,
        toUserId,
        isTyping: t,
      } = payload as {
        fromRole: ChatRole
        toUserId?: string
        isTyping: boolean
      }

      // user → admin (affiche par user)
      if (role === 'admin' && fromRole === 'user' && toUserId) {
        isTypingByUser.value = { ...isTypingByUser.value, [toUserId]: t }
        // TTL
        clearTimeout(timers.get(toUserId))
        if (t) {
          timers.set(
            toUserId,
            setTimeout(() => {
              isTypingByUser.value = { ...isTypingByUser.value, [toUserId]: false }
            }, 3000),
          )
        }
      }

      // admin → user
      if (role === 'user' && fromRole === 'admin' && toUserId === getActiveUser()) {
        isTyping.value = t
        // TTL simple côté user
        clearTimeout(timers.get('single'))
        if (t) {
          timers.set(
            'single',
            setTimeout(() => {
              isTyping.value = false
            }, 3000),
          )
        }
      }
    })

    chan.subscribe((status) => {
      if (status === 'CHANNEL_ERROR') console.warn('typing channel error')
      if (status === 'CLOSED') console.info('typing channel closed')
    })
  }

  const sendTyping = () => {
    const uid = getActiveUser()
    if (!uid || !chan) return

    const now = Date.now()
    if (now - last < 500) return
    last = now

    chan.send({
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
    timers.forEach((t) => clearTimeout(t))
    timers.clear()
    if (chan) void supabase.removeChannel(chan)
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
