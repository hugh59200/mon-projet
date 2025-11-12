import { deleteNewsImage, uploadNewsImage } from '../../../../supabase/api/newsImages'
import { useImageHandler } from '../../shared/composables/useImageHandler'

export function useNewsImageHandler(readonly: () => boolean) {
  return useImageHandler(readonly, {
    upload: (title, file) => uploadNewsImage(`${title}-${Date.now()}`, file),
    remove: async (url) => {
      await deleteNewsImage(url)
    },
  })
}
export type UseNewsImageHandlerReturn = ReturnType<typeof useNewsImageHandler>
