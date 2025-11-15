import directives from '@/directives'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { deviceBreakpointPlugin } from '@/plugin/device-breakpoint'
import { RegistrationDSComponents } from '@/plugin/registration'
import { useTheme } from '@/themes/composables/useTheme'
import '@/themes/themes.css'
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import Vue3GoogleOauth from 'vue3-google-signin'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(MotionPlugin)
app.use(RegistrationDSComponents)
app.use(deviceBreakpointPlugin)
app.use(useTheme)
app.use(Vue3GoogleOauth, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
})
pinia.use(piniaPluginPersistedstate)
app.use(directives)
const auth = useAuthStore()

await auth.initAuth()

app.mount('#app')
