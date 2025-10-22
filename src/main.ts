import { useAuthStore } from '@/features/auth/useAuthStore'
import { deviceBreakpointPlugin } from '@/plugin/device-breakpoint'
import { RegistrationDSComponents } from '@/plugin/registration'
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

const auth = useAuthStore()

await auth.initAuth()

app.mount('#app')
