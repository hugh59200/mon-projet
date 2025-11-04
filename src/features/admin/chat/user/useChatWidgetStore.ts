import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatWidgetStore = defineStore(
  'chatWidget',
  () => {
    const isOpen = ref(false)
    const unreadCount = ref(0)

    const openChat = () => {
      isOpen.value = true
      resetUnread()
    }

    const closeChat = () => {
      isOpen.value = false
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
      openChat,
      closeChat,
      toggleChat,
      resetUnread,
      incrementUnread,
    }
  },
  {
    /* ✅ persistance PAR utilisateur */
    persist: {
      key: 'chat-widget', // ✅ string uniquement
      storage: localStorage,
      pick: ['isOpen', 'unreadCount'],
    },
  },
)
