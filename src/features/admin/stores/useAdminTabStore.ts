import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminTabStore = defineStore(
  'adminTab',
  () => {
    const lastTab = ref<string | null>(null)

    const setLastTab = (tab: string) => (lastTab.value = tab)
    const clearLastTab = () => (lastTab.value = null)
    const getRedirectRoute = () =>
      lastTab.value ? { name: lastTab.value } : { name: 'AdminMessagerie' }

    return { lastTab, setLastTab, clearLastTab, getRedirectRoute }
  },
  {
    persist: {
      key: 'admin:last-tab',
      storage: localStorage,
      pick: ['lastTab'], // ✅ nouvelle syntaxe v4
    },
  },
)
