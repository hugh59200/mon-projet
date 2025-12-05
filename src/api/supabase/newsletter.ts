import { supabaseSilent as supabase } from '@/supabase/supabaseClient'

// Note: La table 'newsletter_subscribers' doit être créée en exécutant la migration
// supabase/migrations/20241206_create_newsletter.sql
// Puis regénérer les types: npm run gen:types

// ============================================
// TYPES
// ============================================

export type NewsletterStatus = 'pending' | 'active' | 'unsubscribed' | 'bounced'
export type NewsletterSource = 'website' | 'checkout' | 'popup' | 'footer' | 'admin' | 'import'
export type NewsletterFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly'
export type NewsletterTopic = 'products' | 'research' | 'promotions' | 'news'

export interface NewsletterPreferences {
  frequency: NewsletterFrequency
  topics: NewsletterTopic[]
  format: 'html' | 'text'
}

export interface NewsletterSubscriber {
  id: string
  email: string
  user_id: string | null
  first_name: string | null
  status: NewsletterStatus
  preferences: NewsletterPreferences
  source: NewsletterSource
  confirmation_token: string | null
  confirmed_at: string | null
  locale: string
  country: string | null
  last_email_sent_at: string | null
  last_email_opened_at: string | null
  emails_sent_count: number
  emails_opened_count: number
  unsubscribed_at: string | null
  unsubscribe_reason: string | null
  created_at: string
  updated_at: string
}

export interface NewsletterStats {
  total_subscribers: number
  active_subscribers: number
  pending_subscribers: number
  unsubscribed_count: number
  new_last_30_days: number
  new_last_7_days: number
  active_rate: number
  locales_count: number
}

export interface SubscribeParams {
  email: string
  firstName?: string
  source?: NewsletterSource
  locale?: string
  preferences?: Partial<NewsletterPreferences>
}

export interface SubscribeResult {
  success: boolean
  message: 'subscribed' | 'already_subscribed' | 'resubscribed' | 'error'
  subscriber_id?: string
  confirmation_token?: string
}

// ============================================
// SUBSCRIBE / UNSUBSCRIBE
// ============================================

/**
 * S'abonner à la newsletter
 */
export async function subscribeToNewsletter(params: SubscribeParams): Promise<SubscribeResult> {
  try {
    const { data, error } = await (supabase as any).rpc('subscribe_to_newsletter', {
      p_email: params.email,
      p_first_name: params.firstName || null,
      p_source: params.source || 'website',
      p_locale: params.locale || 'fr',
      p_preferences: params.preferences
        ? JSON.stringify({
            frequency: params.preferences.frequency || 'weekly',
            topics: params.preferences.topics || ['products', 'research', 'promotions', 'news'],
            format: params.preferences.format || 'html',
          })
        : null,
    })

    if (error) throw error

    return data as SubscribeResult
  } catch (error) {
    console.error('Erreur lors de l\'abonnement à la newsletter:', error)
    return {
      success: false,
      message: 'error',
    }
  }
}

/**
 * Se désabonner de la newsletter
 */
export async function unsubscribeFromNewsletter(
  email: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await (supabase as any).rpc('unsubscribe_from_newsletter', {
      p_email: email,
      p_reason: reason || null,
    })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Erreur lors de la désinscription:', error)
    return {
      success: false,
      message: 'error',
    }
  }
}

/**
 * Confirmer l'abonnement (double opt-in)
 */
export async function confirmNewsletterSubscription(
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await (supabase as any).rpc('confirm_newsletter_subscription', {
      p_token: token,
    })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Erreur lors de la confirmation:', error)
    return {
      success: false,
      message: 'error',
    }
  }
}

// ============================================
// QUERIES
// ============================================

/**
 * Vérifier si un email est déjà abonné
 */
export async function checkNewsletterSubscription(email: string): Promise<{
  isSubscribed: boolean
  status: NewsletterStatus | null
}> {
  try {
    const { data, error } = await (supabase as any)
      .from('newsletter_subscribers')
      .select('status')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (error) throw error

    return {
      isSubscribed: data?.status === 'active',
      status: data?.status || null,
    }
  } catch {
    return {
      isSubscribed: false,
      status: null,
    }
  }
}

/**
 * Récupérer les informations d'abonnement d'un utilisateur connecté
 */
export async function getUserNewsletterSubscription(
  userId: string
): Promise<NewsletterSubscriber | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('newsletter_subscribers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error

    return data as NewsletterSubscriber | null
  } catch {
    return null
  }
}

/**
 * Mettre à jour les préférences de newsletter
 */
export async function updateNewsletterPreferences(
  email: string,
  preferences: Partial<NewsletterPreferences>
): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('newsletter_subscribers')
      .update({
        preferences: preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase().trim())

    if (error) throw error

    return true
  } catch {
    return false
  }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

/**
 * Récupérer tous les abonnés (admin)
 */
export async function fetchAllSubscribers(params?: {
  status?: NewsletterStatus
  locale?: string
  limit?: number
  offset?: number
}): Promise<{ subscribers: NewsletterSubscriber[]; count: number }> {
  try {
    let query = (supabase as any)
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' })

    if (params?.status) {
      query = query.eq('status', params.status)
    }
    if (params?.locale) {
      query = query.eq('locale', params.locale)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(params?.offset || 0, (params?.offset || 0) + (params?.limit || 50) - 1)

    const { data, error, count } = await query

    if (error) throw error

    return {
      subscribers: (data || []) as NewsletterSubscriber[],
      count: count || 0,
    }
  } catch {
    return {
      subscribers: [],
      count: 0,
    }
  }
}

/**
 * Récupérer les statistiques de la newsletter (admin)
 */
export async function fetchNewsletterStats(): Promise<NewsletterStats | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('newsletter_stats')
      .select('*')
      .single()

    if (error) throw error

    return data as NewsletterStats
  } catch {
    return null
  }
}

/**
 * Exporter les emails pour une campagne (admin)
 */
export async function exportActiveSubscribers(params?: {
  locale?: string
  topics?: NewsletterTopic[]
}): Promise<{ email: string; first_name: string | null; locale: string }[]> {
  try {
    let query = (supabase as any)
      .from('newsletter_subscribers')
      .select('email, first_name, locale')
      .eq('status', 'active')

    if (params?.locale) {
      query = query.eq('locale', params.locale)
    }

    // Note: filtrage par topics nécessite une requête JSON plus complexe

    const { data, error } = await query

    if (error) throw error

    return data || []
  } catch {
    return []
  }
}

/**
 * Importer des abonnés en masse (admin)
 */
export async function importSubscribers(
  subscribers: { email: string; first_name?: string; locale?: string }[]
): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const results = {
    imported: 0,
    skipped: 0,
    errors: [] as string[],
  }

  for (const sub of subscribers) {
    const result = await subscribeToNewsletter({
      email: sub.email,
      firstName: sub.first_name,
      locale: sub.locale || 'fr',
      source: 'import',
    })

    if (result.success) {
      if (result.message === 'already_subscribed') {
        results.skipped++
      } else {
        results.imported++
      }
    } else {
      results.errors.push(`${sub.email}: ${result.message}`)
    }
  }

  return results
}
