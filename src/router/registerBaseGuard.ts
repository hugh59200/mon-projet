import { useAuthStore } from '@/features/auth/useAuthStore'
import { useCartStore } from '@/features/cart/useCartStore'
import { supabase } from '@/services/supabaseClient'
import type { Router } from 'vue-router'

/**
 * 🧠 Guard de base global
 * - Initialise la session utilisateur Supabase
 * - Vérifie certaines conditions globales (profil, CGU, maintenance, etc.)
 */
export function registerBaseGuard(router: Router) {
  router.beforeEach(async (to, _from) => {
    const auth = useAuthStore()
    const cart = useCartStore()

    // ✅ 1. Initialisation de la session (si absente)
    if (!auth.user) {
      await auth.initAuth()
    }

    // ✅ 2. Si besoin : forcer un rechargement léger de profil
    // (inutile d’appeler fetchProfile manuellement : initAuth le fait déjà)
    if (auth.isAuthenticated && !auth.profile) {
      await auth.initAuth()
    }

    // ✅ 3. Vérifie si les CGU doivent être acceptées
    let profile: any = null
    if (auth.isAuthenticated && auth.user?.id) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('cgu_accepted')
          .eq('id', auth.user.id)
          .maybeSingle()

        if (error) throw error
        profile = data
      } catch (err) {
        console.warn('[Guard] Erreur récupération CGU:', err)
      }
    }

    if (auth.isAuthenticated && profile && profile.cgu_accepted === false) {
      console.info('[Guard] CGU non acceptées → popup CGU auto.')
      // 👉 tu pourrais ici déclencher ton useAfficheCGUStore().showDialog()
    }

    // ✅ 4. Si la route exige un panier rempli
    if (to.meta.requiresCart && cart.items.length === 0) {
      return '/panier'
    }

    // ✅ 5. Si besoin : flag global (ex : maintenance)
    // const maintenance = false
    // if (maintenance && to.path !== '/maintenance') return '/maintenance'

    return true
  })
}
