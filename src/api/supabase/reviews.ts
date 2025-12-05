import { supabaseSilent as supabase } from '@/supabase/supabaseClient'

// Note: La table 'reviews' doit être créée en exécutant la migration
// supabase/migrations/20241205_create_reviews.sql
// Puis regénérer les types: npm run gen:types

// ============================================
// TYPES
// ============================================

export interface Review {
  id: string
  product_id: string
  user_id: string | null
  author_name: string
  author_type: 'standard' | 'premium' | 'pro' | 'verified'
  author_title: string | null
  author_institution: string | null
  rating: number
  title: string | null
  content: string | null
  rating_quality: number | null
  rating_purity: number | null
  rating_shipping: number | null
  rating_value: number | null
  is_verified_purchase: boolean
  is_approved: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface ReviewSummary {
  product_id: string
  review_count: number
  average_rating: number
  avg_quality: number | null
  avg_purity: number | null
  avg_shipping: number | null
  avg_value: number | null
  five_star_count: number
  four_star_count: number
  three_star_count: number
  two_star_count: number
  one_star_count: number
}

export interface ReviewInsert {
  product_id: string
  user_id?: string
  author_name: string
  author_type?: 'standard' | 'premium' | 'pro' | 'verified'
  author_title?: string
  author_institution?: string
  rating: number
  title?: string
  content?: string
  rating_quality?: number
  rating_purity?: number
  rating_shipping?: number
  rating_value?: number
}

// ============================================
// FETCH REVIEWS
// ============================================

/**
 * Récupère les avis approuvés pour un produit
 */
export async function fetchReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as Review[]
  } catch {
    // Table n'existe pas encore
    return []
  }
}

/**
 * Récupère les avis mis en avant pour un produit
 */
export async function fetchFeaturedReviews(productId: string): Promise<Review[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) throw error
    return (data || []) as Review[]
  } catch {
    return []
  }
}

/**
 * Récupère le résumé des avis pour un produit
 */
export async function fetchReviewSummary(productId: string): Promise<ReviewSummary | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('product_reviews_summary')
      .select('*')
      .eq('product_id', productId)
      .maybeSingle()

    if (error) throw error
    return data as ReviewSummary | null
  } catch {
    return null
  }
}

/**
 * Récupère les résumés d'avis pour plusieurs produits
 */
export async function fetchReviewSummaries(productIds: string[]): Promise<ReviewSummary[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('product_reviews_summary')
      .select('*')
      .in('product_id', productIds)

    if (error) throw error
    return (data || []) as ReviewSummary[]
  } catch {
    return []
  }
}

// ============================================
// CREATE / UPDATE REVIEWS
// ============================================

/**
 * Crée un nouvel avis (en attente de modération)
 */
export async function createReview(review: ReviewInsert): Promise<void> {
  const { error } = await (supabase as any).from('reviews').insert({
    ...review,
    is_approved: false,
    is_featured: false,
  })

  if (error) throw error
}

/**
 * Vérifie si l'utilisateur a déjà laissé un avis pour ce produit
 */
export async function hasUserReviewed(productId: string, userId: string): Promise<boolean> {
  try {
    const { count, error } = await (supabase as any)
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('product_id', productId)
      .eq('user_id', userId)

    if (error) return false
    return (count ?? 0) > 0
  } catch {
    return false
  }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

/**
 * Récupère tous les avis en attente de modération (admin)
 */
export async function fetchPendingReviews(): Promise<Review[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('reviews')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: true })

    if (error) throw error
    return (data || []) as Review[]
  } catch {
    return []
  }
}

/**
 * Approuve un avis (admin)
 */
export async function approveReview(reviewId: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('reviews')
    .update({ is_approved: true })
    .eq('id', reviewId)

  if (error) throw error
}

/**
 * Rejette/supprime un avis (admin)
 */
export async function deleteReview(reviewId: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) throw error
}

/**
 * Met en avant un avis (admin)
 */
export async function toggleFeaturedReview(reviewId: string, featured: boolean): Promise<void> {
  const { error } = await (supabase as any)
    .from('reviews')
    .update({ is_featured: featured })
    .eq('id', reviewId)

  if (error) throw error
}
