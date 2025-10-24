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

        <div class="chat-messages">
          <ChatMessage
            v-for="msg in messages"
            :key="msg.id"
            :message="msg"
            :isMine="msg.sender_role === 'user'"
          />

          <!-- 💭 Bulle typing animée -->
          <div
            v-if="typing.isTypingAdmin"
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
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { supabase } from '@/services/supabaseClient'
  import { storeToRefs } from 'pinia'
  import { nextTick, onMounted, onUnmounted, ref } from 'vue'
  import ChatMessage from './ChatMessage.vue'
  import { useChatStore } from './stores/useChatStore'
  import { useTypingStore } from './stores/useTypingStore'

  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const chat = useChatStore()
  const typing = useTypingStore()
  const { messages } = storeToRefs(chat) // ✅ Rend messages réactif

  const newMessage = ref('')
  const isOpen = ref(false)
  const endOfChat = ref<HTMLDivElement>()
  let typingTimer: any
  let channel: any
  let typingChannel: any

  /* -------------------------------------------------------------------------- */
  /*                                  METHODS                                  */
  /* -------------------------------------------------------------------------- */
  const toggleChat = () => (isOpen.value = !isOpen.value)

  const sendMessage = async () => {
    if (!newMessage.value.trim()) return
    await chat.sendMessage(newMessage.value)
    newMessage.value = ''
    nextTick(() => endOfChat.value?.scrollIntoView({ behavior: 'smooth' }))
  }

  function handleInput() {
    // 🔵 envoi signal "user typing"
    supabase.channel('typing-status').send({
      type: 'broadcast',
      event: 'user_typing',
      payload: { isTyping: true },
    })
    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => {
      supabase.channel('typing-status').send({
        type: 'broadcast',
        event: 'user_typing',
        payload: { isTyping: false },
      })
    }, 1500)
  }

  /* -------------------------------------------------------------------------- */
  /*                                 LIFECYCLE                                 */
  /* -------------------------------------------------------------------------- */
  onMounted(async () => {
    // ✅ récupère l'historique du user connecté
    await chat.fetchMessages()

    // ⚡ Realtime messages
    channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) =>
        chat.addMessage(payload.new),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          const updated = payload.new
          const index = chat.messages.findIndex((m) => m.id === updated.id)
          if (index !== -1) chat.messages[index] = updated
        },
      )
      .subscribe()

    // 👀 Typing realtime
    typingChannel = supabase.channel('typing-status')
    typingChannel
      .on('broadcast', { event: 'admin_typing' }, (payload: { payload: { isTyping: boolean } }) => {
        typing.isTypingAdmin = payload.payload.isTyping
      })
      .subscribe()
  })

  onUnmounted(() => {
    supabase.removeChannel(channel)
    supabase.removeChannel(typingChannel)
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

  /* Animation fade d'ouverture du chat */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
