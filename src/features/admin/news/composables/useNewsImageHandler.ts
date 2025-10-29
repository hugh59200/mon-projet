import { deleteNewsImage, uploadNewsImage } from '../../api/newsImages'
import { useImageHandler } from '../../shared/useImageHandler'

export function useNewsImageHandler(readonly: () => boolean) {
  return useImageHandler(readonly, {
    upload: (title, file) => uploadNewsImage(`${title}-${Date.now()}`, file),
    remove: async (url) => {
      await deleteNewsImage(url)
    },
  })
}
export type UseNewsImageHandlerReturn = ReturnType<typeof useNewsImageHandler>
