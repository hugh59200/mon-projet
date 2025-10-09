import { useEventBus } from "@/features/application/app-events/AppEvents"
import { useAppSnackBar } from "./useSnackBar"

export function registerAppSnackBarEventsManager() {
  const eventBus = useEventBus()
  const service = useAppSnackBar()
  eventBus?.on("AppNotif", (event) => {
    service.pop(event.arg)
  })
}
