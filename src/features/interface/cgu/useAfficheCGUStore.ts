import { ref } from "vue"
import type { ShowCGUOptions } from "./types"
import { defineStore } from "pinia"

export const useAfficheCGUStore = defineStore('cgu-affiche', () => {

  function $reset() {
    dialogVisible.value = false
    dialogClosable.value = false
    resolver = undefined
  }

  const dialogVisible = ref<boolean>(false)
  const dialogClosable = ref<boolean>(true)

  let resolver: ((value: void | PromiseLike<void>) => void) | undefined

  function showDialog(options: ShowCGUOptions) {
    $reset()

    return new Promise<void>(resolve => {
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
    dialogClosable,
    dialogVisible
  }
})
