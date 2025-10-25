import router from '@/router'
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type Profile = Tables<'profiles'>
type UserRole = NonNullable<Profile['role']> extends string ? 'admin' | 'user' : 'user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  let refreshInterval: number | null = null

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const role = computed<UserRole>(() => (profile.value?.role as UserRole) || 'user')

  /* -------------------------------------------------------------------------- */
  /*                               FETCH PROFILE                                */
  /* -------------------------------------------------------------------------- */
  async function fetchProfile() {
    if (!user.value) return
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .maybeSingle()

    if (err) {
      console.warn('Erreur profil (non bloquante):', err)
      return
    }

    if (data) profile.value = data
  }

  /* -------------------------------------------------------------------------- */
  /*                                AUTH LOGIC                                  */
  /* -------------------------------------------------------------------------- */
  async function refreshSession() {
    const { data, error: err } = await supabase.auth.getSession()
    if (err || !data.session?.user) return false
    user.value = data.session.user
    return true
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
    return true
  }

  // ======================================================
  // 🌍 OAUTH (Google, GitHub)
  // ======================================================
  async function signInWithProvider(provider: 'google' | 'github', redirect?: string) {
    loading.value = true
    error.value = null
    try {
      if (redirect) sessionStorage.setItem('redirectAfterOAuth', redirect)
      else sessionStorage.removeItem('redirectAfterOAuth')

      const { error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
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

  async function signUp(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    const { error: err } = await supabase.auth.signUp({ email, password })
    loading.value = false

    if (err) {
      error.value = err.message
      return false
    }

    user.value = null
    profile.value = null
    return true
  }

  async function signOut(redirect = true) {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
    stopAutoRefresh()
    if (redirect) router.push('/auth/login')
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

  /* -------------------------------------------------------------------------- */
  /*                               EVENT LISTENER                               */
  /* -------------------------------------------------------------------------- */
  supabase.auth.onAuthStateChange(async (event, session) => {
    user.value = session?.user ?? null

    if (session?.user) {
      if (!session.user.email_confirmed_at) {
        await signOut(true)
        return
      }
      await fetchProfile()
      startAutoRefresh()
    }

    if (event === 'SIGNED_IN' && router.currentRoute.value.name === 'auth-callback') {
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')
    }

    if (event === 'SIGNED_OUT') router.push('/auth/login')
  })

  return {
    user,
    profile,
    role,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    signUp,
    signIn,
    signInWithProvider,
    signInWithMagicLink,
    signOut,
    initAuth,
  }
})
