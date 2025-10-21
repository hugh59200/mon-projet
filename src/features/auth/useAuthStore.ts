// /src/features/auth/useAuthStore.ts
import router from '@/router'
import { supabase } from '@/services/supabaseClient'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToastStore } from '../interface/toast/useToastStore'

interface Profile {
  id: string
  email: string
  full_name?: string
  role?: 'admin' | 'user'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const toast = useToastStore()
  let refreshInterval: number | null = null

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => (profile.value?.role || '') === 'admin')

  // --- PROFIL UTILISATEUR
  async function fetchProfile() {
    if (!user.value) return
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    if (err) {
      toast.showToast('Erreur lors du chargement du profil.', 'danger')
      console.error(err)
    } else {
      profile.value = data || { role: 'user' }
    }
  }

  // --- SESSION
  async function refreshSession() {
    const { data, error: err } = await supabase.auth.getSession()
    if (err || !data.session?.user) return false
    user.value = data.session.user
    return true
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    loading.value = true
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    loading.value = false

    if (err) {
      toast.showToast(err.message, 'danger')
      error.value = err.message
      return false
    }

    user.value = data.user
    await fetchProfile()
    startAutoRefresh()
    toast.showToast('Connexion réussie 🎉', 'success')
    return true
  }

  async function signUp(email: string, password: string): Promise<boolean> {
    loading.value = true
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    loading.value = false

    if (err) {
      toast.showToast(err.message, 'danger')
      error.value = err.message
      return false
    }

    toast.showToast('Compte créé ! Vérifiez vos e-mails 📧', 'success')
    user.value = data.user
    await fetchProfile()
    startAutoRefresh()
    return true
  }

  async function signOut(redirect = true, message?: string) {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
    stopAutoRefresh()
    toast.showToast(message ?? 'Déconnexion effectuée.', message ? 'warning' : 'info')
    if (redirect) router.push('/login')
  }

  // --- INIT
  async function initAuth() {
    if (await refreshSession()) {
      await fetchProfile()
      startAutoRefresh()
    }
  }

  // --- AUTO REFRESH SESSION
  function startAutoRefresh() {
    stopAutoRefresh()
    refreshInterval = window.setInterval(
      async () => {
        if (!(await refreshSession())) {
          await signOut(true, 'Session expirée, veuillez vous reconnecter.')
        }
      },
      60 * 60 * 1000,
    ) // toutes les 60 min
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // --- LISTENER GLOBAL SUPABASE
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
    if (session?.user) fetchProfile()
    else profile.value = null
  })

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
