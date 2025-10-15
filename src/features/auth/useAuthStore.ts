import { supabase } from '@/services/supabaseClient'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // --- Connexion ---
  async function signIn(email: string, password: string) {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    loading.value = false

    if (err) {
      error.value = err.message
      return false
    }

    user.value = data.user
    return true
  }

  // --- Inscription ---
  async function signUp(email: string, password: string) {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
    })
    loading.value = false

    if (err) {
      error.value = err.message
      return false
    }

    user.value = data.user
    return true
  }

  // --- Déconnexion ---
  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
  }

  // --- Récupération session ---
  async function initAuth() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    user.value = session?.user ?? null

    // écoute des changements (login/logout auto)
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    initAuth,
  }
})
