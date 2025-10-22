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

  // --- COMPUTED ---
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => (profile.value?.role || '') === 'admin')

  // ======================================================
  // 🧩 PROFIL UTILISATEUR
  // ======================================================
  async function fetchProfile() {
    if (!user.value) return
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (err) {
      console.error('Erreur profil:', err)
      toast.showToast('Erreur lors du chargement du profil.', 'danger')
    } else {
      profile.value = data || { role: 'user' }
    }
  }

  // ======================================================
  // 🔁 SESSION
  // ======================================================
  async function refreshSession() {
    const { data, error: err } = await supabase.auth.getSession()
    if (err || !data.session?.user) return false
    user.value = data.session.user
    return true
  }

  // ======================================================
  // 🔐 LOGIN (Email + MDP)
  // ======================================================
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

  // ======================================================
  // 🧾 INSCRIPTION
  // ======================================================
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

  // ======================================================
  // 🌍 OAUTH (Google, GitHub)
  // ======================================================
  async function signInWithProvider(provider: 'google' | 'github', redirect?: string) {
    try {
      loading.value = true
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback${
            redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''
          }`,
        },
      })
      if (err) {
        toast.showToast(err.message, 'danger')
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  // ======================================================
  // ✉️ MAGIC LINK (connexion sans mot de passe)
  // ======================================================
  async function signInWithMagicLink(email: string): Promise<boolean> {
    loading.value = true
    error.value = null

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    loading.value = false

    if (err) {
      error.value = err.message
      toast.showToast(err.message, 'danger')
      return false
    }

    toast.showToast('Lien magique envoyé à votre e-mail 📩', 'success')
    return true
  }

  // ======================================================
  // 🚪 LOGOUT
  // ======================================================
  async function signOut(redirect = true, message?: string) {
    console.log('disconnecting')
    await supabase.auth.signOut()
    console.log('disconnectinggggg')
    user.value = null
    profile.value = null
    stopAutoRefresh()
    toast.showToast(message ?? 'Déconnexion effectuée.', message ? 'warning' : 'info')
    if (redirect) router.push('/auth/login')
  }

  // ======================================================
  // 🚀 INIT AUTH
  // ======================================================
  async function initAuth() {
    if (await refreshSession()) {
      await fetchProfile()
      startAutoRefresh()
    }
  }

  // ======================================================
  // 🕒 AUTO REFRESH SESSION
  // ======================================================
  function startAutoRefresh() {
    stopAutoRefresh()
    refreshInterval = window.setInterval(
      async () => {
        if (!(await refreshSession())) {
          await signOut(true, 'Session expirée, veuillez vous reconnecter.')
        }
      },
      60 * 60 * 1000,
    )
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // ======================================================
  // 🔊 LISTENER GLOBAL SUPABASE
  // ======================================================
  supabase.auth.onAuthStateChange(async (event, session) => {
    user.value = session?.user ?? null

    if (session?.user) {
      await fetchProfile()
      startAutoRefresh()
    } else {
      profile.value = null
      stopAutoRefresh()
    }

    // 🚦 Redirection automatique après OAuth / Magic Link
    if (event === 'SIGNED_IN' && router.currentRoute.value.name === 'auth-callback') {
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')
    }

    if (event === 'SIGNED_OUT') {
      router.push('/auth/login')
    }
  })

  // ======================================================
  // EXPORTS
  // ======================================================
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
    signInWithProvider,
    signInWithMagicLink,
    initAuth,
  }
})
