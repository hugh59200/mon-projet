<template>
  <div
    class="chat-container"
    :class="{ open: isOpen }"
  >
    <!-- Bouton flottant -->
    <button
      class="chat-toggle"
      @click="toggleChat"
    >
      <BasicIconNext name="MessageCircle" />
    </button>

    <!-- Fenêtre de chat -->
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
          <div class="chat-messages">
            <ChatMessage
              v-for="msg in messages"
              :key="msg.id"
              :message="msg"
              :isMine="msg.sender_role === 'user'"
            />

            <!-- 💭 Bulle "admin typing" -->
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

          <form
            class="chat-input"
            @submit.prevent="sendMessage"
          >
            <input
              v-model="newMessage"
              type="text"
              placeholder="Écrire un message..."
              required
              @input="handleInput"
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
  import { ref } from 'vue'
  import ChatMessage from './ChatMessage.vue'
  import { useUserChat } from './composables/useUserChat'

  const { messages, newMessage, isTyping, sendMessage, handleInput, isReady } = useUserChat()

  const isOpen = ref(false)
  const toggleChat = () => (isOpen.value = !isOpen.value)
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
      }

      .chat-input {
        display: flex;
        border-top: 1px solid @neutral-200;
        input {
          flex: 1;
          padding: 10px;
          border: none;
          outline: none;
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

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
