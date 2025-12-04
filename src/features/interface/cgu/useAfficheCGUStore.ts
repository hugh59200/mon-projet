import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ShowCGUOptions } from './types'

export const useAfficheCGUStore = defineStore('cgu-affiche', () => {
  const dialogVisible = ref<boolean>(false)
  const dialogClosable = ref<boolean>(true)
  const overlayActive = ref<boolean>(false) // 🆕 pour fond flouté
  let resolver: ((value: void | PromiseLike<void>) => void) | undefined

  function $reset() {
    dialogVisible.value = false
    dialogClosable.value = false
    overlayActive.value = false
    resolver = undefined
  }

  async function showDialog(options: ShowCGUOptions) {
    $reset()
    overlayActive.value = true // ✅ active le blur

    return new Promise<void>((resolve) => {
      resolver = resolve
      dialogVisible.value = true
      dialogClosable.value = options.validationObligatoire !== true
    })
  }

  function queryClose() {
    try {
      resolver?.apply(null)
    } finally {
      $reset()
    }
  }

  return {
    $reset,
    showDialog,
    queryClose,
    dialogVisible,
    dialogClosable,
    overlayActive, // 🆕 export
  }
})
