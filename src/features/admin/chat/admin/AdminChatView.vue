<template>
  <div class="chat-admin">
    <!-- Header -->
    <header class="chat-admin__header">
      <div class="header-left">
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

      <!-- Recherche globale -->
      <div class="header-actions">
        <BasicInput
          v-model="searchQuery"
          placeholder="Rechercher une conversation..."
          icon-name="Search"
          clearable
          size="small"
          class="header-search"
        />
      </div>
    </header>

    <!-- Layout principal -->
    <div class="chat-admin__layout">
      <ChatSidebar
        :conversations="filteredConversations"
        :selected-id="selectedUserId"
        :is-typing-by-user="isTypingByUser"
        @select="selectConversation"
      />

      <ChatCore
        v-if="selectedUserId"
        v-model:new-message="newMessage"
        :messages="messages"
        :is-typing="!!isTypingByUser[selectedUserId]"
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
  import { computed, ref, watch } from 'vue'
  import ChatCore from '../shared/components/ChatCore.vue'
  import { useChat } from '../shared/composables/useChat'
  import { useChatNotifStore } from '../shared/stores/useChatNotifStore'
  import ChatSidebar from './ChatSidebar.vue'

  const {
    conversations,
    messages,
    selectedUserId,
    newMessage,
    isTypingByUser,
    isMessagesLoading,
    selectConversation,
    sendMessage,
    sendTyping,
  } = useChat('admin')

  const chatNotif = useChatNotifStore()
  const searchQuery = ref('')

  /** ✅ filtrage global côté admin */
  const filteredConversations = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return conversations?.value ?? []
    return (
      conversations?.value?.filter(
        (c) => c.user_email?.toLowerCase().includes(q) || c.last_message?.toLowerCase().includes(q),
      ) ?? []
    )
  })

  /** ✅ Lecture auto quand admin ouvre une conversation */
  watch(selectedUserId, async (uid) => {
    if (uid) await chatNotif.markAsRead(uid)
  })
</script>

<style scoped lang="less">
  .chat-admin {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 32px;
    background: @neutral-50;
    min-height: 100vh;

    /* 🧭 Header */
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;

      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;

        .basic-text {
          color: @neutral-900;
        }
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 8px;

        .header-search {
          width: 260px;

          :deep(.basic-input) {
            height: 36px;
            display: flex;
            align-items: center;
          }
        }
      }
    }

    /* 💬 Layout principal */
    &__layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px fade(@neutral-900, 5%);
      border: 1px solid @neutral-200;
      align-items: stretch;
      min-height: 600px;

      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }
    }

    /* 💤 Placeholder */
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
