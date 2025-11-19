<template>
  <div class="chat-admin">
    <header class="chat-admin__header">
      <div class="chat-admin__header-info">
        <BasicIconNext
          name="MessageCircle"
          :size="20"
        />
        <BasicText
          size="h4"
          weight="semibold"
        >
          Messages clients
        </BasicText>
      </div>
      <div class="chat-admin__header-actions">
        <BasicInput
          v-model="searchQuery"
          placeholder="Rechercher une conversation..."
          icon-name="Search"
          clearable
          size="small"
          class="chat-admin__header-search"
        />
      </div>
    </header>
    <div class="chat-admin__layout">
      <ChatSidebar
        :conversations="filteredConversations"
        :selected-id="selectedUserId"
        :is-typing-by-user="typingRecord"
        @select="selectConversation"
      />
      <ChatCore
        v-if="selectedUserId"
        v-model:new-message="newMessage"
        :messages="messages"
        :is-typing="isCurrentTyping"
        :loading="isMessagesLoading"
        current-role="admin"
        :send-message="sendMessage"
        :send-typing="sendTyping"
        :height="600"
      />
      <section
        v-else
        class="chat-admin__placeholder"
      >
        <BasicIconNext
          name="MessageSquare"
          :size="32"
        />
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
  import { computed, onMounted, ref, watch } from 'vue'
  import ChatCore from '../shared/components/ChatCore.vue'
  import { useChat } from '../shared/composables/useChat'
  import { useChatConversations } from '../shared/composables/useChatConversations'
  import { useChatNotifStore } from '../shared/stores/useChatNotifStore'
  import ChatSidebar from './ChatSidebar.vue'

  const {
    messages,
    selectedUserId,
    newMessage,
    isTypingByUser,
    isMessagesLoading,
    selectConversation,
    sendMessage,
    sendTyping,
  } = useChat('admin')

  const conv = useChatConversations()

  const chatNotif = useChatNotifStore()

  const typingRecord = computed(() => {
    return isTypingByUser.value // ✅ directement, réactif
  })

  const isCurrentTyping = computed(() => {
    const uid = selectedUserId.value
    const v = uid ? typingRecord.value[uid] : false
    return !!v
  })

  onMounted(async () => {
    await conv.fetchConversations()
    conv.setupPresence()
    conv.listenRealtimeConversations()
    await chatNotif.fetchUnreadByUser()
  })

  const searchQuery = ref('')
  const filteredConversations = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    let base = conv.conversations.value
    if (q) {
      base = base.filter(
        (c) =>
          c.user_email?.toLowerCase().includes(q) || c.last_message_short.toLowerCase().includes(q),
      )
    }
    return base
  })

  watch(selectedUserId, async (uid) => {
    if (uid) {
      await chatNotif.markAsRead(uid)
      await conv.refreshUnreadCount()
    }
  })
</script>

<style scoped lang="less">
  .chat-admin {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 32px;
    background: color-mix(in srgb, @neutral-200 82%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid color-mix(in srgb, @neutral-300 40%, transparent);
    box-shadow:
      0 4px 14px color-mix(in srgb, @neutral-900 6%, transparent),
      inset 0 0 0 1px color-mix(in srgb, @neutral-50 45%, transparent);
    min-height: 100vh;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;

      &-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      &-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      &-search {
        width: 260px;
      }
    }

    &__layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      box-shadow: 0 2px 8px color-mix(in srgb, @neutral-900 5%, transparent);
      border: 1px solid @neutral-200;
      align-items: stretch;
      min-height: 600px;
    }

    &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: @neutral-600;
      gap: 12px;
      min-height: 600px;
      text-align: center;
    }
  }
</style>
