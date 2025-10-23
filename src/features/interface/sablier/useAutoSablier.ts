import { onMounted, onUnmounted } from 'vue'
import { useSablierStore } from './useSablierStore'

/**
 * 🧠 useAutoSablier — active automatiquement le sablier
 * pendant le cycle de vie du composant.
 *
 * 💡 Utilisation :
 * ```ts
 * useAutoSablier(async () => {
 *   await chargerProfil()
 * })
 * ```
 */
export function useAutoSablier(callback?: () => Promise<void> | void) {
  const sablier = useSablierStore()

  onMounted(async () => {
    sablier.debutSablier()
    try {
      if (callback) await callback()
    } finally {
      sablier.finSablier()
    }
  })

  // En cas de démontage rapide (navigation ou erreur)
  onUnmounted(() => {
    sablier.finSablier()
  })
}
