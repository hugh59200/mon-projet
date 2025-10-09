import type { AppNotifEventArg, AppNotifEventType } from "@/features/application/app-events";
import { useSnackbar } from "vue3-snackbar";


const TypesMessage: Record<AppNotifEventType, any> = {
  info: "info",
  warning: "warning",
  danger: "error",
  success: "success",
}

const TypesColor: Record<AppNotifEventType, any> = {
  info: "#14adff",
  warning: "#ff6707",
  danger: "#eb1515",
  success: "#05a89c",
}

export function useAppSnackBar() {
  const snackbar = useSnackbar()

  function pop(option: AppNotifEventArg) {
    snackbar.add({
      type: TypesMessage[option.type ?? 'info'],
      text: option.message,
      title: option.titre,
      background: TypesColor[option.type ?? 'info'],
    } as any)
  }

  return {
    pop
  }
}
