import { deleteTopicImage, uploadTopicImage } from '../../api/topicImages'
import { useImageHandler } from '../../shared/useImageHandler'

export function useTopicImageHandler(readonly: () => boolean) {
  return useImageHandler(readonly, {
    upload: (label, file) => uploadTopicImage(label, file),
    remove: async (url) => {
      await deleteTopicImage(url)
    },
  })
}

export type UseTopicImageHandlerReturn = ReturnType<typeof useTopicImageHandler>
