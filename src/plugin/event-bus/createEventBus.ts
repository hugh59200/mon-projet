import { EVENT_BUS } from "@/features/application/app-events/types";
import { EventBus, type BusEvent } from "@/features/application/event-bus/EventBus";
import type { App } from "vue";

export function createEventBus<T extends BusEvent>() {
  return {
    install(app: App<Element>) {
      const eventBus = new EventBus<T>()
      eventBus.onError(event => {
        const logger = app.config.globalProperties.$remoteLogger
        logger.error(event)
      })
      app.config.globalProperties.$eventBus = eventBus as any
      app.provide<EventBus<T>>(EVENT_BUS, eventBus)
    }
  }
}
