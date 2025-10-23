import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSablierStore = defineStore('sablier', () => {
  const compteur = ref(0)
  const estVisible = ref(false)
  let timeoutId: number | null = null
  let graceDelayId: number | null = null

  /** 🔥 Lance le sablier (avec délai d'affichage UX-friendly) */
  function debutSablier() {
    compteur.value++

    // 🧠 Si c’est la première requête, on attend un peu avant d’afficher
    if (compteur.value === 1) {
      graceDelayId = window.setTimeout(() => {
        estVisible.value = true
      }, 200) // délai d’affichage minimal
    }
  }

  /** 💨 Termine le sablier */
  function finSablier() {
    if (compteur.value > 0) compteur.value--

    // 👇 Quand toutes les requêtes sont finies
    if (compteur.value === 0) {
      // ⛔ Annule l’affichage s’il n’a pas encore commencé
      if (graceDelayId) {
        clearTimeout(graceDelayId)
        graceDelayId = null
      }

      // ✨ Laisse un léger délai pour fluidifier la disparition
      timeoutId = window.setTimeout(() => {
        estVisible.value = false
      }, 200)
    }
  }

  /** 🧩 Utilitaire pour envelopper une promesse */
  async function avecSablier<T>(promesse: Promise<T>): Promise<T> {
    debutSablier()
    try {
      return await promesse
    } finally {
      finSablier()
    }
  }

  return {
    estSablierVisible: computed(() => estVisible.value),
    debutSablier,
    finSablier,
    avecSablier,
  }
})
