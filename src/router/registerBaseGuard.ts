import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
import { supabase } from '@/supabase/supabaseClient'
import type { Router } from 'vue-router'

export function registerBaseGuard(router: Router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const cart = useCartStore()

    // ✅ Laisser passer callback
    if (to.path === '/auth/callback') return true

    // ✅ Initialiser session
    if (!auth.user) {
      await auth.initAuth()
    }

    // ✅ ✅ ✅ FIX : Détection fiable de l’email vérifié sur Supabase V2
    const isEmailVerified =
      auth.user?.email_confirmed_at || auth.user?.identities?.[0]?.identity_data?.email_verified

    if (auth.user && !isEmailVerified) {
      return '/auth/callback'
    }

    // ✅ Charger le profil manquant
    if (auth.isAuthenticated && !auth.profile) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user!.id)
        .maybeSingle()

      if (!profile) {
        await supabase.auth.signOut()
        return '/auth/login'
      }

      auth.profile = profile
    }

    // ✅ Routes protégées
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return { path: '/auth/login', query: { redirect: to.fullPath } }
    }

    // ✅ Admin
    if (to.meta.requiresAdmin && auth.profile?.role !== 'admin') {
      return '/access-denied'
    }

    // ✅ Panier obligatoire
    if (to.meta.requiresCart && cart.items.length === 0) {
      return '/panier'
    }

    // ✅ Si connecté → empêche retour sur /auth (sauf callback)
    if (auth.isAuthenticated && to.path.startsWith('/auth/') && to.path !== '/auth/callback') {
      return '/profil'
    }

    return true
  })
}
