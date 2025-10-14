import { registerPopupAuto } from '@/features/application/popup-auto/PopupAuto'
import { useAfficheCGUStore } from './useAfficheCGUStore'
import { useVersionCGUStore } from './useVersionCGUStore'

export function registerPopupAutoCGU() {
  registerPopupAuto({
    key: 'CGU',
    canPopup: async () => {
      return true
    },
    showPopup: () => {
      const dialogCGU = useAfficheCGUStore()
      return dialogCGU.showDialog({ validationObligatoire: true }).then(() => {
        const versionStore = useVersionCGUStore()
        return versionStore.setCguValidées()
      })
    },
  })
}
