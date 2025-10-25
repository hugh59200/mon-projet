<template>
  <div class="chat-admin">
    <BasicText
      size="h4"
      weight="bold"
    >
      💬 Messages clients
    </BasicText>

    <div class="chat-admin__layout">
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
            <span class="email">{{ conv.user_email || 'Utilisateur anonyme' }}</span>
          </div>
          <div class="conversation-footer">
            <small class="preview">{{ conv.last_message }}</small>
            <div
              v-if="unreadCountByUser[conv.user_id]"
              class="badge"
            >
              {{ unreadCountByUser[conv.user_id] }}
            </div>
          </div>
        </div>

        <div
          v-if="!conversations.length"
          class="no-conv"
        >
          Aucune conversation pour le moment.
        </div>
      </aside>

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
  import { useAdminChat } from '@/features/support/composables/useAdminChat'
  import { useChatNotifStore } from '@/features/support/stores/useChatNotifStore'
  import { computed } from 'vue'

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

  const chatNotif = useChatNotifStore()
  const unreadCountByUser = computed(() => chatNotif.unreadByUser)
</script>

<style scoped lang="less">
  .chat-admin {
    display: flex;
    flex-direction: column;
    /* ❌ Supprimer */
    /* height: 100vh; */
    padding: 30px;
    gap: 24px;
    background: @neutral-50;

    &__layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      border: 1px solid @neutral-200;
      border-radius: 10px;
      overflow: hidden;
      background: white;
      /* ❌ Supprimer */
      /* flex: 1; */
      /* ❌ Supprimer */
      /* min-height: 0; */
      align-items: start; // ✅ pour que la hauteur s’adapte à l’enfant
    }

    &__sidebar {
      background: @neutral-50;
      border-right: 1px solid @neutral-200;
      overflow-y: auto;
      padding: 8px;
    }

    &__messages {
      display: flex;
      flex-direction: column;
      position: relative;
      /* ❌ Supprimer height: 100% */
      background: white;
    }
    /* Le composant ChatCore s'adapte à la hauteur ici */
    :deep(.chat-core) {
      flex: 1;
      display: flex;
      flex-direction: column;

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }
    }

    &__placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .conversation-item {
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 6px;

      &:hover {
        background: fade(@primary-600, 8%);
      }

      &.active {
        background: fade(@primary-600, 15%);
        border-left: 3px solid @primary-600;
        box-shadow: inset 3px 0 0 fade(@primary-600, 25%);
      }

      .conversation-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        color: @neutral-900;

        .email {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .conversation-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .preview {
          color: @neutral-600;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          margin-right: 8px;
        }

        .badge {
          background: @primary-600;
          color: white;
          font-size: 12px;
          font-weight: 600;
          border-radius: 999px;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
        }
      }
    }
  }
</style>
