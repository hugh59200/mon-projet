import { useAuthStore } from '@/features/auth/useAuthStore'
import { configSablier } from '@/features/interface/sablier/configSablier'
import { deviceBreakpointPlugin } from '@/plugin/device-breakpoint'
import { RegistrationDSComponents } from '@/plugin/registration'
import { supabase } from '@/services/supabaseClient'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { focusableDirective } from './directives'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

// --- 🧠 Pinia d'abord ---
app.use(pinia)
app.use(router)
app.use(RegistrationDSComponents)
app.use(deviceBreakpointPlugin)
app.directive('focusable', focusableDirective)

// --- 🕓 Active le sablier global ---
const sablierFetch = configSablier(window.fetch)
window.fetch = sablierFetch

// --- 🧩 Intégration propre avec Supabase v2 ---
;(supabase as any).global = {
  ...(supabase as any).global,
  fetch: sablierFetch,
}

// --- 🧭 Auth + montage ---
const auth = useAuthStore()
auth.initAuth().then(() => {
  app.mount('#app')
})
