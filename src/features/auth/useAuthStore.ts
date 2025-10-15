import { supabase } from '@/services/supabaseClient'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '../interface/toast/useToastStore'

export const useAuthStore = defineStore('auth', () => {
  // --- ÉTATS GLOBAUX
  const user = ref<any | null>(null)
  const profile = ref<any | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // --- AUTRES
  const router = useRouter()
  const toastStore = useToastStore()
  let refreshInterval: number | null = null

  // --- COMPUTED
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin')

  // --- PROFIL
  async function fetchProfile() {
    if (!user.value) return
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (err) {
      console.error('Erreur profil:', err)
      toastStore.showToast('Erreur lors du chargement du profil.', 'danger')
    } else {
      profile.value = data
    }
  }

  // --- INSCRIPTION
  async function signUp(email: string, password: string) {
    loading.value = true
    error.value = null

    const { data, error: err } = await supabase.auth.signUp({ email, password })
    loading.value = false

    if (err) {
      error.value = err.message
      toastStore.showToast(err.message, 'danger')
      return false
    }

    toastStore.showToast(
      'Compte créé ! Vérifiez vos e-mails pour confirmer votre adresse.',
      'success',
    )
    user.value = data.user
    await fetchProfile()
    startAutoRefresh()
    return true
  }

  // --- CONNEXION
  async function signIn(email: string, password: string) {
    loading.value = true
    error.value = null

    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    loading.value = false

    if (err) {
      error.value = err.message
      toastStore.showToast(err.message, 'danger')
      return false
    }

    toastStore.showToast('Connexion réussie 🎉', 'success')
    user.value = data.user
    await fetchProfile()
    startAutoRefresh()
    return true
  }

  // --- DÉCONNEXION
  async function signOut(message?: string) {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
    stopAutoRefresh()

    toastStore.showToast(message ?? 'Vous avez été déconnecté.', message ? 'warning' : 'info')
    router.push({ name: 'login' })
  }

  // --- INITIALISATION (chargée au démarrage)
  async function initAuth() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    user.value = session?.user ?? null

    if (user.value) {
      await fetchProfile()
      startAutoRefresh()
    }

    // 🔁 écoute connexion / déconnexion
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      if (user.value) fetchProfile()
      else profile.value = null
    })
  }

  // --- REFRESH AUTOMATIQUE DE SESSION
  function startAutoRefresh() {
    stopAutoRefresh()
    refreshInterval = window.setInterval(
      async () => {
        const { data, error: err } = await supabase.auth.getSession()
        if (err || !data?.session?.user) {
          await signOut('Votre session a expiré, veuillez vous reconnecter.')
        } else {
          user.value = data.session.user
        }
      },
      50 * 60 * 1000,
    ) // 50 minutes
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // --- EXPORTS
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
