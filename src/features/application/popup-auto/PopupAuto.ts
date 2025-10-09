
type PopupController = { showPopup: () => (Promise<void> | void), canPopup: () => (boolean | Promise<boolean>) }

const RegistedPopup: Record<string | symbol, PopupController> = {}

export type RegisterPopupOptions = {
  /** Prévient le risque de double référencement */
  key: string | symbol,
  /** Est executé une fois puis dé-référencé */
  once?: boolean
} & PopupController

export function registerPopupAuto(popup: RegisterPopupOptions) {
  if (popup.once) {
    const showPopup = async () => {
      await popup.showPopup()
      delete RegistedPopup[popup.key]
    }
    RegistedPopup[popup.key] = {
      ...popup,
      showPopup
    }
  } else {
    RegistedPopup[popup.key] = popup
  }
}

export function getAllPopupAuto() {
  return Object.values(RegistedPopup)
}
