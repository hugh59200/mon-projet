import { supabase } from '@/supabase/supabaseClient'

/** Nettoie le nom du topic pour un chemin valide */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** ☁️ Upload une image de topic dans Supabase Storage (avec suppression préalable) */
export async function uploadTopicImage(
  label: string,
  file: File,
  previousUrl?: string,
): Promise<string> {
  try {
    const safeSlug = slugify(label)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const timestamp = Date.now()
    const filePath = `topics/${safeSlug}/topic-${safeSlug}-${timestamp}.${ext}`

    // 🗑️ Supprimer l’ancienne image si présente
    if (previousUrl) {
      const oldPath = previousUrl.split('/topic-images/')[1]
      if (oldPath) {
        await supabase.storage.from('topic-images').remove([oldPath])
      }
    }

    // ☁️ Upload du nouveau fichier (pas de upsert ici)
    const { error: uploadError } = await supabase.storage
      .from('topic-images')
      .upload(filePath, file)

    if (uploadError) throw new Error(uploadError.message)

    // 🔗 Récupération de l’URL publique
    const { data } = supabase.storage.from('topic-images').getPublicUrl(filePath)
    if (!data?.publicUrl) throw new Error('Impossible de récupérer l’URL publique')

    // ✅ Ajout d’un cache-bust pour forcer l’actualisation visuelle
    return `${data.publicUrl}?v=${timestamp}`
  } catch (err: any) {
    console.error('❌ Erreur uploadTopicImage :', err.message)
    throw new Error(`Erreur upload image topic : ${err.message}`)
  }
}

/** 🗑️ Supprime une image existante dans Supabase Storage */
export async function deleteTopicImage(imageUrl: string): Promise<boolean> {
  try {
    const path = imageUrl.split('/topic-images/')[1]
    if (!path) return false

    const { error } = await supabase.storage.from('topic-images').remove([path])
    if (error) throw new Error(error.message)

    return true
  } catch (err: any) {
    console.warn('⚠️ Erreur lors de la suppression de l’image topic :', err)
    return false
  }
}
