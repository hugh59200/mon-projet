// src/features/actualités/api/topicImages.ts
import { supabase } from '@/supabase/supabaseClient'

/**
 * ☁️ Upload une image de topic dans le bucket `topic-images`
 * et retourne son URL publique.
 */
export async function uploadTopicImage(slug: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const filePath = `topics/${slug}/topic-${slug}.${ext}`

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

/**
 * 🔍 Génère un chemin d’image unique à partir d’un slug
 * (utile pour éviter les collisions)
 */
export function getTopicImagePath(slug: string, fileName: string): string {
  const ext = fileName.split('.').pop()
  return `topics/${slug}/topic-${slug}.${ext}`
}
