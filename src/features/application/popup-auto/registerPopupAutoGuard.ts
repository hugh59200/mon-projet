import type { Router } from 'vue-router'
import { getAllPopupAuto } from './PopupAuto'

export function registerPopupAutoGuard(router: Router) {
  router.afterEach(async () => {
    const allPopup = getAllPopupAuto()
    for (const popup of allPopup) {
      if (await popup.canPopup()) {
        popup.showPopup()
        return
      }
    }
  })
}
