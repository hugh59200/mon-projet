import { supabase } from '@/supabase/supabaseClient'
import type { Tables } from '@/supabase/types/supabase'

export type NewsArticle = Tables<'news'>

/**
 * 📦 Récupère toutes les actualités (publiées)
 */
export async function fetchNews(): Promise<(NewsArticle & { date: string | null })[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data.map((a) => ({ ...a, date: a.published_at }))
}

/**
 * 🔎 Récupère un article spécifique par slug
 */
export async function fetchNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const { data, error } = await supabase.from('news').select('*').eq('slug', slug).maybeSingle()

  if (error) throw error
  return data
}

/**
 * 🗑️ Supprime une actualité par son ID + son image liée (si présente)
 */
export async function deleteNews(id: string) {
  // 🧱 Étape 1 : récupérer l'actualité pour connaître son image
  const { data: article, error: fetchError } = await supabase
    .from('news')
    .select('id, image')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error('Actualité introuvable ou accès refusé')

  // 🧱 Étape 2 : supprimer le fichier image du bucket (si existant)
  if (article?.image) {
    try {
      const path = article.image.split('/news-images/')[1]
      if (path) {
        await supabase.storage.from('news-images').remove([path])
      }
    } catch (err) {
      console.warn('⚠️ Erreur lors de la suppression de l’image :', err)
    }
  }

  // 🧱 Étape 3 : supprimer la ligne dans la table news
  const { error: deleteError } = await supabase.from('news').delete().eq('id', id)
  if (deleteError) throw new Error(`Erreur Supabase : ${deleteError.message}`)

  return true
}
