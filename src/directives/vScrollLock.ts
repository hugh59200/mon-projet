/**
 * 🧷 v-scroll-lock
 *
 * Bloque le scroll de la page quand un élément (souvent une modale ou un menu)
 * est monté dans le DOM.
 *
 * 🧩 Exemple :
 * <ModalComponent v-if="showFilters" v-scroll-lock />
 *
 * ✅ Gère aussi les cas multiples (plusieurs modales ouvertes).
 * ✅ Restaure le scroll original uniquement quand tous les locks sont fermés.
 */
let lockCount = 0
let originalOverflow = ''

export const vScrollLock = {
  mounted() {
    if (lockCount === 0) {
      // Sauvegarde le style d'origine
      originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    lockCount++
  },

  unmounted() {
    lockCount--
    if (lockCount <= 0) {
      // Restaure le scroll quand plus aucun lock actif
      document.body.style.overflow = originalOverflow || ''
      lockCount = 0
    }
  },
}
