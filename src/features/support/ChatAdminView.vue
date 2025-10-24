<template>
  <div class="chat-admin">
    <BasicText
      size="h4"
      weight="bold"
    >
      💬 Messages clients
    </BasicText>

    <div class="chat-admin__layout">
      <!-- 📜 Liste des conversations -->
      <aside class="chat-admin__sidebar">
        <div
          v-for="conv in conversations"
          :key="conv.user_id"
          class="conversation-item"
          :class="{ active: conv.user_id === selectedUserId }"
          @click="selectConversation(conv.user_id)"
        >
          <div class="conversation-header">
            <BasicIconNext name="User" />
            <span>{{ conv.user_email || 'Utilisateur anonyme' }}</span>
          </div>
          <small>{{ conv.lastMessagePreview }}</small>
        </div>
      </aside>

      <!-- 💬 Zone de discussion -->
      <section
        class="chat-admin__messages"
        v-if="selectedUserId"
      >
        <div
          class="messages-list"
          ref="messageContainer"
        >
          <ChatMessage
            v-for="msg in filteredMessages"
            :key="msg.id"
            :message="msg"
            :isMine="msg.sender_role === 'admin'"
          />

          <!-- 💭 Bulle "utilisateur écrit..." -->
          <div
            v-if="typing.isTypingUser"
            class="typing-bubble"
          >
            <span class="dot" />
            <span class="dot" />
            <span class="dot" />
          </div>

          <div ref="endOfChat" />
        </div>

        <!-- 🧩 Barre d'envoi -->
        <div class="send-box">
          <input
            v-model="adminMessage"
            placeholder="Écrire un message..."
            type="text"
            @input="handleAdminInput"
            @keyup.enter="sendAdminMessage"
          />
          <BasicButton
            label="Envoyer"
            type="primary"
            size="small"
            @click="sendAdminMessage"
          />
        </div>
      </section>

      <!-- 🕳️ Placeholder -->
      <section
        v-else
        class="chat-admin__placeholder"
      >
        <BasicText
          size="body-m"
          color="neutral-500"
        >
          Sélectionnez une conversation à gauche pour commencer.
        </BasicText>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import ChatMessage from '@/features/support/ChatMessage.vue'
  import { supabase } from '@/services/supabaseClient'
  import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useChatNotifStore } from './stores/useChatNotifStore'
  import { useTypingStore } from './stores/useTypingStore'

  const props = defineProps({
    isPreview: { type: Boolean, default: false },
  })

  const conversations = ref<any[]>([])
  const messages = ref<any[]>([])
  const selectedUserId = ref<string | null>(null)
  const adminMessage = ref('')
  const messageContainer = ref<HTMLDivElement>()
  const endOfChat = ref<HTMLDivElement>()

  const adminId = useAuthStore().user?.id
  const chatNotif = useChatNotifStore()
  const typing = useTypingStore()
  const route = useRoute()

  let typingTimer: any
  let typingChannel: any

  /* -------------------------------------------------------------------------- */
  /*                            Chargement des conversations                     */
  /* -------------------------------------------------------------------------- */
  async function fetchConversations() {
    const { data, error } = await supabase
      .from('messages')
      .select(
        `
      user_id,
      content,
      created_at,
      profiles(email)
    `,
      )
      .order('created_at', { ascending: false })

    if (error) return console.error('[fetchConversations]', error)

    const grouped = new Map<string, any>()
    data.forEach((msg) => {
      if (msg.user_id && !grouped.has(msg.user_id)) {
        grouped.set(msg.user_id, {
          user_id: msg.user_id,
          user_email: Array.isArray(msg.profiles) ? msg.profiles[0]?.email : msg.profiles?.email,
          lastMessagePreview: msg.content.slice(0, 50),
          lastDate: msg.created_at,
        })
      }
    })

    const allConversations = Array.from(grouped.values())
    conversations.value = props.isPreview ? allConversations.slice(0, 3) : allConversations
  }

  /* -------------------------------------------------------------------------- */
  /*                             Interaction administrateur                     */
  /* -------------------------------------------------------------------------- */
  async function fetchMessages(userId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) return console.error('[fetchMessages]', error)

    messages.value = data || []

    // 🧩 Canal Realtime par utilisateur
    supabase
      .channel(`messages-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const newMessage = payload.new
          messages.value.push(newMessage)
          nextTick(() => endOfChat.value?.scrollIntoView({ behavior: 'smooth' }))
        },
      )
      .subscribe()
  }

  async function selectConversation(userId: string) {
    selectedUserId.value = userId
    await fetchMessages(userId)
    await chatNotif.markAsRead(userId)
  }

  async function sendAdminMessage() {
    if (!adminMessage.value.trim() || !selectedUserId.value) return

    const { error } = await supabase.from('messages').insert({
      user_id: selectedUserId.value,
      sender_role: 'admin',
      content: adminMessage.value,
      created_at: new Date().toISOString(),
    })

    if (error) return console.error('[sendAdminMessage]', error)

    adminMessage.value = ''
    // ❌ pas besoin de refetch ici
    await nextTick()
    endOfChat.value?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleAdminInput() {
    supabase.channel('typing-status').send({
      type: 'broadcast',
      event: 'admin_typing',
      payload: { isTyping: true },
    })
    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => {
      supabase.channel('typing-status').send({
        type: 'broadcast',
        event: 'admin_typing',
        payload: { isTyping: false },
      })
    }, 1500)
  }

  /* -------------------------------------------------------------------------- */
  /*                            Données dérivées                                */
  /* -------------------------------------------------------------------------- */
  const filteredMessages = computed(() =>
    messages.value.filter((m) => m.user_id === selectedUserId.value),
  )

  /* -------------------------------------------------------------------------- */
  /*                        Marquage auto + Typing Realtime                     */
  /* -------------------------------------------------------------------------- */
  onMounted(async () => {
    await fetchConversations()

    // reset badge si on arrive sur /admin/chat
    if (route.path === '/admin/chat') {
      await chatNotif.fetchUnreadCount()
      const userIds = conversations.value.map((c) => c.user_id)
      for (const id of userIds) {
        await chatNotif.markAsRead(id)
      }
    }

    // ⚡ Canal "typing"
    typingChannel = supabase.channel('typing-status')
    typingChannel
      .on('broadcast', { event: 'user_typing' }, (payload: { payload: { isTyping: boolean } }) => {
        typing.isTypingUser = payload.payload.isTyping
      })
      .subscribe()

    // ⚡ Canal global pour tous les nouveaux messages utilisateur
    supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const msg = payload.new
          if (msg.sender_role === 'user') {
            if (msg.user_id === selectedUserId.value) {
              messages.value.push(msg)
              nextTick(() => endOfChat.value?.scrollIntoView({ behavior: 'smooth' }))
            }
            await fetchConversations()
            await chatNotif.fetchUnreadCount()
          }
        },
      )
      .subscribe()
  })

  onUnmounted(() => {
    if (typingChannel) supabase.removeChannel(typingChannel)
  })

  watch(
    () => route.path,
    async (newPath) => {
      if (newPath === '/admin/chat') {
        const userIds = conversations.value.map((c) => c.user_id)
        for (const id of userIds) {
          await chatNotif.markAsRead(id)
        }
      }
    },
  )
</script>

<style scoped lang="less">
  .chat-admin {
    display: flex;
    flex-direction: column;
    padding: 30px;
    gap: 24px;

    &__layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      overflow: hidden;
      background: white;
      min-height: 500px;
    }

    &__sidebar {
      background: @neutral-50;
      border-right: 1px solid @neutral-200;
      overflow-y: auto;
      padding: 8px;

      .conversation-item {
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
        &:hover {
          background: fade(@primary-600, 10%);
        }
        &.active {
          background: fade(@primary-600, 15%);
        }
        .conversation-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: @neutral-900;
        }
        small {
          color: @neutral-600;
        }
      }
    }

    &__messages {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0;
      position: relative;
      background: white;

      .messages-list {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        min-height: 300px;
        max-height: calc(100vh - 280px); /* s’adapte dynamiquement à la fenêtre */
      }

      .send-box {
        display: flex;
        align-items: center;
        gap: 8px;
        border-top: 1px solid @neutral-200;
        padding: 12px;
        background: white;
        position: sticky;
        bottom: 0;
        left: 0;
        right: 0;

        input {
          flex: 1;
          border: 1px solid @neutral-200;
          outline: none;
          padding: 10px 12px;
          font-size: 14px;
          border-radius: 8px;
          background: @neutral-50;
          &:focus {
            border-color: @primary-500;
            background: white;
          }
        }

        button {
          flex-shrink: 0;
        }
      }
    }

    &__placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  /* 💭 Bulle typing animée façon iMessage */
  .typing-bubble {
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    background: @neutral-200;
    border-radius: 16px;
    padding: 6px 10px;
    width: 48px;
    margin: 6px 0 6px 10px;

    .dot {
      width: 6px;
      height: 6px;
      background: fade(@neutral-600, 70%);
      border-radius: 50%;
      animation: typingDots 1.3s infinite ease-in-out;
    }

    .dot:nth-child(1) {
      animation-delay: 0s;
    }
    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes typingDots {
    0%,
    80%,
    100% {
      transform: scale(0.6);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
