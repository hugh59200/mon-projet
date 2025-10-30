import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminTabStore = defineStore(
  'adminTab',
  () => {
    const lastTab = ref<string | null>(null)

    function setLastTab(tabName: string) {
      lastTab.value = tabName
    }

    function clearLastTab() {
      lastTab.value = null
    }

    function getRedirectRoute() {
      return lastTab.value ? { name: lastTab.value } : { name: 'AdminMessagerie' }
    }

    return { lastTab, setLastTab, clearLastTab, getRedirectRoute }
  },
  {
    persist: {
      key: 'admin:last-tab',
      storage: localStorage,
    },
  },
)
