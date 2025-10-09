import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteName } from '@/router/route-name.ts'

export type FavoriDialogModel =
  | {
      visible: false
    }
  | {
      visible: true
      titre: string
      routeName: RouteName
    }
const CLOSE_DIALOG = { visible: false } as const

export const useFavoriDialogStore = defineStore('favoriDialog', () => {
  let dialogResolver: ((value: string | PromiseLike<string>) => void) | null = null

  const dialogModel = ref<FavoriDialogModel>({ ...CLOSE_DIALOG })
  const close = function () {
    dialogResolver = null
    dialogModel.value = CLOSE_DIALOG
  }

  const save = function () {
    if ('titre' in dialogModel.value) {
      dialogResolver?.call(null, dialogModel.value.titre)
      close()
    }
  }

  const showDialog = function (routeName: RouteName): Promise<string> {
    return new Promise<string>((resolve) => {
      dialogModel.value = {
        titre: '',
        routeName,
        visible: true,
      }
      dialogResolver = resolve
    })
  }

  return { dialogModel, close, save, showDialog }
})

