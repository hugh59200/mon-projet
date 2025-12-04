import { deleteTopicImage, uploadTopicImage } from '@/api/supabase/storage'
import { useImageHandler } from '../../shared/composables/useImageHandler'

export function useTopicImageHandler(readonly: () => boolean) {
  return useImageHandler(readonly, {
    // ⬇️ Ajout du paramètre previousUrl
    upload: (label, file, previousUrl?: string) => uploadTopicImage(label, file, previousUrl),

    remove: async (url) => {
      await deleteTopicImage(url)
    },
  })
}

export type UseTopicImageHandlerReturn = ReturnType<typeof useTopicImageHandler>
