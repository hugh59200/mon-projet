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
        v-if="chatNotif.unreadCount > 0"
        class="chat-badge"
      >
        {{ chatNotif.unreadCount }}
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
  import { onMounted, onUnmounted, ref, watch } from 'vue'
  import ChatCore from './components/ChatCore.vue'
  import { useUserChat } from './composables/useUserChat'
  import { useChatNotifStore } from './stores/useChatNotifStore'
  import { useChatWidgetStore } from './stores/useChatWidgetStore'

  /* ------------------------- Stores ------------------------- */
  const chatNotif = useChatNotifStore()
  const chatStore = useChatWidgetStore()

  /* ------------------------- State ------------------------- */
  const isOpen = ref(false)
  const userId = ref<string | null>(null)

  /* ✅ Composable appelé directement, sans attendre */
  /* 🚀 Initialise plus tard, quand on a l’ID */
  const chat = useUserChat()

  const { messages, newMessage, isTyping, isReady, sendMessage, sendTyping, initChat } = chat

  /* ------------------------- Lifecycle ------------------------- */
  onMounted(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    userId.value = user?.id ?? null
    console.log(user?.app_metadata)

    await initChat() // ✅ Initialisation différée

    chatNotif.setRole('user')
    chatNotif.listenRealtime()
    chatNotif.fetchUnreadByUser()
  })

  /* ------------------------- Toggle Chat ------------------------- */
  const toggleChat = async () => {
    isOpen.value = !isOpen.value

    if (isOpen.value) {
      chatStore.resetUnread()
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id
      if (uid) {
        const lastMsg = messages.value.at(-1)
        if (lastMsg) {
          await chatNotif.markAsRead(uid, lastMsg.id)
        }
      }
    }
  }

  /* ------------------------- Sync Store ------------------------- */
  watch(
    () => chatStore.isOpen,
    (val) => (isOpen.value = val),
  )
  watch(isOpen, (val) => (chatStore.isOpen = val))

  /* ------------------------- Global click reset ------------------------- */
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
