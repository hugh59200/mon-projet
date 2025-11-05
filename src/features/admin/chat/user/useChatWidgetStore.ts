import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatWidgetStore = defineStore(
  'chatWidget',
  () => {
    const isOpen = ref(false)
    const unreadCount = ref(0)

    // ✅ nouveau : conversation ouverte côté admin
    const currentUserId = ref<string | null>(null)

    const openChat = () => {
      isOpen.value = true
      resetUnread()
    }

    const closeChat = () => {
      isOpen.value = false
      currentUserId.value = null
    }

    const toggleChat = () => {
      isOpen.value = !isOpen.value
      if (isOpen.value) resetUnread()
    }

    const resetUnread = () => {
      unreadCount.value = 0
    }

    const incrementUnread = () => {
      if (!isOpen.value) unreadCount.value++
    }

    return {
      isOpen,
      unreadCount,
      currentUserId, // ✅ exposé ici
      openChat,
      closeChat,
      toggleChat,
      resetUnread,
      incrementUnread,
    }
  },
  {
    persist: {
      key: 'chat-widget',
      storage: localStorage,
      pick: ['isOpen', 'unreadCount', 'currentUserId'],
    },
  },
)
