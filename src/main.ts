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

app.use(pinia)
app.use(router)
app.use(RegistrationDSComponents)
app.use(deviceBreakpointPlugin)
app.directive('focusable', focusableDirective)

// sablier global (inchangé)
const sablierFetch = configSablier(window.fetch)
window.fetch = sablierFetch
;(supabase as any).global = {
  ...(supabase as any).global,
  fetch: sablierFetch,
}

const auth = useAuthStore()
auth.initAuth() // 🔄 on l'appelle mais on ne bloque pas ici

app.mount('#app') // ✅ montage immédiat
