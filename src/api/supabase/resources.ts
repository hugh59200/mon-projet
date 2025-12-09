import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { TablesInsert } from '@/supabase/types/supabase'
import type { Resources, ResourceCategories } from '@/supabase/types/supabase.types'

export type ResourceWithCategory = Resources & {
  category?: ResourceCategories | null
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

/**
 * Récupère toutes les ressources publiées
 */
export async function fetchResources(categorySlug?: string): Promise<ResourceWithCategory[]> {
  let query = supabase
    .from('resources')
    .select('*, category:resource_categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (categorySlug) {
    // Filtrer par slug de catégorie via une sous-requête
    const { data: category } = await supabase
      .from('resource_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  const { data, error } = await query
  if (error) throw new Error(`Erreur lors du chargement des ressources : ${error.message}`)
  return data ?? []
}

/**
 * Récupère les ressources mises en avant
 */
export async function fetchFeaturedResources(limit = 4): Promise<ResourceWithCategory[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*, category:resource_categories(*)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Erreur lors du chargement des ressources : ${error.message}`)
  return data ?? []
}

/**
 * Récupère une ressource par son slug
 */
export async function fetchResourceBySlug(slug: string): Promise<ResourceWithCategory | null> {
  const { data, error } = await supabase
    .from('resources')
    .select('*, category:resource_categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) throw new Error(`Erreur Supabase : ${error.message}`)
  return data
}

/**
 * Récupère une ressource par son ID
 */
export async function fetchResourceById(id: string): Promise<ResourceWithCategory | null> {
  const { data, error } = await supabase
    .from('resources')
    .select('*, category:resource_categories(*)')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`Erreur Supabase : ${error.message}`)
  return data
}

/**
 * Récupère les ressources similaires (même catégorie)
 */
export async function fetchRelatedResources(
  currentSlug: string,
  categoryId: string,
  limit = 3,
): Promise<ResourceWithCategory[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*, category:resource_categories(*)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Erreur lors du chargement des ressources : ${error.message}`)
  return data ?? []
}

/**
 * Récupère toutes les catégories de ressources
 */
export async function fetchResourceCategories(): Promise<ResourceCategories[]> {
  const { data, error } = await supabase
    .from('resource_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(`Erreur chargement catégories : ${error.message}`)
  return data ?? []
}

/**
 * Compte les ressources par catégorie
 */
export async function fetchResourceCountByCategory(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('resources')
    .select('category_id')
    .eq('status', 'published')

  if (error) throw new Error(`Erreur comptage ressources : ${error.message}`)

  const counts: Record<string, number> = {}
  data?.forEach((r) => {
    if (r.category_id) {
      counts[r.category_id] = (counts[r.category_id] || 0) + 1
    }
  })
  return counts
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

/**
 * Récupère toutes les ressources (admin - tous statuts)
 */
export async function fetchAllResourcesAdmin(): Promise<ResourceWithCategory[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*, category:resource_categories(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Erreur lors du chargement des ressources : ${error.message}`)
  return data ?? []
}

/**
 * Crée une nouvelle ressource
 */
export async function createResource(resource: TablesInsert<'resources'>): Promise<Resources> {
  const { data, error } = await supabase.from('resources').insert(resource).select().single()

  if (error) throw new Error(`Erreur création ressource : ${error.message}`)
  return data
}

/**
 * Met à jour une ressource
 */
export async function updateResource(id: string, updates: Partial<Resources>): Promise<boolean> {
  const { error } = await supabase.from('resources').update(updates).eq('id', id)

  if (error) throw new Error(`Erreur mise à jour ressource : ${error.message}`)
  return true
}

/**
 * Supprime une ressource
 */
export async function deleteResource(id: string): Promise<boolean> {
  const { data: resource, error: fetchError } = await supabase
    .from('resources')
    .select('id, image')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error('Ressource introuvable ou accès refusé')

  // Supprimer l'image associée si elle existe
  if (resource?.image) {
    const path = resource.image.split('/resource-images/')[1]
    if (path) {
      await supabase.storage.from('resource-images').remove([path]).catch(() => {})
    }
  }

  const { error: deleteError } = await supabase.from('resources').delete().eq('id', id)
  if (deleteError) throw new Error(`Erreur Supabase : ${deleteError.message}`)
  return true
}
