import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatWidgetStore = defineStore(
  'chatWidget',
  () => {
    const isOpen = ref(false)
    const unreadCount = ref(0)

    const openChat = () => (isOpen.value = true)
    const closeChat = () => (isOpen.value = false)
    const toggleChat = () => (isOpen.value = !isOpen.value)
    const resetUnread = () => (unreadCount.value = 0)
    const incrementUnread = () => unreadCount.value++

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
    persist: {
      key: 'user:chat-widget',
      storage: localStorage,
      pick: ['isOpen', 'unreadCount'], // ✅ sauvegarde automatique
    },
  },
)
