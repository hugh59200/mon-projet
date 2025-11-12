import { supabase } from '@/supabase/supabaseClient'
import type { News, NewsTopics } from '@/supabase/types/supabase.types'

export async function fetchNews(
  topicId?: string,
): Promise<(News & { topic: NewsTopics | null })[]> {
  let query = supabase
    .from('news')
    .select('*, topic:news_topics(*)')
    .order('published_at', { ascending: false })

  if (topicId) query = query.eq('topic_id', topicId)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function fetchNewsBySlug(
  slug: string,
): Promise<(News & { topic: NewsTopics | null }) | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*, topic:news_topics(*)')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function fetchNewsTopics(): Promise<NewsTopics[]> {
  const { data, error } = await supabase.from('news_topics').select('*').order('id')
  if (error) throw error
  return data
}

export async function deleteNews(id: string) {
  const { data: article, error: fetchError } = await supabase
    .from('news')
    .select('id, image')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error('Actualité introuvable ou accès refusé')

  if (article?.image) {
    try {
      const path = article.image.split('/news-images/')[1]
      if (path) await supabase.storage.from('news-images').remove([path])
    } catch (err) {
      console.warn('⚠️ Erreur lors de la suppression de l’image :', err)
    }
  }

  const { error: deleteError } = await supabase.from('news').delete().eq('id', id)
  if (deleteError) throw new Error(`Erreur Supabase : ${deleteError.message}`)

  return true
}
