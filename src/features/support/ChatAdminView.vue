<template>
  <div class="chat-admin">
    <BasicText
      size="h4"
      weight="bold"
    >
      💬 Messages clients
    </BasicText>

    <div class="chat-admin__layout">
      <!-- 📜 Conversations -->
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
            <small class="preview">{{ conv.lastMessagePreview }}</small>
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

      <!-- 💬 Zone messages -->
      <section
        v-if="selectedUserId"
        class="chat-admin__messages"
      >
        <transition
          name="fade-scale"
          mode="out-in"
        >
          <div
            v-if="isMessagesLoading"
            key="loader"
            class="messages-loader"
          >
            <BasicLoader />
            <span>Chargement des messages...</span>
          </div>

          <div
            v-else
            key="messages"
            class="messages-list"
          >
            <ChatMessage
              v-for="msg in messages"
              :key="msg.id"
              :message="msg"
              :isMine="msg.sender_role === 'admin'"
            />

            <!-- 💭 "Utilisateur écrit..." -->
            <transition name="typing-fade">
              <div
                v-if="isTyping"
                class="typing-bubble"
              >
                <span class="dot" />
                <span class="dot" />
                <span class="dot" />
              </div>
            </transition>
          </div>
        </transition>

        <!-- 🧩 Input -->
        <div class="send-box">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Écrire un message..."
            @input="sendTyping"
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
  import { useChatNotifStore } from '@/features/support/stores/useChatNotifStore'
  import { computed, nextTick, watch } from 'vue'

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
    observeMessages,
  } = useAdminChat()

  const chatNotif = useChatNotifStore()
  const unreadCountByUser = computed(() => chatNotif.unreadByUser)

  // ✅ Quand une conversation s’ouvre, on rebranche l’observateur après transition
  watch(selectedUserId, async (uid) => {
    if (!uid) return
    await nextTick()
    setTimeout(observeMessages, 250)
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
      position: relative;
      background: @neutral-50;
      border-right: 1px solid @neutral-200;
      overflow-y: auto;
      padding: 8px;

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
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
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
            line-height: 1;
            flex-shrink: 0;
          }
        }
      }
    }

    &__messages {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: white;
      border-left: 1px solid @neutral-200;
      height: 600px;
      position: relative;

      .messages-loader {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: @neutral-600;
        font-size: 14px;
        background: fade(white, 90%);
        z-index: 5;
      }

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

  /* ✨ Animations messages */
  .message-fade-enter-active {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .message-fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .message-fade-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }
  .message-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }

  /* ✨ Transition globale (chargement ↔ contenu) */
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: all 0.35s ease;
  }
  .fade-scale-enter-from {
    opacity: 0;
    transform: scale(0.97) translateY(8px);
  }
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.98) translateY(-8px);
  }

  /* 💭 Typing subtle fade */
  .typing-fade-enter-active,
  .typing-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .typing-fade-enter-from,
  .typing-fade-leave-to {
    opacity: 0;
  }
</style>
