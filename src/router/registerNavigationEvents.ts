import { useEventBus } from '@/features/application/app-events'
import type { RouteLocationNormalized, Router } from 'vue-router'

export function registerNavigationEvents(router: Router) {
  router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const eventBus = useEventBus()
    eventBus?.dispatch({ name: 'BeforeRouteLeave', arg: { from, to } })
  })
}
