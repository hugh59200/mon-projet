import { useAuthStore } from '@/features/auth/useAuthStore'
import { useCartStore } from '@/features/cart/useCartStore'
import { useAfficheCGUStore } from '@/features/interface/cgu/useAfficheCGUStore'
import { supabase } from '@/services/supabaseClient'
import type { Router } from 'vue-router'

/**
 * 🧠 Guard global de base :
 * - Initialise la session Supabase
 * - Recharge le profil si besoin
 * - Déclenche la popup CGU si non acceptées
 * - Vérifie panier / maintenance
 */
export function registerBaseGuard(router: Router) {
  let isShowingCGU = false // 🔒 évite de multiples popups simultanées

  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const cart = useCartStore()

    // ✅ 1. Initialisation session
    if (!auth.user) {
      await auth.initAuth()
    }

    // ✅ 2. Recharge profil si besoin
    if (auth.isAuthenticated && !auth.profile) {
      await auth.initAuth()
    }

    // ✅ 3. Vérifie CGU uniquement si connecté et non sur une route publique
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/reset-password']
    if (
      auth.isAuthenticated &&
      !publicRoutes.includes(to.path) &&
      !isShowingCGU // protège contre boucle
    ) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('cgu_accepted')
          .eq('id', auth.user!.id)
          .maybeSingle()

        if (error) throw error

        // 🚨 CGU non acceptées → affiche popup
        if (data && data.cgu_accepted === false) {
          console.info('[Guard] CGU non acceptées → affichage automatique de la popup CGU.')

          isShowingCGU = true
          const dialog = useAfficheCGUStore()
          await dialog.showDialog({ validationObligatoire: true })

          // ✅ Met à jour le champ après validation
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

    // ✅ 4. Vérifie panier plein pour les routes protégées
    if (to.meta.requiresCart && cart.items.length === 0) {
      return '/panier'
    }

    // ✅ 5. Gestion d’un mode maintenance global
    // const maintenance = false
    // if (maintenance && to.path !== '/maintenance') return '/maintenance'

    return true
  })
}
