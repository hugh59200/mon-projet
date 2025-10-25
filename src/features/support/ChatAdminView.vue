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
        <!-- 🔄 Loader pendant initialisation -->
        <div
          v-if="!isReady"
          class="loader"
        >
          <BasicLoader />
          <span>Chargement des conversations...</span>
        </div>

        <template v-else>
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

          <div
            v-if="conversations.length === 0"
            class="no-conv"
          >
            Aucune conversation pour le moment.
          </div>
        </template>
      </aside>

      <!-- 💬 Zone de discussion -->
      <section
        v-if="selectedUserId"
        class="chat-admin__messages"
      >
        <div class="messages-list">
          <ChatMessage
            v-for="msg in messages"
            :key="msg.id"
            :message="msg"
            :isMine="msg.sender_role === 'admin'"
          />

          <!-- 💭 Bulle "utilisateur écrit..." -->
          <div
            v-if="isTyping"
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
            v-model="newMessage"
            placeholder="Écrire un message..."
            type="text"
            @input="handleInput"
            @keyup.enter="sendMessage"
          />
          <BasicButton
            label="Envoyer"
            type="primary"
            size="small"
            :disabled="!newMessage.trim()"
            @click="sendMessage"
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
  import ChatMessage from '@/features/support/ChatMessage.vue'
  import { useAdminChat } from '@/features/support/composables/useAdminChat'

  const {
    conversations,
    messages,
    selectedUserId,
    newMessage,
    isTyping,
    isReady,
    selectConversation,
    sendMessage,
    handleInput,
  } = useAdminChat()
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
      position: relative;

      .loader {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        color: @neutral-600;
        font-size: 14px;
      }

      .no-conv {
        text-align: center;
        color: @neutral-500;
        margin-top: 16px;
        font-size: 14px;
      }

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
      position: relative;
      background: white;
      border-left: 1px solid @neutral-200;
      height: 600px;
      overflow: hidden;

      .messages-list {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        padding-bottom: 70px;
        scroll-behavior: smooth;
      }

      .send-box {
        display: flex;
        align-items: center;
        gap: 8px;
        border-top: 1px solid @neutral-200;
        padding: 12px;
        background: white;
        box-shadow: 0 -2px 6px fade(@neutral-800, 5%);

        input {
          flex: 1;
          border: 1px solid @neutral-200;
          outline: none;
          padding: 10px 12px;
          font-size: 14px;
          border-radius: 8px;
          background: @neutral-50;
          transition: all 0.2s ease;

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

  /* 💭 Bulle typing */
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

  /* 🎨 Scrollbar custom */
  .messages-list::-webkit-scrollbar {
    width: 8px;
  }
  .messages-list::-webkit-scrollbar-thumb {
    background: fade(@neutral-600, 40%);
    border-radius: 8px;
  }
  .messages-list::-webkit-scrollbar-thumb:hover {
    background: fade(@neutral-600, 60%);
  }
  .messages-list::-webkit-scrollbar-track {
    background: fade(@neutral-100, 60%);
  }
</style>
