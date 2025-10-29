import { supabase } from '@/supabase/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/supabase/types/supabase'

export type NewsTopic = Tables<'news_topics'>

export async function fetchTopics(): Promise<NewsTopic[]> {
  const { data, error } = await supabase
    .from('news_topics')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Erreur chargement topics : ${error.message}`)
  return data
}

export async function fetchTopicById(id: string): Promise<NewsTopic | null> {
  const { data, error } = await supabase.from('news_topics').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`Erreur Supabase : ${error.message}`)
  return data
}

export async function createTopic(topic: Partial<TablesInsert<'news_topics'>>): Promise<NewsTopic> {
  if (!topic.label) throw new Error('Le champ "label" est obligatoire pour créer un topic')

  // Génère un id slugifié unique
  let id = topic.label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  // 🔁 Vérifie si un topic avec cet id existe déjà
  const { data: existing } = await supabase
    .from('news_topics')
    .select('id')
    .eq('id', id)
    .maybeSingle()
  if (existing) {
    id = `${id}-${Date.now()}`
  }

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

  if (error) throw new Error(`Erreur création topic : ${error.message}`)
  if (!data) throw new Error('Erreur création topic : aucune donnée retournée')

  return data
}

export async function updateTopic(id: string, updates: TablesUpdate<'news_topics'>): Promise<void> {
  const { error } = await supabase.from('news_topics').update(updates).eq('id', id)
  if (error) throw new Error(`Erreur mise à jour topic : ${error.message}`)
}

export async function deleteTopic(id: string): Promise<void> {
  const { error } = await supabase.from('news_topics').delete().eq('id', id)
  if (error) throw new Error(`Erreur suppression topic : ${error.message}`)
}
