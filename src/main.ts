import type { AppBusEvents } from '@/features/application/app-events'
import { deviceBreakpointPlugin } from '@/plugin/device-breakpoint'
import { RegistrationDSComponents } from '@/plugin/registration'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { SnackbarService } from 'vue3-snackbar'
import App from './App.vue'
import './assets/main.css'
import { focusableDirective } from './directives/index'
import { createEventBus } from './plugin/event-bus/createEventBus'
import router from './router'

const app = createApp(App)

app.use(createEventBus<AppBusEvents>())
app.use(SnackbarService)
app.use(RegistrationDSComponents)
app.use(createPinia())
app.use(router)
app.use(deviceBreakpointPlugin)
app.directive('focusable', focusableDirective)
app.mount('#app')
