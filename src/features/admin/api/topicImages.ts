import { supabase } from '@/supabase/supabaseClient'

/**
 * Nettoie un nom pour en faire un chemin valide dans Supabase Storage.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // enlève les accents
    .replace(/[\u0300-\u036f]/g, '') // décompose les caractères accentués
    .replace(/[^a-z0-9]+/g, '-') // remplace tout ce qui n’est pas alphanumérique par -
    .replace(/(^-|-$)/g, '') // supprime les tirets en trop
}

/**
 * ☁️ Upload une image de topic dans le bucket `topic-images`
 * et retourne son URL publique.
 */
export async function uploadTopicImage(slug: string, file: File): Promise<string> {
  const safeSlug = slugify(slug)
  const ext = file.name.split('.').pop()
  const filePath = `topics/${safeSlug}/topic-${safeSlug}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('topic-images')
    .upload(filePath, file, { upsert: true, cacheControl: '3600' })

  if (uploadError) throw new Error(`Erreur upload image topic : ${uploadError.message}`)

  const { data } = supabase.storage.from('topic-images').getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * 🗑️ Supprime une image de topic du bucket `topic-images`
 */
export async function deleteTopicImage(imageUrl: string): Promise<boolean> {
  try {
    const path = imageUrl.split('/topic-images/')[1]
    if (!path) return false

    const { error } = await supabase.storage.from('topic-images').remove([path])
    if (error) throw new Error(`Erreur suppression image topic : ${error.message}`)

    return true
  } catch (err: any) {
    console.warn('⚠️ Erreur lors de la suppression de l’image topic :', err)
    return false
  }
}
