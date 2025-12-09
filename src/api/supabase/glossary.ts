import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { TablesInsert } from '@/supabase/types/supabase'
import type { GlossaryTerms, Products, Resources } from '@/supabase/types/supabase.types'

/**
 * Type partiel pour la liste (colonnes sélectionnées)
 */
export type GlossaryTermListItem = Pick<GlossaryTerms, 'id' | 'slug' | 'term' | 'meta_description' | 'created_at'>

/**
 * Type partiel pour les produits liés
 */
export type RelatedProduct = Pick<Products, 'id' | 'name' | 'slug' | 'dosage' | 'price' | 'sale_price' | 'is_on_sale' | 'image'>

/**
 * Type partiel pour les ressources liées
 */
export type RelatedResource = Pick<Resources, 'id' | 'title' | 'slug' | 'excerpt' | 'image'>

/**
 * Type enrichi avec produits et ressources liés
 */
export type GlossaryTermWithRelations = GlossaryTerms & {
  relatedProducts?: RelatedProduct[]
  relatedResources?: RelatedResource[]
}

// ==========================================
// PUBLIC FUNCTIONS
// ==========================================

/**
 * Récupère tous les termes publiés (pour la liste)
 * Retourne uniquement les champs nécessaires pour la liste
 */
export async function fetchGlossaryTerms(): Promise<GlossaryTermListItem[]> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('id, slug, term, meta_description, created_at')
    .eq('status', 'published')
    .order('term', { ascending: true })

  if (error) throw new Error(`Erreur chargement glossaire : ${error.message}`)
  return data ?? []
}

/**
 * Récupère un terme par son slug avec les relations (produits et ressources)
 */
export async function fetchGlossaryTermBySlug(slug: string): Promise<GlossaryTermWithRelations | null> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) throw new Error(`Erreur Supabase : ${error.message}`)
  if (!data) return null

  // Charger les produits liés
  let relatedProducts: RelatedProduct[] = []
  if (data.related_product_ids?.length) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug, dosage, price, sale_price, is_on_sale, image')
      .in('id', data.related_product_ids)

    relatedProducts = products ?? []
  }

  // Charger les ressources liées
  let relatedResources: RelatedResource[] = []
  if (data.related_resource_ids?.length) {
    const { data: resources } = await supabase
      .from('resources')
      .select('id, title, slug, excerpt, image')
      .in('id', data.related_resource_ids)
      .eq('status', 'published')

    relatedResources = resources ?? []
  }

  return {
    ...data,
    relatedProducts,
    relatedResources,
  }
}

/**
 * Type partiel pour la recherche
 */
export type GlossaryTermSearchItem = Pick<GlossaryTerms, 'id' | 'slug' | 'term' | 'meta_description'>

/**
 * Recherche dans le glossaire
 */
export async function searchGlossaryTerms(query: string): Promise<GlossaryTermSearchItem[]> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('id, slug, term, meta_description')
    .eq('status', 'published')
    .ilike('term', `%${query}%`)
    .order('term', { ascending: true })
    .limit(20)

  if (error) throw new Error(`Erreur recherche glossaire : ${error.message}`)
  return data ?? []
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

/**
 * Récupère tous les termes (admin - tous statuts)
 */
export async function fetchAllGlossaryTermsAdmin(): Promise<GlossaryTerms[]> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .order('term', { ascending: true })

  if (error) throw new Error(`Erreur chargement glossaire : ${error.message}`)
  return data ?? []
}

/**
 * Récupère un terme par son ID (admin)
 */
export async function fetchGlossaryTermById(id: string): Promise<GlossaryTerms | null> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`Erreur Supabase : ${error.message}`)
  return data
}

/**
 * Crée un nouveau terme
 */
export async function createGlossaryTerm(term: TablesInsert<'glossary_terms'>): Promise<GlossaryTerms> {
  const { data, error } = await supabase.from('glossary_terms').insert(term).select().single()

  if (error) throw new Error(`Erreur création terme : ${error.message}`)
  return data
}

/**
 * Met à jour un terme
 */
export async function updateGlossaryTerm(id: string, updates: Partial<GlossaryTerms>): Promise<boolean> {
  const { error } = await supabase.from('glossary_terms').update(updates).eq('id', id)

  if (error) throw new Error(`Erreur mise à jour terme : ${error.message}`)
  return true
}

/**
 * Supprime un terme
 */
export async function deleteGlossaryTerm(id: string): Promise<boolean> {
  const { error } = await supabase.from('glossary_terms').delete().eq('id', id)

  if (error) throw new Error(`Erreur Supabase : ${error.message}`)
  return true
}
