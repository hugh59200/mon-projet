import { inject } from "vue";
import { EventBus } from "@/features/application/event-bus/EventBus";
import { EVENT_BUS, type AppBusEvents } from "./types";

declare module 'vue' {
  interface ComponentCustomProperties {
    $eventBus: EventBus<AppBusEvents>
  }
}

export function useEventBus() {
  const result = inject<EventBus<AppBusEvents>>(EVENT_BUS)
  return result
}
