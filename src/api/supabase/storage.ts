import { supabase } from '@/supabase/supabaseClient'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ============================================================
// NEWS IMAGES
// ============================================================

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

export async function deleteNewsImage(imageUrl: string): Promise<boolean> {
  try {
    const path = imageUrl.split('/news-images/')[1]
    if (!path) return false

    const { error } = await supabase.storage.from('news-images').remove([path])
    if (error) throw new Error(`Erreur suppression image : ${error.message}`)

    return true
  } catch (err: any) {
    console.warn("Erreur lors de la suppression de l'image news :", err)
    return false
  }
}

// ============================================================
// TOPIC IMAGES
// ============================================================

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

    if (previousUrl) {
      const oldPath = previousUrl.split('/topic-images/')[1]
      if (oldPath) {
        await supabase.storage.from('topic-images').remove([oldPath])
      }
    }

    const { error: uploadError } = await supabase.storage
      .from('topic-images')
      .upload(filePath, file)

    if (uploadError) throw new Error(uploadError.message)

    const { data } = supabase.storage.from('topic-images').getPublicUrl(filePath)
    if (!data?.publicUrl) throw new Error("Impossible de récupérer l'URL publique")

    return `${data.publicUrl}?v=${timestamp}`
  } catch (err: any) {
    console.error('Erreur uploadTopicImage :', err.message)
    throw new Error(`Erreur upload image topic : ${err.message}`)
  }
}

export async function deleteTopicImage(imageUrl: string): Promise<boolean> {
  try {
    const path = imageUrl.split('/topic-images/')[1]
    if (!path) return false

    const { error } = await supabase.storage.from('topic-images').remove([path])
    if (error) throw new Error(error.message)

    return true
  } catch (err: any) {
    console.warn("Erreur lors de la suppression de l'image topic :", err)
    return false
  }
}
