import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { TablesInsert } from '@/supabase/types/supabase'
import type { NewsTopics } from '@/supabase/types/supabase.types'

export async function fetchTopics(): Promise<NewsTopics[]> {
  const { data, error } = await supabase
    .from('news_topics')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Erreur chargement topics : ${error.message}`)
  return data ?? []
}

export async function fetchTopicById(id: string): Promise<NewsTopics | null> {
  const { data, error } = await supabase.from('news_topics').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`Erreur Supabase : ${error.message}`)
  return data
}

export async function createTopic(
  topic: Partial<TablesInsert<'news_topics'>>,
): Promise<NewsTopics> {
  if (!topic.label) throw new Error('Le champ "label" est obligatoire pour créer un topic')

  const slug = topic.label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const { data, error } = await supabase
    .from('news_topics')
    .insert({
      slug,
      label: topic.label,
      description: topic.description ?? `Articles liés à ${topic.label}`,
      image: topic.image ?? null,
    })
    .select()
    .single()

  if (error) throw new Error(`Erreur création topic : ${error.message}`)
  return data
}

export async function updateTopic(
  id: string,
  payload: {
    label?: string
    image?: string | null
    label_i18n?: Record<string, string>
    description_i18n?: Record<string, string>
  },
) {
  const { data, error } = await supabase
    .from('news_topics')
    .update({
      label: payload.label,
      image: payload.image ?? null,
      label_i18n: payload.label_i18n,
      description_i18n: payload.description_i18n,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteTopic(id: string): Promise<void> {
  const { error } = await supabase.from('news_topics').delete().eq('id', id)
  if (error) throw new Error(`Erreur suppression topic : ${error.message}`)
}
