import { uploadNewsImage } from '../../api'
import { deleteTopicImage } from '../../api/topicImages'
import { useImageHandler } from '../../shared/useImageHandler'

export function useNewsImageHandler(readonly: () => boolean) {
  return useImageHandler(readonly, {
    upload: (slug, file) => uploadNewsImage(slug, file),
    remove: async (imageUrl) => {
      await deleteTopicImage(imageUrl)
    },
  })
}

export type UseNewsImageHandlerReturn = ReturnType<typeof useNewsImageHandler>
