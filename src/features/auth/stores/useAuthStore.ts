import router from '@/router'
import { supabase } from '@/supabase/supabaseClient'
import type { Profiles, Role } from '@/supabase/types/supabase.types'
import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export type Providers = 'google' | 'github' | 'facebook'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null) as Ref<User | null>
  const profile = ref(null) as Ref<Profiles | null>
  const loading = ref(false)
  const error = ref<string | null>(null)
  let refreshInterval: number | null = null

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const role = computed<Role>(() => (profile.value?.role as Role) || 'user')

  async function fetchProfile() {
    if (!user.value) return
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .maybeSingle()
    if (err) console.warn('Erreur chargement profil:', err)
    if (data) profile.value = data
  }

  async function refreshSession() {
    const { data, error: err } = await supabase.auth.getSession()
    if (err || !data.session?.user) return false
    user.value = data.session.user
    return true
  }

  async function initAuth() {
    loading.value = true
    const { data, error } = await supabase.auth.getSession()
    if (error) console.warn('Erreur récupération session Supabase', error)
    const session = data.session
    if (session?.user) {
      user.value = session.user
      await fetchProfile()
      startAutoRefresh()
    } else {
      user.value = null
      profile.value = null
    }
    loading.value = false
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null

    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    loading.value = false

    if (err) {
      error.value = err.message
      return false
    }

    if (!data.user?.email_confirmed_at) {
      error.value = 'Veuillez confirmer votre e-mail avant de vous connecter 📧'
      await supabase.auth.signOut()
      return false
    }

    user.value = data.user
    await fetchProfile()
    startAutoRefresh()

    // ✅ Unifié : redirige vers /auth/callback
    const redirect = router.currentRoute.value.query.redirect as string | undefined
    sessionStorage.setItem('redirectAfterOAuth', redirect || '')
    router.push('/auth/callback')

    return true
  }

  async function signUp(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    const { error: err } = await supabase.auth.signUp({ email, password })
    loading.value = false

    if (err) {
      error.value = err.message
      return false
    }

    // ✅ Redirection vers succès "email envoyé"
    router.push({ path: '/auth/callback', query: { mode: 'signup' } })
    return true
  }

  async function signInWithProvider(provider: Providers) {
    loading.value = true
    error.value = null
    try {
      const redirect = router.currentRoute.value.query.redirect as string | undefined
      if (redirect) sessionStorage.setItem('redirectAfterOAuth', redirect)
      else sessionStorage.removeItem('redirectAfterOAuth')

      const { error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (err) error.value = err.message
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
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    loading.value = false

    if (err) {
      error.value = err.message
      return false
    }

    return true
  }

  async function signOut(redirect = true) {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
    stopAutoRefresh()
    if (redirect) router.push('/auth/login')
  }

  function startAutoRefresh() {
    stopAutoRefresh()
    refreshInterval = window.setInterval(
      async () => {
        if (!(await refreshSession())) await signOut(true)
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

  supabase.auth.onAuthStateChange(async (event, session) => {
    user.value = session?.user ?? null
    if (session?.user) {
      fetchProfile()
      startAutoRefresh()
    }
    if (event === 'SIGNED_OUT') router.push('/auth/login')
  })

  return {
    user,
    profile,
    loading,
    error,
    role,
    isAuthenticated,
    isAdmin,
    initAuth,
    fetchProfile,
    signIn,
    signUp,
    signInWithProvider,
    signInWithMagicLink,
    signOut,
  }
})
