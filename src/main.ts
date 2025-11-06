import directives from '@/directives'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { deviceBreakpointPlugin } from '@/plugin/device-breakpoint'
import { RegistrationDSComponents } from '@/plugin/registration'
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(MotionPlugin)
app.use(RegistrationDSComponents)
app.use(deviceBreakpointPlugin)
pinia.use(piniaPluginPersistedstate)
app.use(directives)
const auth = useAuthStore()

await auth.initAuth()

app.mount('#app')
