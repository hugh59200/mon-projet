import { useAuthStore, type Profile } from '@/features/auth/stores/useAuthStore'
import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
import { useAfficheCGUStore } from '@/features/interface/cgu/useAfficheCGUStore'
import { supabase } from '@/supabase/supabaseClient'
import type { Router } from 'vue-router'

/**
 * 🧠 Guard global :
 * - Vérifie session et profil
 * - Bloque si email non confirmé
 * - Déclenche popup CGU si nécessaire
 * - Gère les accès protégés (auth / admin / panier)
 */
export function registerBaseGuard(router: Router) {
  let isShowingCGU = false // 🔒 évite popup multiple

  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const cart = useCartStore()

    // ================================
    // 1️⃣ Initialisation session
    // ================================
    if (!auth.user) {
      await auth.initAuth()
    }

    // ================================
    // 2️⃣ Vérifie confirmation email
    // ================================
    if (auth.user && !auth.user.email_confirmed_at) {
      console.warn('[Guard] Email non confirmé → déconnexion forcée')
      await supabase.auth.signOut()
      return '/auth/login'
    }

    // ================================
    // 3️⃣ Recharge le profil si besoin
    // ================================
    if (auth.isAuthenticated && !auth.profile) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user!.id)
        .maybeSingle()

      if (error) console.warn('[Guard] Erreur chargement profil:', error)

      if (!profile || !profile.email) {
        console.warn('[Guard] Aucun profil lié → déconnexion forcée')
        await supabase.auth.signOut()
        return '/auth/login'
      }

      auth.profile = {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || null,
        role: (profile.role as 'admin' | 'user') || 'user',
        avatar_url: profile.avatar_url || null,
        cgu_accepted: profile.cgu_accepted || false,
        cgu_accepted_at: profile.cgu_accepted_at || null,
        created_at: profile.created_at || null,
      } as Profile
    }

    // ================================
    // 4️⃣ CGU obligatoires
    // ================================
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
          console.info('[Guard] CGU non acceptées → affichage popup.')
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
        console.warn('[Guard] Erreur vérification CGU :', err)
      }
    }

    // ================================
    // 5️⃣ Règles d’accès (auth, admin, panier)
    // ================================
    const requiresAuth = to.meta.requiresAuth
    const requiresAdmin = to.meta.requiresAdmin
    const requiresCart = to.meta.requiresCart

    // 🧱 Accès protégé
    if (requiresAuth && !auth.isAuthenticated) {
      console.warn('[Guard] Accès protégé sans session → /auth/login')
      // ✅ On garde la page cible pour redirection post-login
      return { path: '/auth/login', query: { redirect: to.fullPath } }
    }

    // 🧱 Accès admin
    if (requiresAdmin && (!auth.isAuthenticated || auth.profile?.role !== 'admin')) {
      console.warn('[Guard] Accès admin refusé → /access-denied')
      return '/access-denied'
    }

    // 🧱 Panier requis
    if (requiresCart && cart.items.length === 0) {
      console.warn('[Guard] Panier vide requis → /panier')
      return '/panier'
    }

    // ✅ Tout est bon
    return true
  })
}
