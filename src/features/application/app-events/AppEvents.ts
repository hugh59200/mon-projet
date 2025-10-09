import { inject } from "vue";
import { EventBus } from "@/features/application/event-bus/EventBus";
import { useRemoteLogger } from "@/features/interface/composables";
import { EVENT_BUS, type AppBusEvents } from "./types";

declare module 'vue' {
  interface ComponentCustomProperties {
    $eventBus: EventBus<AppBusEvents>
  }
}

export function useEventBus() {
  const result = inject<EventBus<AppBusEvents>>(EVENT_BUS)
  if (!result) {
    const logger = useRemoteLogger()
    logger.log("useEventBus a été appelé avant d'être initialisé")
  }
  return result
}
