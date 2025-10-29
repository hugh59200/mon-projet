import { supabase } from '@/supabase/supabaseClient'

/**
 * Nettoie le titre d'une news pour créer un chemin valide (sans accents, espaces, caractères spéciaux)
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // enlève les accents
    .replace(/[\u0300-\u036f]/g, '') // supprime les diacritiques
    .replace(/[^a-z0-9]+/g, '-') // remplace tout sauf alphanumérique par -
    .replace(/(^-|-$)/g, '') // supprime les tirets en trop
}

/**
 * ☁️ Upload une image d’article dans le bucket `news-images`
 * et retourne son URL publique.
 */
export async function uploadNewsImage(title: string, file: File): Promise<string> {
  const safeSlug = slugify(title)
  const ext = file.name.split('.').pop()
  const filePath = `news/${safeSlug}/news-${safeSlug}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('news-images')
    .upload(filePath, file, { upsert: true, cacheControl: '3600' })

  if (uploadError) throw new Error(`Erreur upload image : ${uploadError.message}`)

  const { data } = supabase.storage.from('news-images').getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * 🗑️ Supprime une image d’article du bucket `news-images`
 */
export async function deleteNewsImage(imageUrl: string): Promise<boolean> {
  try {
    const path = imageUrl.split('/news-images/')[1]
    if (!path) return false

    const { error } = await supabase.storage.from('news-images').remove([path])
    if (error) throw new Error(`Erreur suppression image : ${error.message}`)

    return true
  } catch (err: any) {
    console.warn('⚠️ Erreur lors de la suppression de l’image news :', err)
    return false
  }
}
