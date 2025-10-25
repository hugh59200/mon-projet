<template>
  <div
    class="chat-widget"
    :class="{ open: isOpen }"
  >
    <button
      class="chat-toggle"
      @click="toggleChat"
    >
      <BasicIconNext name="MessageCircle" />
      <div
        v-if="unreadCount > 0"
        class="chat-badge"
      >
        {{ unreadCount }}
      </div>
    </button>

    <transition name="fade-scale">
      <div
        v-if="isOpen"
        class="chat-window"
      >
        <header class="chat-header">
          <div class="chat-title">
            <BasicIconNext name="Headphones" />
            <span>Support Fast Peptides</span>
          </div>
          <button
            class="close-btn"
            @click="toggleChat"
          >
            <BasicIconNext name="X" />
          </button>
        </header>

        <ChatCore
          v-model:new-message="newMessage"
          :messages="messages"
          :is-typing="isTyping"
          :loading="!isReady"
          current-role="user"
          :send-message="sendMessage"
          :send-typing="sendTyping"
          :height="600"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import ChatCore from './ChatCore.vue'
  import { useUserChat } from './composables/useUserChat'

  const { messages, newMessage, isTyping, sendMessage, sendTyping, isReady } = useUserChat()

  const isOpen = ref(false)
  const unreadCount = ref(0)
  let hideBadgeTimer: ReturnType<typeof setTimeout> | null = null

  const toggleChat = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      unreadCount.value = 0
      clearTimeout(hideBadgeTimer!)
    }
  }

  watch(
    () => messages.value.length,
    async (newLen, oldLen) => {
      if (newLen <= oldLen) return
      await nextTick()
      const lastMsg = messages.value[0]
      const fromAdmin = lastMsg?.sender_role === 'admin'
      if (!isOpen.value && fromAdmin) {
        unreadCount.value++
        clearTimeout(hideBadgeTimer!)
        hideBadgeTimer = setTimeout(() => (unreadCount.value = 0), 2000)
      }
    },
  )

  const handleClickAnywhere = () => {
    if (unreadCount.value > 0) {
      unreadCount.value = 0
      clearTimeout(hideBadgeTimer!)
    }
  }

  onMounted(() => document.addEventListener('click', handleClickAnywhere))
  onUnmounted(() => document.removeEventListener('click', handleClickAnywhere))
</script>

<style scoped lang="less">
  .chat-widget {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;

    .chat-toggle {
      position: relative;
      background: @primary-600;
      color: white;
      border: none;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      box-shadow: 0 4px 12px fade(black, 20%);
      cursor: pointer;
      transition: transform 0.2s ease;
      &:hover {
        transform: scale(1.05);
      }
      .chat-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        background: @danger-600;
        color: white;
        border-radius: 999px;
        min-width: 20px;
        height: 20px;
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .chat-window {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 340px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 20px fade(black, 25%);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .chat-header {
      background: @primary-700;
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
