import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTypingStore = defineStore('typing', () => {
  const isTypingAdmin = ref(false)
  const isTypingUser = ref(false)

  function setTyping(role: 'admin' | 'user', state: boolean) {
    if (role === 'admin') isTypingAdmin.value = state
    else isTypingUser.value = state
  }

  return { isTypingAdmin, isTypingUser, setTyping }
})
