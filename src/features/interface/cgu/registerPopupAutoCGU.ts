import { registerPopupAuto } from "@/features/application/popup-auto/PopupAuto"
import { useVersionCGUStore } from "./useVersionCGUStore"
import { useAfficheCGUStore } from "./useAfficheCGUStore"

export function registerPopupAutoCGU() {
  registerPopupAuto({
    key: "CGU",
    canPopup: async () => {
      return true
    },
    showPopup: () => {
      const dialogCGU = useAfficheCGUStore()
      return dialogCGU.showDialog({ validationObligatoire: true }).then(() => {
        const versionStore = useVersionCGUStore()
        return versionStore.setCguValidées()
      })
    }
  })
}
