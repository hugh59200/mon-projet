import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { ref } from 'vue'

/**
 * Interface d’adaptateur : chaque module (news, topic, user...) doit fournir ses propres fonctions
 */
export interface ImageHandlerAdapter {
  upload: (identifier: string, file: File) => Promise<string>
  remove: (imageUrl: string) => Promise<void>
}

/**
 * Hook universel de gestion d’image : upload, preview, suppression.
 *
 * @param readonly - fonction réactive retournant true si le composant est en lecture seule
 * @param adapter - objet contenant les fonctions `upload` et `remove` spécifiques au module
 */
export function useImageHandler(readonly: () => boolean, adapter: ImageHandlerAdapter) {
  const toast = useToastStore()

  // 🔧 Références réactives
  const selectedFile = ref<File | null>(null)
  const imagePreview = ref<string | null>(null)
  const fileInputRef = ref<HTMLInputElement | null>(null)

  /** 📂 Ouvre le sélecteur de fichier */
  function openFilePicker() {
    if (!readonly()) fileInputRef.value?.click()
  }

  /** 🧠 Gère le changement de fichier */
  function handleFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.show('Veuillez sélectionner une image valide', 'warning')
      return
    }

    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }

  /** 🔍 Extrait le nom du fichier depuis une URL */
  function extractFileName(url: string | null | undefined): string | null {
    if (!url) return null
    const parts = url.split('/')
    return parts[parts.length - 1] ?? null
  }

  /** 🚀 Upload via l’adaptateur fourni */
  async function uploadImage(identifier: string): Promise<string | null> {
    if (!selectedFile.value) return null
    try {
      const uploadedUrl = await adapter.upload(identifier, selectedFile.value)
      toast.show('Image téléchargée ✅', 'success')
      return uploadedUrl
    } catch (err: any) {
      toast.show(`Erreur upload image : ${(err as Error).message}`, 'danger')
      return null
    }
  }

  /** 🗑️ Suppression via l’adaptateur fourni */
  async function removeImage(currentUrl: string | null | undefined) {
    if (readonly() || !currentUrl) return
    try {
      await adapter.remove(currentUrl)
      imagePreview.value = null
      selectedFile.value = null
      toast.show('Image supprimée 🗑️', 'info')
    } catch (err: any) {
      toast.show(`Erreur suppression image : ${(err as Error).message}`, 'danger')
    }
  }

  /** 🧹 Reset complet */
  function reset() {
    selectedFile.value = null
    imagePreview.value = null
    if (fileInputRef.value) fileInputRef.value.value = ''
  }

  return {
    fileInputRef,
    selectedFile,
    imagePreview,
    openFilePicker,
    handleFileChange,
    extractFileName,
    uploadImage,
    removeImage,
    reset,
  }
}

/** 🔧 Typage public (utile pour l’autocomplétion) */
export type UseImageHandlerReturn = ReturnType<typeof useImageHandler>
