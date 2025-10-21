// /src/features/interface/sablier/useSablierStore.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSablierStore = defineStore('sablier', () => {
  const compteur = ref(0)
  const estSablierVisible = ref(false)
  let timeoutId: number | null = null

  /** 🔥 Montre le sablier */
  function debutSablier() {
    compteur.value++
    // Affiche immédiatement si première requête
    if (compteur.value === 1) {
      if (timeoutId) clearTimeout(timeoutId)
      estSablierVisible.value = true
    }
  }

  /** 💨 Cache le sablier (après la dernière requête) */
  function finSablier() {
    if (compteur.value > 0) compteur.value--
    // On ne masque que si plus aucune requête active
    if (compteur.value === 0) {
      // Laisse un léger délai pour éviter le clignotement
      timeoutId = window.setTimeout(() => {
        estSablierVisible.value = false
      }, 200)
    }
  }

  return {
    estSablierVisible: computed(() => estSablierVisible.value),
    debutSablier,
    finSablier,
  }
})
