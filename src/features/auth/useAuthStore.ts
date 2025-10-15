import { supabase } from '@/services/supabaseClient'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 🔹 État global
  const user = ref<any | null>(null)
  const profile = ref<any | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 🔹 Getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin')

  // --- 🔹 Charger le profil utilisateur
  async function fetchProfile() {
    if (!user.value) return
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    if (err) console.error('Erreur profil:', err)
    profile.value = data
  }

  // --- 🔹 Inscription
  async function signUp(email: string, password: string) {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    loading.value = false
    if (err) {
      error.value = err.message
      return false
    }
    user.value = data.user
    await fetchProfile()
    return true
  }

  // --- 🔹 Connexion
  async function signIn(email: string, password: string) {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    loading.value = false
    if (err) {
      error.value = err.message
      return false
    }
    user.value = data.user
    await fetchProfile()
    return true
  }

  // --- 🔹 Déconnexion
  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
  }

  // --- 🔹 Initialisation de la session (appelée au démarrage)
  async function initAuth() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    if (user.value) await fetchProfile()

    // Écoute les changements d’état auth (connexion/déconnexion)
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      if (user.value) fetchProfile()
      else profile.value = null
    })
  }

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    signUp,
    signIn,
    signOut,
    initAuth,
  }
})
