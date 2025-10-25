<template>
  <div class="chat-admin">
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

      <div
        v-if="totalUnread > 0"
        class="header-badge"
      >
        {{ totalUnread }} nouveau{{ totalUnread > 1 ? 'x' : '' }} message{{
          totalUnread > 1 ? 's' : ''
        }}
      </div>
    </header>

    <div class="chat-admin__layout">
      <!-- 📋 Sidebar -->
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
  import ChatSidebar from '@/features/support/components/ChatSidebar.vue'
  import { useAdminChat } from '@/features/support/composables/useAdminChat'
  import { useChatNotifStore } from '@/features/support/stores/useChatNotifStore'
  import { computed } from 'vue'
  import ChatCore from './components/ChatCore.vue'

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

  const notifStore = useChatNotifStore()
  const totalUnread = computed(() =>
    Object.values(notifStore.unreadByUser || {}).reduce((a, b) => a + (b || 0), 0),
  )
</script>

<style scoped lang="less">
  .chat-admin {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 32px;
    background: @neutral-50;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      color: @neutral-800;

      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .header-badge {
        background: @primary-600;
        color: white;
        font-size: 13px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
        box-shadow: 0 2px 4px fade(@primary-600, 25%);
      }
    }

    &__layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px fade(@neutral-900, 5%);
      border: 1px solid @neutral-200;
      align-items: stretch;
      min-height: 600px;
      overflow: visible;

      /* 📱 Responsive mobile */
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        min-height: 100vh;
      }
    }

    &__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: @neutral-600;
      gap: 12px;
      min-height: 600px;
    }
  }
</style>
