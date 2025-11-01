import { supabase } from '@/supabase/supabaseClient'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useAuthStore } from '../auth/useAuthStore'

export const useProfileSectionsStore = defineStore(
  'profileSections',
  () => {
    const auth = useAuthStore()

    // 🎛️ états locaux
    const personal = ref(true)
    const orders = ref(true)
    const preferences = ref(false)
    const security = ref(false)
    const support = ref(true)

    // 📦 charge les préférences depuis Supabase
    async function loadFromSupabase() {
      if (!auth.user) return
      const { data } = await supabase
        .from('profiles')
        .select('ui_preferences')
        .eq('id', auth.user.id)
        .maybeSingle()

      if (data?.ui_preferences) {
        try {
          const prefs = JSON.parse(String(data.ui_preferences))
          personal.value = prefs.personal ?? personal.value
          orders.value = prefs.orders ?? orders.value
          preferences.value = prefs.preferences ?? preferences.value
          security.value = prefs.security ?? security.value
          support.value = prefs.support ?? support.value
        } catch (err) {
          console.warn('Invalid ui_preferences JSON', err)
        }
      }
    }

    // 💾 sauvegarde côté Supabase
    async function saveToSupabase() {
      if (!auth.user) return
      const prefs = JSON.stringify({
        personal: personal.value,
        orders: orders.value,
        preferences: preferences.value,
        security: security.value,
        support: support.value,
      })
      await supabase.from('profiles').update({ ui_preferences: prefs }).eq('id', auth.user.id)
    }

    // 🧠 synchronise local <-> distant
    watch([personal, orders, preferences, security, support], saveToSupabase, {
      deep: true,
    })

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
