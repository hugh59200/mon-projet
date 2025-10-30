// 📁 src/features/admin/stores/useAdminTabStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminTabStore = defineStore('adminTab', () => {
  const lastTab = ref<string | null>(null)

  function setLastTab(tabName: string) {
    lastTab.value = tabName
    localStorage.setItem('admin:last-tab', tabName)
  }

  function loadLastTab() {
    const saved = localStorage.getItem('admin:last-tab')
    if (saved) lastTab.value = saved
  }

  function clearLastTab() {
    lastTab.value = null
    localStorage.removeItem('admin:last-tab')
  }

  // ✅ Utilitaire pratique pour rediriger vers le dernier onglet admin
  function getRedirectRoute() {
    loadLastTab()
    return lastTab.value ? { name: lastTab.value } : { name: 'AdminMessagerie' }
  }

  return { lastTab, setLastTab, loadLastTab, clearLastTab, getRedirectRoute }
})
