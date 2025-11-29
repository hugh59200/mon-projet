import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSablierStore = defineStore('sablier', () => {
  const compteur = ref(0)
  const estVisible = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let graceDelayId: ReturnType<typeof setTimeout> | number | null = null
  let showTime: number | null = null // ⬅️ Nouveau: quand le sablier est apparu

  /** 🔥 Lance le sablier (avec délai d'affichage UX-friendly) */
  function debutSablier() {
    compteur.value++

    if (compteur.value === 1) {
      graceDelayId = window.setTimeout(() => {
        estVisible.value = true
        showTime = Date.now() // ⬅️ On note quand il apparaît
      }, 200)
    }
  }

  /** 💨 Termine le sablier */
  function finSablier() {
    if (compteur.value > 0) compteur.value--

    if (compteur.value === 0) {
      if (graceDelayId) {
        clearTimeout(graceDelayId)
        graceDelayId = null
      }

      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }

      // ⬅️ Nouveau: on calcule combien de temps il a été visible
      const minDisplayTime = 400 // Affichage minimum si visible
      const visibleDuration = showTime ? Date.now() - showTime : 0
      const remainingTime = estVisible.value ? Math.max(0, minDisplayTime - visibleDuration) : 0

      timeoutId = setTimeout(() => {
        estVisible.value = false
        showTime = null
      }, remainingTime + 100) // +100ms pour transition fluide
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
