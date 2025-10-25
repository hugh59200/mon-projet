<template>
  <div class="chat-admin">
    <header class="chat-admin__header">
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
    </header>

    <div class="chat-admin__layout">
      <!-- 📋 Sidebar isolée -->
      <ChatSidebar
        :conversations="conversations"
        :selected-id="selectedUserId"
        @select="selectConversation"
      />

      <!-- 💬 Zone de chat -->
      <ChatCore
        v-if="selectedUserId"
        v-model:new-message="newMessage"
        :messages="messages"
        :is-typing="isTyping"
        :loading="isMessagesLoading"
        current-role="admin"
        :send-message="sendMessage"
        :send-typing="sendTyping"
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
  import ChatCore from '@/features/support/ChatCore.vue'
  import ChatSidebar from '@/features/support/components/ChatSidebar.vue'
  import { useAdminChat } from '@/features/support/composables/useAdminChat'

  const {
    conversations,
    messages,
    selectedUserId,
    newMessage,
    isTyping,
    isMessagesLoading,
    selectConversation,
    sendMessage,
    sendTyping,
  } = useAdminChat()
</script>

<style scoped lang="less">
  .chat-admin {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 32px;
    background: @neutral-50;
    height: 100vh;

    &__header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: @neutral-800;
    }

    &__layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px fade(@neutral-900, 5%);
      border: 1px solid @neutral-200;
      flex: 1;
      min-height: 0;
    }

    &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: @neutral-600;
      gap: 12px;
    }
  }
</style>
