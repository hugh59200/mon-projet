<template>
  <div
    class="chat-widget"
    :class="{ open: isOpen }"
  >
    <!-- 🟢 Bouton principal -->
    <button
      class="chat-toggle"
      @click="toggleChat"
    >
      <BasicIconNext
        name="Headphones"
        :size="26"
        color="white"
      />
      <div
        v-if="unreadCount > 0"
        class="chat-badge"
      >
        {{ unreadCount }}
      </div>
    </button>

    <!-- 💬 Fenêtre de chat -->
    <transition name="fade-scale">
      <div
        v-if="isOpen"
        class="chat-window"
      >
        <header class="chat-header">
          <div class="chat-title">
            <BasicIconNext
              name="MessageCircle"
              :size="20"
              color="white"
            />
            <span>Support Fast Peptides</span>
          </div>
          <button
            class="close-btn"
            @click="toggleChat"
          >
            <BasicIconNext
              name="X"
              :size="20"
              color="white"
            />
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
  import ChatCore from './components/ChatCore.vue'
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
      background: @primary-600; /* turquoise */
      color: white;
      border: none;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      box-shadow: 0 4px 12px fade(black, 20%);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        transform 0.2s ease,
        background 0.3s ease,
        box-shadow 0.3s ease;

      /* ✅ Rendre l’icône bien visible */
      .basic-icon-next {
        color: white !important;
        filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.4));
      }

      &:hover {
        transform: scale(1.05);
        background: @primary-700;
        box-shadow: 0 6px 14px fade(black, 25%);
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
        box-shadow: 0 2px 6px fade(black, 25%);
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

      .chat-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 15px;
      }

      .close-btn {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        transition: transform 0.2s ease;
        &:hover {
          transform: scale(1.1);
        }
      }
    }

    /* ✨ Animation ouverture/fermeture */
    .fade-scale-enter-active,
    .fade-scale-leave-active {
      transition: all 0.25s ease;
    }
    .fade-scale-enter-from,
    .fade-scale-leave-to {
      opacity: 0;
      transform: scale(0.9);
    }
  }
</style>
