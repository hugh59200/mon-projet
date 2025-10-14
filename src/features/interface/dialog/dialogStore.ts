import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { DialogResult, DialogType, Invocation } from './types'

export type DialogStoreModel =
  | { visible: false; type: undefined }
  | {
      visible: true
      type: DialogType
      title?: string
      message: string | string[]
      closable?: boolean
      isHtml?: boolean
    }

export const useDialogStore = defineStore('dialog', () => {
  const dialogStack = ref<Array<Invocation>>([])

  const dialogModel = computed<DialogStoreModel>(() => {
    const invocation = dialogStack.value[0]
    if (!invocation) {
      return {
        visible: false,
      }
    } else {
      return {
        type: invocation.type,
        title: invocation.title,
        message: invocation.message,
        visible: true,
        closable: invocation.closable,
        isHtml: invocation.isHtml,
      }
    }
  })

  const pushMessage = (invocation: Invocation) => {
    dialogStack.value.push(invocation)
  }

  function getDefaultResult(result: DialogResult | null | undefined): DialogResult {
    if (!result && dialogModel.value.type) {
      switch (dialogModel.value.type) {
        case 'Ok':
          return 'Ok'
        case 'OkCancel':
          return 'Cancel'
        case 'CancelRetry':
          return 'Cancel'
        case 'YesNo':
          return 'No'
      }
    }
    return result!
  }

  const triggerUserAction = (result: DialogResult | null) => {
    const returnResult = getDefaultResult(result)
    dialogStack.value[0]!.resolve(returnResult)
    dialogStack.value.shift()
  }

  return {
    dialogModel,
    pushMessage,
    triggerUserAction,
  }
})
