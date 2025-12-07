<template>
  <div
    class="chat-widget"
    :class="{
      'chat-widget--open': chatStore.isOpen,
      'chat-widget--hidden': !isButtonVisible && !chatStore.isOpen
    }"
  >
    <!-- Bouton flottant -->
    <button
      class="chat-widget__toggle"
      :class="{ 'chat-widget__toggle--active': chatStore.isOpen }"
      @click="toggleChat"
    >
      <Transition
        name="icon-morph"
        mode="out-in"
      >
        <BasicIconNext
          v-if="!chatStore.isOpen"
          key="headphones"
          name="Headphones"
          :size="24"
          color="white"
        />
        <BasicIconNext
          v-else
          key="x"
          name="X"
          :size="24"
          color="white"
        />
      </Transition>

      <!-- Badge de notifications -->
      <Transition name="badge-pop">
        <div
          v-if="chatNotif.unreadCount > 0 && !chatStore.isOpen"
          class="chat-widget__badge"
        >
          <span>{{ chatNotif.unreadCount > 9 ? '9+' : chatNotif.unreadCount }}</span>
        </div>
      </Transition>

      <!-- Pulse d'animation -->
      <span
        v-if="chatNotif.unreadCount > 0 && !chatStore.isOpen"
        class="chat-widget__pulse"
      />
    </button>

    <!-- Fenêtre de chat -->
    <Transition name="window-slide">
      <div
        v-if="chatStore.isOpen"
        class="chat-widget__window"
      >
        <!-- Header premium -->
        <header class="chat-widget__header">
          <div class="chat-widget__header-left">
            <div class="chat-widget__header-avatar">
              <img
                v-if="supportAvatar"
                :src="supportAvatar"
                alt="Support"
                class="chat-widget__header-avatar-img"
              />
              <BasicIconNext
                v-else
                name="Headphones"
                :size="18"
                :color="'white' as IconColor"
              />
              <span class="chat-widget__header-status-dot" />
            </div>
            <div class="chat-widget__header-info">
              <span class="chat-widget__header-title">Support Fast Peptides</span>
              <span class="chat-widget__header-status">
                <span class="chat-widget__header-status-indicator" />
                En ligne
              </span>
            </div>
          </div>

          <PremiumButton
            type="secondary"
            variant="ghost"
            size="sm"
            icon-left="Minus"
            class="chat-widget__header-close"
            @click="toggleChat"
          />
        </header>

        <!-- Zone de chat -->
        <ChatCore
          v-if="userId"
          v-model:new-message="newMessage"
          :messages="messages"
          :is-typing="isTyping"
          :loading="!isReady"
          current-role="user"
          :send-message="sendMessage"
          :send-typing="sendTyping"
          :height="chatHeight"
          :conversation-id="userId"
          :other-role-avatar="supportAvatar"
        />
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import type { IconColor } from '@designSystem/index'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import ChatCore from '@/features/chat/shared/components/ChatCore.vue'
  import { useChat } from '@/features/chat/shared/composables/useChat'
  import { useChatNotifStore } from '@/features/chat/shared/stores/useChatNotifStore'
  import { useChatWidgetStore } from './useChatWidgetStore'
  import { getSupportProfile, getAvatarDisplayUrl } from '@/api/supabase/profiles'

  const { isMobile } = useDeviceBreakpoint()
  const chatHeight = computed(() => (isMobile.value ? undefined : 400))

  const chatNotif = useChatNotifStore()
  const chatStore = useChatWidgetStore()
  const userChat = useChat('user')

  const { sendMessage, sendTyping, userId, messages, newMessage, isTyping, isReady } = userChat

  // Avatar du support
  const supportAvatar = ref<string | null>(null)

  async function loadSupportAvatar() {
    const profile = await getSupportProfile()
    if (profile?.avatar_url) {
      supportAvatar.value = getAvatarDisplayUrl(profile.avatar_url)
    }
  }

  // Auto-hide logic
  const isButtonVisible = ref(true)
  const lastScrollY = ref(0)
  const scrollThreshold = 50

  const handleScroll = () => {
    const currentScrollY = window.scrollY
    const scrollingDown = currentScrollY > lastScrollY.value + scrollThreshold
    const scrollingUp = currentScrollY < lastScrollY.value - scrollThreshold
    const isAtTop = currentScrollY < 100

    // Toujours visible si chat ouvert ou notifs non lues
    if (chatStore.isOpen || chatNotif.unreadCount > 0) {
      isButtonVisible.value = true
    } else if (isAtTop) {
      isButtonVisible.value = true
    } else if (scrollingDown) {
      isButtonVisible.value = false
      lastScrollY.value = currentScrollY
    } else if (scrollingUp) {
      isButtonVisible.value = true
      lastScrollY.value = currentScrollY
    }
  }

  onMounted(async () => {
    chatNotif.setRole('user')
    chatNotif.listenRealtime()
    await chatNotif.fetchUnreadByUser()
    await loadSupportAvatar()
    window.addEventListener('scroll', handleScroll, { passive: true })
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
    window.removeEventListener('scroll', handleScroll)
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
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &--hidden {
      transform: translateY(100px);
      pointer-events: none;
    }

    // ─────────────────────────────────────────
    // Bouton flottant
    // ─────────────────────────────────────────
    &__toggle {
      position: relative;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      box-shadow:
        0 4px 16px color-mix(in srgb, var(--primary-600) 40%, transparent),
        0 2px 8px color-mix(in srgb, @neutral-900 15%, transparent);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      &:hover {
        transform: translateY(-2px);
        box-shadow:
          0 6px 24px color-mix(in srgb, var(--primary-600) 50%, transparent),
          0 4px 12px color-mix(in srgb, @neutral-900 20%, transparent);
      }

      &:active {
        transform: scale(0.98);
      }

      &--active {
        background: linear-gradient(135deg, @neutral-600 0%, @neutral-700 100%);
        box-shadow:
          0 4px 16px color-mix(in srgb, @neutral-700 30%, transparent),
          0 2px 8px color-mix(in srgb, @neutral-900 15%, transparent);
      }
    }

    // ─────────────────────────────────────────
    // Badge
    // ─────────────────────────────────────────
    &__badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: linear-gradient(135deg, @danger-500 0%, @danger-600 100%);
      color: white;
      border-radius: 12px;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 2px 8px color-mix(in srgb, @danger-600 50%, transparent),
        0 0 0 2px white;
      border: none;
    }

    // ─────────────────────────────────────────
    // Pulse
    // ─────────────────────────────────────────
    &__pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: var(--primary-500);
      animation: pulse-ring 2s ease-out infinite;
      pointer-events: none;
    }

    // ─────────────────────────────────────────
    // Fenêtre
    // ─────────────────────────────────────────
    &__window {
      position: absolute;
      bottom: 76px;
      right: 0;
      width: 380px;
      background: white;
      border-radius: 20px;
      box-shadow:
        0 12px 40px color-mix(in srgb, @neutral-900 25%, transparent),
        0 4px 16px color-mix(in srgb, @neutral-900 10%, transparent);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, @neutral-200 50%, transparent);
    }

    // ─────────────────────────────────────────
    // Header
    // ─────────────────────────────────────────
    &__header {
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: white;
      padding: 14px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid color-mix(in srgb, white 10%, transparent);
    }

    &__header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &__header-avatar {
      position: relative;
      background: color-mix(in srgb, white 15%, transparent);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;

      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    &__header-status-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 12px;
      height: 12px;
      background: #22c55e;
      border-radius: 50%;
      border: 2px solid var(--primary-600);
      animation: status-pulse 2s ease-in-out infinite;
    }

    &__header-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__header-title {
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.1px;
    }

    &__header-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: color-mix(in srgb, white 80%, transparent);
    }

    &__header-status-indicator {
      width: 6px;
      height: 6px;
      background: #22c55e;
      border-radius: 50%;
      animation: status-blink 2s ease-in-out infinite;
    }

    &__header-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: color-mix(in srgb, white 10%, transparent);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: color-mix(in srgb, white 20%, transparent);
      }
    }
  }

  // ─────────────────────────────────────────
  // Animations
  // ─────────────────────────────────────────
  @keyframes pulse-ring {
    0% {
      opacity: 0.6;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes status-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 color-mix(in srgb, #22c55e 40%, transparent);
    }
    50% {
      box-shadow: 0 0 0 4px color-mix(in srgb, #22c55e 0%, transparent);
    }
  }

  @keyframes status-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  // ─────────────────────────────────────────
  // Transitions
  // ─────────────────────────────────────────
  .icon-morph-enter-active,
  .icon-morph-leave-active {
    transition: all 0.2s ease;
  }

  .icon-morph-enter-from {
    opacity: 0;
    transform: scale(0.5) rotate(-90deg);
  }

  .icon-morph-leave-to {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
  }

  .badge-pop-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .badge-pop-leave-active {
    transition: all 0.2s ease;
  }

  .badge-pop-enter-from {
    opacity: 0;
    transform: scale(0);
  }

  .badge-pop-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }

  .window-slide-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .window-slide-leave-active {
    transition: all 0.25s ease;
  }

  .window-slide-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }

  .window-slide-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }

  // ─────────────────────────────────────────
  // Mobile responsive
  // ─────────────────────────────────────────
  .respond-mobile({
    .chat-widget {
      bottom: 16px;
      right: 16px;

      &__toggle {
        width: 56px;
        height: 56px;
      }

      &__window {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
        box-shadow: none;
        border: none;
      }

      &__header {
        padding: calc(16px + env(safe-area-inset-top, 0px)) 20px 16px;
        border-radius: 0;
      }

      &__header-avatar {
        width: 44px;
        height: 44px;
      }

      &__header-title {
        font-size: 17px;
      }

      &__header-status {
        font-size: 13px;
      }

      &__header-close {
        width: 44px;
        height: 44px;
        min-width: 44px;
      }
    }

    .window-slide-enter-from {
      opacity: 0;
      transform: translateY(100%);
    }

    .window-slide-leave-to {
      opacity: 0;
      transform: translateY(50%);
    }
  });
</style>
