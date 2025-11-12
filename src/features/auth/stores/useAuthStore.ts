import router from '@/router'
import { supabase } from '@/supabase/supabaseClient'
import type { Profiles, Role } from '@/supabase/types/supabase.types'
import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

import {
  signInWithMagicLink as serviceMagicLink,
  signInWithProvider as serviceProviderLogin,
  signUp as serviceSignUp,
  signInWithPassword,
} from '@/features/auth/services/authService'

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
    const { data, error: err } = await supabase.auth.getSession()
    if (err) console.warn('Erreur récupération session Supabase', err)

    if (data.session?.user) {
      user.value = data.session.user
      await fetchProfile()
      startAutoRefresh()
    } else {
      user.value = null
      profile.value = null
    }
    loading.value = false
  }

  // ✅ Login → utilise authService
  async function signIn(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null

    const result = await signInWithPassword(email, password)
    loading.value = false

    if (!result.success) {
      error.value = result.message
      return false
    }

    user.value = result.user
    await fetchProfile()
    startAutoRefresh()

    const redirect = router.currentRoute.value.query.redirect as string | undefined
    sessionStorage.setItem('redirectAfterOAuth', redirect || '')
    router.push('/auth/callback')

    return true
  }

  // ✅ SignUp via notre service
  async function signUp(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null

    const result = await serviceSignUp(email, password)
    loading.value = false

    if (!result.success) {
      error.value = result.message!
      return false
    }
    // router.push({ path: '/auth/callback' })
    return true
  }

  // ✅ Magic link via service
  async function signInWithMagicLink(email: string): Promise<boolean> {
    loading.value = true
    error.value = null

    const result = await serviceMagicLink(email)
    loading.value = false

    if (!result.success) {
      error.value = result.message
      return false
    }

    return true
  }

  // ✅ OAuth providers (Google, Github, Facebook)
  async function signInWithProvider(provider: Providers) {
    loading.value = true
    error.value = null

    const result = await serviceProviderLogin(provider)
    loading.value = false

    if (!result.success) error.value = result.message
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

  function clearError() {
    error.value = null
  }

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
    clearError,
  }
})
