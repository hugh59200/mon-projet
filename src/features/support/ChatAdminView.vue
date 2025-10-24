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
            :isMine="msg.user_id === adminId"
          />
          <div ref="endOfChat" />
        </div>

        <form
          class="send-box"
          @submit.prevent="sendAdminMessage"
        >
          <input
            v-model="adminMessage"
            placeholder="Répondre au client..."
            type="text"
          />
          <button type="submit">
            <BasicIcon name="send" />
          </button>
        </form>
      </section>

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
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { useChatNotifStore } from './stores/useChatNotifStore'

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

  /* -------------------------------------------------------------------------- */
  /*                            Chargement des données                          */
  /* -------------------------------------------------------------------------- */
  async function fetchConversations() {
    const { data, error } = await supabase
      .from('messages')
      .select(
        `
      user_id,
      content,
      created_at,
      profiles!inner(email)
    `,
      )
      .order('created_at', { ascending: false })

    if (error) return console.error(error)

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

    if (error) return console.error(error)

    messages.value = data || []
    nextTick(() => endOfChat.value?.scrollIntoView({ behavior: 'smooth' }))

    // 🧩 Canal Realtime
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
      content: adminMessage.value,
      created_at: new Date().toISOString(),
    })
    if (error) console.error(error)
    adminMessage.value = ''
    await fetchMessages(selectedUserId.value)
  }

  /* -------------------------------------------------------------------------- */
  /*                            Données dérivées                                */
  /* -------------------------------------------------------------------------- */
  const filteredMessages = computed(() =>
    messages.value.filter((m) => m.user_id === selectedUserId.value),
  )

  onMounted(async () => {
    await fetchConversations()
  })
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
      padding: 16px;
      position: relative;

      .messages-list {
        flex: 1;
        overflow-y: auto;
        max-height: 460px;
        padding-right: 8px;
      }

      .send-box {
        display: flex;
        border-top: 1px solid @neutral-200;
        padding: 10px;
        input {
          flex: 1;
          border: none;
          outline: none;
          padding: 8px;
        }
        button {
          background: none;
          border: none;
          padding: 6px 10px;
          cursor: pointer;
        }
      }
    }

    &__placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
