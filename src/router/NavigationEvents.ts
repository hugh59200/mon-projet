import type { BusEvent } from "@/features/application/event-bus"
import type { RouteLocationNormalized } from "vue-router"

export type BeforeRouteLeaveEventArg = {
  from: RouteLocationNormalized,
  to: RouteLocationNormalized,
}
export type BeforeRouteLeaveEvent = BusEvent<"BeforeRouteLeave", BeforeRouteLeaveEventArg>
