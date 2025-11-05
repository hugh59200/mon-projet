import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminTabStore = defineStore(
  'adminTab',
  () => {
    const lastTab = ref<string | null>(null)

    const setLastTab = (tab: string) => (lastTab.value = tab)
    const clearLastTab = () => (lastTab.value = null)

    // ✅ Redirection auto : admin → onglets admin, sinon → statistiques
    const getRedirectRoute = (isAdmin = false) => {
      if (isAdmin) {
        return lastTab.value && lastTab.value.startsWith('Admin')
          ? { name: lastTab.value }
          : { name: 'AdminUsers' }
      }
      return { name: 'AdminStats' } // route stats utilisateur
    }

    return { lastTab, setLastTab, clearLastTab, getRedirectRoute }
  },
  {
    persist: {
      key: 'admin:last-tab',
      storage: localStorage,
      pick: ['lastTab'],
    },
  },
)
