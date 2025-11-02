import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useChatWidgetStore = defineStore(
  'chatWidget',
  () => {
    /** 💬 État général du widget */
    const isOpen = ref(false)

    /** 🔢 Compteur de messages non lus (local) */
    const unreadCount = ref(0)

    /* ------------------------- 🧩 Actions ------------------------- */

    /** Ouvre le chat et réinitialise le compteur */
    const openChat = () => {
      isOpen.value = true
      resetUnread()
    }

    /** Ferme le chat (sans reset du compteur) */
    const closeChat = () => {
      isOpen.value = false
    }

    /** Bascule le chat (toggle) */
    const toggleChat = () => {
      isOpen.value = !isOpen.value
      // Si on ouvre → on considère tout comme lu
      if (isOpen.value) resetUnread()
    }

    /** Réinitialise le compteur */
    const resetUnread = () => {
      unreadCount.value = 0
    }

    /** Incrémente le compteur uniquement si le chat est fermé */
    const incrementUnread = () => {
      if (!isOpen.value) unreadCount.value++
    }

    /* ------------------------- 💾 Persistance ------------------------- */

    // Sauvegarde automatique du compteur local
    watch(unreadCount, (val) => {
      localStorage.setItem('user:unread-count', String(val))
    })

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
