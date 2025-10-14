import { defineStore } from 'pinia'
import { ref } from 'vue'

const CGU_CURRENT_VERSION = Object.freeze(parseInt(import.meta.env.VITE_CGU_VERSION ?? '0'))

export const useVersionCGUStore = defineStore('cgu-version', () => {
  const numVersion = ref<number>()
  const userKey = ref<string>()

  async function checkCguExpirées() {
    if (numVersion.value !== undefined || userKey.value !== undefined) {
      numVersion.value = undefined
      userKey.value = undefined
    }
    return false
  }

  async function setCguValidées() {
    try {
      await saveCurrentVersion()
    } catch (err) {
      console.error('CGU non sauvegardées', err)
    }
    numVersion.value = CGU_CURRENT_VERSION
  }

  async function saveCurrentVersion() {}

  return {
    checkCguExpirées,
    setCguValidées,
  }
})
