import { supabase } from '@/supabase/supabaseClient'
import { ref } from 'vue'
import type { ChatRole } from '../types/chat'

interface TypingPayloadLoose {
  fromRole?: ChatRole
  toUserId?: string
  isTyping?: boolean
  istyping?: boolean
  typing?: boolean
}

export function useChatTyping(
  role: ChatRole,
  userIdRef: () => string | null,
  selectedUserRef: () => string | null,
) {
  const isTyping = ref(false)
  const isTypingByUser = ref<Record<string, boolean>>({})

  let typingChannel: ReturnType<typeof supabase.channel> | null = null
  let lastEmit = 0
  const THROTTLE = 800

  const getTarget = () => (role === 'admin' ? selectedUserRef() : userIdRef())

  const setupTypingChannel = () => {
    if (typingChannel) return

    // ✅ Canal COMMUN
    const CHANNEL = 'chat-typing'
    console.log('[typing] subscribe ->', CHANNEL)

    typingChannel = supabase.channel(CHANNEL, {
      config: { broadcast: { self: false } },
    })

    typingChannel.on(
      'broadcast',
      { event: 'typing' },
      ({ payload }: { payload: TypingPayloadLoose }) => {
        const fromRole = payload.fromRole
        const toUserId = payload.toUserId ?? ''
        // ✅ compat: isTyping | istyping | typing
        const t = (payload.isTyping ?? payload.istyping ?? payload.typing ?? false) as boolean

        console.log('[typing] receive', { roleListening: role, fromRole, toUserId, t })

        // USER voit l'ADMIN taper pour LUI
        if (role === 'user' && fromRole === 'admin' && toUserId === (userIdRef() ?? '')) {
          isTyping.value = t
          console.log('[typing] user.isTyping =', t)
          return
        }

        // ADMIN voit quel USER tape
        if (role === 'admin' && fromRole === 'user' && toUserId) {
          // recrée l’objet pour forcer la réactivité Vue
          isTypingByUser.value = { ...isTypingByUser.value, [toUserId]: t }
          console.log('[typing] admin map ->', isTypingByUser.value)

          if (t) {
            setTimeout(() => {
              isTypingByUser.value = { ...isTypingByUser.value, [toUserId]: false }
              console.log('[typing] admin map auto-clear ->', toUserId)
            }, 1800)
          }
        }
      },
    )

    typingChannel.subscribe((status) => {
      console.log('[typing] sub status', status)
    })
  }

  const sendTyping = () => {
    const target = getTarget()
    if (!target) {
      console.log('[typing] sendTyping -> no target')
      return
    }

    const now = Date.now()
    if (now - lastEmit < THROTTLE) return
    lastEmit = now

    setupTypingChannel()

    // ✅ on envoie avec la clé isTyping (standard)
    const payload = {
      fromRole: role,
      toUserId: target,
      isTyping: true,
    }

    console.log('[typing] SEND', payload)
    typingChannel!.send({ type: 'broadcast', event: 'typing', payload })

    setTimeout(() => {
      const off = { ...payload, isTyping: false }
      console.log('[typing] SEND', off)
      typingChannel!.send({ type: 'broadcast', event: 'typing', payload: off })
    }, 600)
  }

  const cleanup = () => {
    if (!typingChannel) return
    console.log('[typing] cleanup')
    supabase.removeChannel(typingChannel)
    typingChannel = null
  }

  return {
    isTyping,
    isTypingByUser,
    sendTyping,
    setupTypingChannel,
    cleanup,
  }
}
