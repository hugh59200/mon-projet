import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSablierStore = defineStore('sablier', () => {
  const compteur = ref<number>(0)

  const estSablierVisible = computed(() => compteur.value > 0)

  function debutSablier() {
    compteur.value++
  }

  function finSablier() {
    if (compteur.value > 0) {
      compteur.value--
    }
  }

  return {
    estSablierVisible,
    debutSablier,
    finSablier,
  }
})
