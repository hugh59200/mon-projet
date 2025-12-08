import directives from '@/directives'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
import { initSessionTracking, trackPageView } from '@/features/tracking/services/sessionTracker'
import i18n from '@/i18n'
import { deviceBreakpointPlugin } from '@/plugin/device-breakpoint'
import { RegistrationDSComponents } from '@/plugin/registration'
import { MotionPlugin } from '@vueuse/motion'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import Vue3GoogleOauth from 'vue3-google-signin'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

// ⚠️ IMPORTANT : Ajouter le plugin persist AVANT d'utiliser pinia
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(head)
app.use(i18n)
app.use(MotionPlugin)
app.use(RegistrationDSComponents)
app.use(deviceBreakpointPlugin)
app.use(Vue3GoogleOauth, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
})
app.use(directives)

// Initialisation des stores
const auth = useAuthStore()
const cart = useCartStore()

await auth.initAuth()
await cart.loadCart()

// Initialisation du tracking de session
initSessionTracking(auth.user?.id ?? null)

// Tracker les changements de page
router.afterEach((to) => {
  trackPageView(to.path)
})

app.mount('#app')
