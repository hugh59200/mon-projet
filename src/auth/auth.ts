import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ username: string } | null>(null)
  const token = ref<string | null>(null)

  async function login(username: string, password: string) {
    // ⚠️ Exemple minimal, à remplacer par appel Worker plus tard
    if (username && password === 'demo') {
      user.value = { username }
      token.value = btoa(`${username}:${Date.now()}`)
      localStorage.setItem('auth_user', JSON.stringify(user.value))
      localStorage.setItem('auth_token', token.value)
      return true
    }
    return false
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  function restore() {
    const storedUser = localStorage.getItem('auth_user')
    const storedToken = localStorage.getItem('auth_token')
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser)
      token.value = storedToken
    }
  }

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  return { user, token, isAuthenticated, login, logout, restore }
})
