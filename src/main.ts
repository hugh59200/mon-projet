import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { focusableDirective } from './directives/index'
import { createEventBus } from './plugin/event-bus/createEventBus'
import type { AppBusEvents } from '@/features/application/app-events'
import { SnackbarService } from 'vue3-snackbar'
import { RegistrationDSComponents } from '@/plugin/registration'
import { deviceBreakpointPlugin } from '@/plugin/device-breakpoint'


  const app = createApp(App)

  app.use(createEventBus<AppBusEvents>())
  app.use(SnackbarService)
  app.use(RegistrationDSComponents)
  app.use(createPinia())
  app.use(router)
  app.use(deviceBreakpointPlugin)
  app.directive('focusable', focusableDirective)
  app.mount('#app')
