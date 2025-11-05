import { supabase } from '@/supabase/supabaseClient'
import type { Database } from '@/supabase/types/supabase'
import { nextTick, reactive, ref } from 'vue'
import { chatApi } from '../services/chatApi'
import type { ChatRole, Message } from '../types/chat'

type MessageRow = Database['public']['Tables']['messages']['Row']
const PAGE_SIZE = 30

export function useChatMessages(
  role: ChatRole,
  userIdRef: () => string | null,
  selectedUserRef: () => string | null,
  onUnread?: (uid: string) => void,
) {
  const messages = ref<Message[]>([])
  const isMessagesLoading = ref(false)
  const oldestMessageDate = ref<string | null>(null)
  const hasMore = ref(true)

  let realtimeChannel: ReturnType<typeof supabase.channel> | null = null

  const scrollEl = () =>
    document.querySelector('.chat-messages, .messages-list') as HTMLElement | null

  const scrollToEnd = async (instant = false) => {
    await nextTick()
    scrollEl()?.scrollTo({
      top: scrollEl()!.scrollHeight,
      behavior: instant ? 'auto' : 'smooth',
    })
  }

  const keepScrollOnPrepend = async (prev: number) => {
    await nextTick()
    const el = scrollEl()
    if (el) el.scrollTop = el.scrollHeight - prev
  }

  const fetchInitialMessages = async (uid: string) => {
    isMessagesLoading.value = true
    const { data } = await chatApi.fetchMessages(uid, PAGE_SIZE)

    messages.value = (data ?? []).map((m) => reactive(m))
    hasMore.value = (data?.length ?? 0) === PAGE_SIZE
    oldestMessageDate.value = data?.[0]?.created_at ?? null
    isMessagesLoading.value = false

    await scrollToEnd(true)
  }

  const loadOlderMessages = async () => {
    if (!hasMore.value || !oldestMessageDate.value || isMessagesLoading.value) return

    const target = role === 'admin' ? selectedUserRef() : userIdRef()
    if (!target) return

    isMessagesLoading.value = true
    const prevHeight = scrollEl()?.scrollHeight ?? 0
    const { data } = await chatApi.fetchMessagesBefore(target, oldestMessageDate.value, PAGE_SIZE)

    if (!data?.length) {
      hasMore.value = false
      isMessagesLoading.value = false
      return
    }

    const existing = new Set(messages.value.map((m) => m.id))
    const newOnes = data.filter((m) => !existing.has(m.id))

    messages.value.unshift(...newOnes.map((m) => reactive(m)))
    oldestMessageDate.value = data[0]?.created_at ?? oldestMessageDate.value

    isMessagesLoading.value = false
    keepScrollOnPrepend(prevHeight)
  }

  const sendMessage = async (text: string) => {
    const target = role === 'admin' ? selectedUserRef() : userIdRef()
    if (!target || !text.trim()) return

    await chatApi.sendMessage(target, role, text.trim())
  }

  const subscribeRealtime = (currentTarget: string | null) => {
    if (realtimeChannel) supabase.removeChannel(realtimeChannel)

    realtimeChannel = supabase.channel(`chat-${role}`, {
      config: { broadcast: { self: false } },
    })

    realtimeChannel.on<MessageRow>(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      ({ new: msg }) => {
        if (!msg) return

        const uid = msg.user_id
        const active = selectedUserRef()

        /** ✅ USER côté client */
        if (role === 'user') {
          if (uid === currentTarget) {
            messages.value.push(reactive(msg))
            scrollToEnd(true)
          }
          return
        }

        /** ✅ ADMIN côté back-office */
        if (role === 'admin') {
          // ✅ message du user actuellement ouvert → affichage normal
          if (uid === active) {
            messages.value.push(reactive(msg))
            scrollToEnd(true)
            return
          }

          // ✅ message d’un autre utilisateur → déclenche un non-lu
          if (uid && onUnread) {
            onUnread(uid)
          }
        }
      },
    )

    realtimeChannel.subscribe()
  }

  const cleanup = () => realtimeChannel && supabase.removeChannel(realtimeChannel)

  return {
    messages,
    sendMessage,
    loadOlderMessages,
    fetchInitialMessages,
    subscribeRealtime,
    hasMore,
    isMessagesLoading,
    cleanup,
  }
}
