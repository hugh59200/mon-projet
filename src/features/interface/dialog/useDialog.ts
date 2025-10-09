import { useDialogStore } from './dialogStore'
import type { DialogResult, IDialog, Invocation, ShowDialogOptions } from './types'

export function useDialog(): IDialog {
  const store = useDialogStore()

  function showDialog(options: ShowDialogOptions) {
    return new Promise<DialogResult>((resolve) => {
      const invocation: Invocation = {
        resolve,
        ...options,
      }
      store.pushMessage(invocation)
    })
  }
  return { showDialog }
}
