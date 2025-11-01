<template>
  <div
    class="chat-widget"
    :class="{ open: isChatOpen }"
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
        v-if="chatNotif.unreadCount > 0"
        class="chat-badge"
      >
        {{ chatNotif.unreadCount }}
      </div>
    </button>

    <!-- 💬 Fenêtre de chat -->
    <transition name="fade-scale">
      <div
        v-if="isChatOpen"
        class="chat-window"
      >
        <!-- 🌟 Header modernisé -->
        <header class="chat-header">
          <div class="chat-header-left">
            <div class="chat-header-icon">
              <BasicIconNext
                name="MessageCircle"
                :size="18"
                :color="'white' as IconColor"
              />
            </div>
            <div class="chat-header-info">
              <span class="chat-header-title">Support Fast Peptides</span>
              <span class="chat-header-status">En ligne</span>
            </div>
          </div>

          <div
            class="chat-header-close"
            @click="toggleChat"
            aria-label="Fermer le chat"
          >
            <BasicIconNext
              name="X"
              :size="18"
              :color="'white' as IconColor"
            />
          </div>
        </header>

        <!-- 💭 Chat principal -->
        <ChatCore
          v-if="userId"
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
  import { supabase } from '@/supabase/supabaseClient'
  import type { IconColor } from '@designSystem/index'
  import { onMounted, onUnmounted, ref, watch } from 'vue'
  import ChatCore from './components/ChatCore.vue'
  import { useUserChat } from './composables/useUserChat'
  import { useChatNotifStore } from './stores/useChatNotifStore'
  import { useChatWidgetStore } from './stores/useChatWidgetStore'

  /* ------------------------- Stores ------------------------- */
  const chatNotif = useChatNotifStore()
  const chatStore = useChatWidgetStore()

  /* ------------------------- Composable ------------------------- */
  const chat = useUserChat()
  const { isChatOpen, messages, newMessage, isTyping, isReady, sendMessage, sendTyping, initChat } =
    chat

  const userId = ref<string | null>(null)

  /* ------------------------- Lifecycle ------------------------- */
  onMounted(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    userId.value = user?.id ?? null

    await initChat() // ✅ Initialise la session utilisateur

    chatNotif.setRole('user')
    chatNotif.listenRealtime()

    // ✅ Récupère le vrai compteur de non-lus depuis la DB
    await chatNotif.fetchUnreadByUser()

    // 🧠 Si localStorage a une valeur persistée → restaure-la
    const saved = localStorage.getItem('user:unread-count')
    if (saved && !isChatOpen.value && chatNotif.unreadCount === 0) {
      chatNotif.unreadCount = parseInt(saved)
    }

    // 🔁 Met à jour le localStorage automatiquement
    watch(
      () => chatNotif.unreadCount,
      (val) => localStorage.setItem('user:unread-count', String(val)),
    )

    // 🔁 Petit “refresh” 1s après pour fiabilité Supabase
    setTimeout(() => chatNotif.fetchUnreadByUser(), 1000)
  })

  /* ------------------------- Toggle Chat ------------------------- */
  const toggleChat = async () => {
    isChatOpen.value = !isChatOpen.value
    chatStore.isOpen = isChatOpen.value

    if (isChatOpen.value) {
      // ✅ Reset visuel
      chatStore.resetUnread()

      // ✅ Marque tout comme lu dans la DB
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const uid = user?.id
      if (uid) {
        const lastMsg = messages.value.at(-1)
        if (lastMsg) {
          await chatNotif.markAsRead(uid, lastMsg.id)
        }
      }
    }
  }

  /* ------------------------- Sync store ↔ composable ------------------------- */
  watch(
    () => chatStore.isOpen,
    (val) => (isChatOpen.value = val),
  )
  watch(isChatOpen, (val) => (chatStore.isOpen = val))

  /* ------------------------- Reset global ------------------------- */
  const handleClickAnywhere = () => chatStore.resetUnread()
  document.addEventListener('click', handleClickAnywhere)
  onUnmounted(() => document.removeEventListener('click', handleClickAnywhere))
</script>

<style scoped lang="less">
  .chat-widget {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;

    /* ------------------------- Bouton principal ------------------------- */
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
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        transform 0.2s ease,
        background 0.3s ease,
        box-shadow 0.3s ease;

      &:hover {
        transform: scale(1.05);
        background: @primary-700;
      }

      .chat-badge {
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
    }

    /* ------------------------- Fenêtre principale ------------------------- */
    .chat-window {
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

    /* ------------------------- Header modernisé ------------------------- */
    .chat-header {
      background: linear-gradient(135deg, @primary-700, @primary-600);
      color: white;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid fade(white, 15%);
      box-shadow: 0 1px 4px fade(black, 20%);

      .chat-header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .chat-header-icon {
        background: fade(white, 12%);
        border-radius: 999px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .chat-header-info {
        display: flex;
        flex-direction: column;
        line-height: 1.1;

        .chat-header-title {
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.2px;
        }

        .chat-header-status {
          font-size: 11px;
          color: fade(white, 75%);
        }
      }

      .chat-header-close {
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
