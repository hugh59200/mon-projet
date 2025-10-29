import { deleteTopicImage, uploadTopicImage } from '../api/topicImages'
import { useImageHandler } from '../shared/useImageHandler'

export function useTopicImageHandler(readonly: () => boolean) {
  return useImageHandler(readonly, {
    upload: (id, file) => uploadTopicImage(id, file),
    remove: async (url) => {
      await deleteTopicImage(url)
    },
  })
}
