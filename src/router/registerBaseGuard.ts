import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
import { useAfficheCGUStore } from '@/features/interface/cgu/useAfficheCGUStore'
import { supabase } from '@/supabase/supabaseClient'
import type { Router } from 'vue-router'

export function registerBaseGuard(router: Router) {
  let isShowingCGU = false

  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const cart = useCartStore()

    // 1️⃣ Init session si absente
    if (!auth.user) {
      await auth.initAuth()
    }

    // 2️⃣ Email non confirmé
    if (auth.user && !auth.user.email_confirmed_at) {
      console.warn('[Guard] Email non confirmé → déconnexion forcée')
      await supabase.auth.signOut()
      return '/auth/login'
    }

    // 3️⃣ Profil manquant
    if (auth.isAuthenticated && !auth.profile) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user!.id)
        .maybeSingle()

      if (error) console.warn('[Guard] Erreur chargement profil:', error)

      if (!profile || !profile.email) {
        await supabase.auth.signOut()
        return '/auth/login'
      }

      auth.profile = profile
    }

    // 4️⃣ CGU popup obligatoire
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/reset-password']
    if (auth.isAuthenticated && !publicRoutes.includes(to.path) && !isShowingCGU) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('cgu_accepted')
          .eq('id', auth.user!.id)
          .maybeSingle()

        if (error) throw error

        if (data && data.cgu_accepted === false) {
          console.info('[Guard] CGU non acceptées → popup')
          isShowingCGU = true
          const dialog = useAfficheCGUStore()
          await dialog.showDialog({ validationObligatoire: true })
          await supabase
            .from('profiles')
            .update({
              cgu_accepted: true,
              cgu_accepted_at: new Date().toISOString(),
            })
            .eq('id', auth.user!.id)
          isShowingCGU = false
        }
      } catch (err) {
        console.warn('[Guard] Erreur CGU:', err)
      }
    }

    // 5️⃣ Vérif accès
    const requiresAuth = to.meta.requiresAuth
    const requiresAdmin = to.meta.requiresAdmin
    const requiresCart = to.meta.requiresCart

    if (requiresAuth && !auth.isAuthenticated) {
      console.warn('[Guard] Accès protégé → login')
      return { path: '/auth/login', query: { redirect: to.fullPath } }
    }

    if (requiresAdmin && (!auth.isAuthenticated || auth.profile?.role !== 'admin')) {
      return '/access-denied'
    }

    if (requiresCart && cart.items.length === 0) {
      return '/panier'
    }

    if (
      auth.isAuthenticated &&
      to.path.startsWith('/auth/') &&
      !['/auth/callback'].includes(to.path)
    ) {
      return '/profil'
    }

    return true
  })
}
