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
          <button @click="toggleChat"><BasicIconNext name="X" /></button>
        </div>

        <div class="chat-messages">
          <ChatMessage
            v-for="msg in messages"
            :key="msg.id"
            :message="msg"
            :isMine="msg.user_id === user?.id"
          />
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
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { supabase } from '@/services/supabaseClient'
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import ChatMessage from './ChatMessage.vue'
  import { useChatStore } from './stores/useChatStore'

  const chat = useChatStore()
  const user = useAuthStore().user
  const messages = chat.messages
  const newMessage = ref('')
  const isOpen = ref(false)
  const endOfChat = ref<HTMLDivElement>()

  const toggleChat = () => (isOpen.value = !isOpen.value)

  const sendMessage = async () => {
    if (!newMessage.value.trim()) return
    await chat.sendMessage(newMessage.value)
    newMessage.value = ''
    nextTick(() => {
      endOfChat.value?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  let channel: any

  onMounted(() => {
    channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          chat.addMessage(payload.new)
        },
      )
      .subscribe()
  })

  onUnmounted(() => {
    supabase.removeChannel(channel)
  })

  watch(messages, () => {
    nextTick(() => endOfChat.value?.scrollIntoView({ behavior: 'smooth' }))
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
</style>
