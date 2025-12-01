import { useProfilePreferencesActions } from './composables/useProfilePreferencesActions'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from '../auth/stores/useAuthStore'

export const useProfileSectionsStore = defineStore(
  'profileSections',
  () => {
    const auth = useAuthStore()
    const { load, save } = useProfilePreferencesActions()

    const personal = ref(true)
    const orders = ref(true)
    const preferences = ref(false)
    const security = ref(false)
    const support = ref(true)

    async function loadFromSupabase() {
      if (!auth.user) return

      const json = await load(auth.user.id)
      if (!json) return

      try {
        const prefs = JSON.parse(json)
        personal.value = prefs.personal ?? personal.value
        orders.value = prefs.orders ?? orders.value
        preferences.value = prefs.preferences ?? preferences.value
        security.value = prefs.security ?? security.value
        support.value = prefs.support ?? support.value
      } catch (err) {
        console.warn('⚠️ ui_preferences JSON invalide')
      }
    }

    async function saveToSupabase() {
      if (!auth.user) return

      const prefs = JSON.stringify({
        personal: personal.value,
        orders: orders.value,
        preferences: preferences.value,
        security: security.value,
        support: support.value,
      })

      await save(auth.user.id, prefs)
    }

    return {
      personal,
      orders,
      preferences,
      security,
      support,
      loadFromSupabase,
      saveToSupabase,
    }
  },
  {
    persist: {
      key: 'profile:sections',
      storage: localStorage,
      pick: ['personal', 'orders', 'preferences', 'security', 'support'],
    },
  },
)
