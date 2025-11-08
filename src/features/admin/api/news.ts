// src/features/actualités/api/news.ts
import { supabase } from '@/supabase/supabaseClient'
import type { TablesInsert } from '@/supabase/types/supabase'
import type { News, NewsTopics } from '@/supabase/types/supabase.types'

export type NewsWithTopic = News & { topic?: NewsTopics | null }

/**
 * 📦 Récupère toutes les actualités, éventuellement filtrées par topic_id
 */
export async function fetchNews(topicId?: string): Promise<NewsWithTopic[]> {
  const query = supabase
    .from('news')
    .select('*, topic:news_topics(*)') // jointure sur la table topic
    .order('published_at', { ascending: false })

  if (topicId) query.eq('topic_id', topicId)

  const { data, error } = await query
  if (error) throw new Error(`Erreur lors du chargement des actualités : ${error.message}`)
  return data
}

/**
 * 🔎 Récupère un article spécifique par slug
 */
export async function fetchNewsBySlug(slug: string): Promise<NewsWithTopic | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*, topic:news_topics(*)')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(`Erreur Supabase : ${error.message}`)
  return data
}

/**
 * 🔎 Récupère un article par ID
 */
export async function fetchNewsById(id: string): Promise<NewsWithTopic | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*, topic:news_topics(*)')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`Erreur Supabase : ${error.message}`)
  return data
}

/**
 * ➕ Crée une nouvelle actualité
 */
export async function createNews(article: TablesInsert<'news'>): Promise<News> {
  const { data, error } = await supabase.from('news').insert(article).select().single()
  if (error) throw new Error(`Erreur création actualité : ${error.message}`)
  return data
}

/**
 * ✏️ Met à jour une actualité
 */
export async function updateNews(id: string, updates: Partial<News>): Promise<boolean> {
  const { error } = await supabase.from('news').update(updates).eq('id', id)
  if (error) throw new Error(`Erreur mise à jour actualité : ${error.message}`)
  return true
}

/**
 * 🗑️ Supprime une actualité (et son image si existante)
 */
export async function deleteNews(id: string): Promise<boolean> {
  // 1️⃣ Récupère la ligne pour supprimer l’image liée
  const { data: article, error: fetchError } = await supabase
    .from('news')
    .select('id, image')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error('Actualité introuvable ou accès refusé')

  // 2️⃣ Supprime l’image du bucket
  if (article?.image) {
    const path = article.image.split('/news-images/')[1]
    if (path) {
      try {
        await supabase.storage.from('news-images').remove([path])
      } catch (err) {
        console.warn('⚠️ Erreur lors de la suppression de l’image :', err)
      }
    }
  }

  // 3️⃣ Supprime la ligne
  const { error: deleteError } = await supabase.from('news').delete().eq('id', id)
  if (deleteError) throw new Error(`Erreur Supabase : ${deleteError.message}`)
  return true
}

/**
 * ☁️ Upload l’image d’une actualité et retourne son URL publique
 */
export async function uploadNewsImage(slug: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const filePath = `news/${slug}/news-${slug}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('news-images')
    .upload(filePath, file, { upsert: true, cacheControl: '3600' })

  if (uploadError) throw new Error(`Erreur upload image : ${uploadError.message}`)

  const { data } = supabase.storage.from('news-images').getPublicUrl(filePath)
  return data.publicUrl
}
