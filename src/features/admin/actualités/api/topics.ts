// src/features/actualités/api/topics.ts
import { supabase } from '@/supabase/supabaseClient'
import type { Tables, TablesInsert } from '@/supabase/types/supabase'

export type NewsTopic = Tables<'news_topics'>

/**
 * 📚 Récupère tous les topics
 */
export async function fetchTopics(): Promise<NewsTopic[]> {
  const { data, error } = await supabase
    .from('news_topics')
    .select('*')
    .order('label', { ascending: true })

  if (error) throw new Error(`Erreur lors du chargement des topics : ${error.message}`)
  return data
}

/**
 * 🔎 Récupère un topic par ID
 */
export async function fetchTopicById(id: string): Promise<NewsTopic | null> {
  const { data, error } = await supabase.from('news_topics').select('*').eq('id', id).maybeSingle()

  if (error) throw new Error(`Erreur Supabase : ${error.message}`)
  return data
}

/**
 * ➕ Crée un nouveau topic (avec slug auto si absent)
 */
export async function createTopic(topic: Partial<TablesInsert<'news_topics'>>): Promise<NewsTopic> {
  // Génération d’un slug si aucun ID n’est fourni
  if (!topic.label) throw new Error('Le champ "label" est obligatoire pour créer un topic')

  const id =
    topic.id ??
    topic.label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const { data, error } = await supabase
    .from('news_topics')
    .insert({
      id,
      label: topic.label,
      description: topic.description ?? `Articles liés à ${topic.label}`,
      image: topic.image ?? null,
    })
    .select()
    .single()

  if (error && !error.message.includes('duplicate key'))
    throw new Error(`Erreur création topic : ${error.message}`)

  if (!data) throw new Error('Erreur création topic : aucune donnée retournée')
  return data
}

/**
 * ✏️ Met à jour un topic existant
 */
export async function updateTopic(id: string, updates: Partial<NewsTopic>): Promise<boolean> {
  const { error } = await supabase.from('news_topics').update(updates).eq('id', id)
  if (error) throw new Error(`Erreur mise à jour topic : ${error.message}`)
  return true
}

/**
 * 🗑️ Supprime un topic (⚠️ attention, les actualités liées verront leur topic_id = NULL)
 */
export async function deleteTopic(id: string): Promise<boolean> {
  const { error } = await supabase.from('news_topics').delete().eq('id', id)
  if (error) throw new Error(`Erreur suppression topic : ${error.message}`)
  return true
}
