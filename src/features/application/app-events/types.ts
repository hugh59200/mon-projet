import type { BeforeRouteLeaveEvent } from "@/router/NavigationEvents";
import type { BusEvent } from "../event-bus/EventBus";

export const EVENT_BUS = Symbol("EVENT_BUS")

/* Injecter les évenements App ici */
export type AppNotifEventType = 'info' | 'warning' | 'danger' | 'success'
export type AppNotifEventArg = { message: string, titre?: string, type?: AppNotifEventType }
export type AppNotifEvent = BusEvent<"AppNotif", AppNotifEventArg>

export type AppBusEvents = AppNotifEvent | BeforeRouteLeaveEvent
