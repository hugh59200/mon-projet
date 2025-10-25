<template>
  <div
    class="chat-container"
    :class="{ open: isOpen }"
  >
    <!-- 🟢 Bouton flottant -->
    <button
      class="chat-toggle"
      @click="toggleChat"
    >
      <BasicIconNext name="MessageCircle" />
    </button>

    <!-- 💬 Fenêtre de chat -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="chat-window"
      >
        <div class="chat-header">
          <span>Support Fast Peptides</span>
          <button @click="toggleChat">
            <BasicIconNext name="X" />
          </button>
        </div>

        <!-- 🔄 Loader pendant initialisation -->
        <div
          v-if="!isReady"
          class="chat-loader"
        >
          <BasicLoader />
          <span>Connexion au support...</span>
        </div>

        <!-- 💬 Contenu du chat -->
        <template v-else>
          <!-- Transition group = animation sur messages -->
          <transition-group
            name="message-fade"
            tag="div"
            class="chat-messages"
          >
            <ChatMessage
              v-for="msg in messages"
              :key="msg.id"
              :message="msg"
              :isMine="msg.sender_role === 'user'"
            />

            <!-- 💭 Bulle "l’admin écrit..." -->
            <transition name="typing-fade">
              <div
                v-if="isTyping"
                class="typing-bubble"
                key="typing"
              >
                <span class="dot" />
                <span class="dot" />
                <span class="dot" />
              </div>
            </transition>
          </transition-group>

          <!-- 🧩 Zone d’envoi -->
          <form
            class="chat-input"
            @submit.prevent="sendMessage"
          >
            <input
              v-model="newMessage"
              type="text"
              placeholder="Écrire un message..."
              required
              @input="sendTyping"
            />
            <button type="submit">
              <BasicIconNext name="Send" />
            </button>
          </form>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue'
  import ChatMessage from './ChatMessage.vue'
  import { useUserChat } from './composables/useUserChat'

  const { messages, newMessage, isTyping, sendMessage, sendTyping, isReady, observeMessages } =
    useUserChat()

  const isOpen = ref(false)
  const toggleChat = () => (isOpen.value = !isOpen.value)

  watch(isOpen, async (open) => {
    if (open) {
      await nextTick()
      observeMessages()
    }
  })
</script>

<style scoped lang="less">
  .chat-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1200;

    .chat-toggle {
      background-color: @primary-600;
      color: white;
      border: none;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      box-shadow: 0 4px 12px fade(black, 20%);
      cursor: pointer;
      transition: transform 0.2s;
      &:hover {
        transform: scale(1.05);
      }
    }

    .chat-window {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 320px;
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 8px 24px fade(black, 20%);
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .chat-header {
        background-color: @secondary-800;
        color: white;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-loader {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 24px;
        color: @neutral-600;
        font-size: 14px;
      }

      .chat-messages {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        max-height: 300px;
        background-color: @neutral-50;
        scroll-behavior: smooth;
      }

      .chat-input {
        display: flex;
        border-top: 1px solid @neutral-200;

        input {
          flex: 1;
          padding: 10px;
          border: none;
          outline: none;
          background: @neutral-50;
        }

        button {
          background: none;
          border: none;
          padding: 10px 12px;
          cursor: pointer;
        }
      }
    }
  }

  /* 💭 Animation "admin tape..." */
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

  /* ✨ Transitions */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .typing-fade-enter-active,
  .typing-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .typing-fade-enter-from,
  .typing-fade-leave-to {
    opacity: 0;
  }

  /* 💬 Animation sur nouveaux messages */
  .message-fade-enter-active {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .message-fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .message-fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .message-fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }
</style>
