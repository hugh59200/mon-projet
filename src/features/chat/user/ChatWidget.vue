<template>
  <div
    class="chat-widget"
    :class="{ 'chat-widget--open': chatStore.isOpen }"
  >
    <!-- bouton -->
    <button
      class="chat-widget__toggle"
      @click="toggleChat"
    >
      <BasicIconNext
        name="Headphones"
        :size="26"
        color="white"
      />
      <div
        v-if="chatNotif.unreadCount > 0"
        class="chat-widget__badge"
      >
        {{ chatNotif.unreadCount }}
      </div>
    </button>

    <!-- fenêtre -->
    <transition name="fade-scale">
      <div
        v-if="chatStore.isOpen"
        class="chat-widget__window"
      >
        <header class="chat-widget__header">
          <div class="chat-widget__header-left">
            <div class="chat-widget__header-icon">
              <BasicIconNext
                name="MessageCircle"
                :size="18"
                :color="'white' as IconColor"
              />
            </div>
            <div class="chat-widget__header-info">
              <span class="chat-widget__header-title">Support Fast Peptides</span>
              <span class="chat-widget__header-status">En ligne</span>
            </div>
          </div>

          <div
            class="chat-widget__header-close"
            @click="toggleChat"
          >
            <BasicIconNext
              name="X"
              :size="18"
              :color="'white' as IconColor"
            />
          </div>
        </header>

        <ChatCore
          v-if="userId"
          v-model:new-message="newMessage"
          :messages="messages"
          :is-typing="isTyping"
          :loading="!isReady"
          current-role="user"
          :send-message="sendMessage"
          :send-typing="sendTyping"
          :height="400"
        />
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
  import type { IconColor } from '@designSystem/index'
  import { onMounted, onUnmounted } from 'vue'
  import ChatCore from '../shared/components/ChatCore.vue'
  import { useChat } from '../shared/composables/useChat'
  import { useChatNotifStore } from '../shared/stores/useChatNotifStore'
  import { useChatWidgetStore } from './useChatWidgetStore'

  const chatNotif = useChatNotifStore()
  const chatStore = useChatWidgetStore()
  const userChat = useChat('user')

  const { sendMessage, sendTyping, userId, messages, newMessage, isTyping, isReady } = userChat

  onMounted(async () => {
    chatNotif.setRole('user')
    chatNotif.listenRealtime()
    await chatNotif.fetchUnreadByUser()
  })

  const toggleChat = async () => {
    chatStore.toggleChat()

    if (chatStore.isOpen) {
      const uid = userId.value
      if (uid) await chatNotif.markAsRead(uid)
    }
  }

  onUnmounted(() => {
    document.removeEventListener('click', handleClickAnywhere)
  })

  const handleClickAnywhere = () => chatStore.resetUnread()
  document.addEventListener('click', handleClickAnywhere)
</script>

<style scoped lang="less">
  .chat-widget {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;

    &__toggle {
      position: relative;
      background: var(--primary-600);
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

      &:hover {
        transform: scale(1.05);
        background: var(--primary-700);
      }
    }

    &__badge {
      position: absolute;
      top: -4px;
      right: 0;
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
      animation: badge-pop 0.25s ease;
    }

    &__window {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 340px;
      background: white;
      border-radius: 14px;
      box-shadow: 0 8px 20px fade(black, 25%);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    &__header {
      background: linear-gradient(135deg, var(--primary-700), var(--primary-600));
      color: white;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid fade(white, 15%);
      box-shadow: 0 1px 4px fade(black, 20%);
    }

    &__header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__header-icon {
      background: fade(white, 12%);
      border-radius: 999px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__header-info {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    &__header-title {
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.2px;
    }

    &__header-status {
      font-size: 11px;
      color: fade(white, 75%);
    }

    &__header-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: background 0.2s ease;

      &:hover {
        background: fade(white, 10%);
      }
    }

    /* ------------------------- Animations ------------------------- */
    .fade-scale-enter-active,
    .fade-scale-leave-active {
      transition: all 0.25s ease;
    }
    .fade-scale-enter-from,
    .fade-scale-leave-to {
      opacity: 0;
      transform: scale(0.9);
    }

    @keyframes badge-pop {
      0% {
        transform: scale(0.6);
        opacity: 0;
      }
      60% {
        transform: scale(1.2);
        opacity: 1;
      }
      100% {
        transform: scale(1);
      }
    }
  }
</style>
