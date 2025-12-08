import { supabase } from '@/supabase/supabaseClient'

// ============================================================
// Types
// ============================================================
// NOTE: Ces types seront auto-générés après exécution de la migration SQL
// et `npm run gen:types`. En attendant, on utilise des types manuels.

export interface UserSession {
  id: string
  user_id: string | null
  session_id: string
  session_type: 'authenticated' | 'anonymous' | 'guest_checkout'
  user_agent: string | null
  ip_address: string | null
  device_type: 'desktop' | 'tablet' | 'mobile' | 'unknown'
  browser: string | null
  os: string | null
  country: string | null
  country_code: string | null
  city: string | null
  region: string | null
  landing_page: string | null
  referrer: string | null
  started_at: string
  last_activity_at: string
  ended_at: string | null
  duration_seconds: number | null
  pages_viewed: number
  added_to_cart: boolean
  completed_order: boolean
  started_checkout: boolean
  metadata: Record<string, unknown>
  // Relations
  profiles?: {
    full_name: string | null
    email: string | null
    avatar_url: string | null
  } | null
}

export interface SessionsStats {
  total_sessions: number
  unique_sessions: number
  authenticated_users: number
  anonymous_sessions: number
  authenticated_sessions: number
  sessions_24h: number
  users_24h: number
  sessions_7d: number
  users_7d: number
  sessions_30d: number
  users_30d: number
  sessions_with_cart: number
  sessions_with_checkout: number
  sessions_with_order: number
  avg_duration_seconds: number | null
  avg_pages_viewed: number | null
  desktop_sessions: number
  mobile_sessions: number
  tablet_sessions: number
}

export interface SessionsByDay {
  day: string
  total_sessions: number
  authenticated_users: number
  anonymous_sessions: number
  conversions: number
  unique_countries: number
}

export interface SessionsByCountry {
  country: string
  country_code: string
  total_sessions: number
  unique_users: number
  orders: number
}

export interface TrackSessionParams {
  session_id: string
  user_id?: string | null
  session_type?: 'authenticated' | 'anonymous' | 'guest_checkout'
  user_agent?: string | null
  ip_address?: string | null
  device_type?: 'desktop' | 'tablet' | 'mobile' | 'unknown'
  browser?: string | null
  os?: string | null
  country?: string | null
  country_code?: string | null
  city?: string | null
  region?: string | null
  landing_page?: string | null
  referrer?: string | null
}

// ============================================================
// API Functions
// ============================================================

// Client Supabase typé "any" pour les tables non encore générées
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

/**
 * Récupère la liste des sessions avec pagination
 */
export async function fetchSessions(options?: {
  limit?: number
  offset?: number
  sessionType?: 'all' | 'authenticated' | 'anonymous'
  orderBy?: keyof UserSession
  ascending?: boolean
}): Promise<{ data: UserSession[]; count: number }> {
  const { limit = 50, offset = 0, sessionType = 'all', orderBy = 'started_at', ascending = false } = options || {}

  let query = db
    .from('user_sessions')
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        email,
        avatar_url
      )
    `,
      { count: 'exact' },
    )
    .order(orderBy, { ascending })
    .range(offset, offset + limit - 1)

  if (sessionType !== 'all') {
    query = query.eq('session_type', sessionType)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: (data || []) as UserSession[],
    count: count || 0,
  }
}

/**
 * Récupère les sessions actives (dernière activité < 5 min)
 */
export async function fetchActiveSessions(): Promise<UserSession[]> {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

  const { data, error } = await db
    .from('user_sessions')
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        email,
        avatar_url
      )
    `,
    )
    .gt('last_activity_at', fiveMinutesAgo)
    .is('ended_at', null)
    .order('last_activity_at', { ascending: false })

  if (error) throw error

  return (data || []) as UserSession[]
}

/**
 * Récupère les statistiques globales des sessions
 */
export async function fetchSessionsStats(): Promise<SessionsStats | null> {
  const { data, error } = await db.from('sessions_stats').select('*').single()

  if (error) throw error

  return data as SessionsStats
}

/**
 * Récupère les sessions par jour (30 derniers jours)
 */
export async function fetchSessionsByDay(): Promise<SessionsByDay[]> {
  const { data, error } = await db.from('sessions_by_day').select('*').order('day', { ascending: false }).limit(30)

  if (error) throw error

  return (data || []) as SessionsByDay[]
}

/**
 * Récupère les sessions par pays
 */
export async function fetchSessionsByCountry(): Promise<SessionsByCountry[]> {
  const { data, error } = await db
    .from('sessions_by_country')
    .select('*')
    .order('total_sessions', { ascending: false })

  if (error) throw error

  return (data || []) as SessionsByCountry[]
}

/**
 * Enregistre ou met à jour une session (RPC)
 */
export async function trackSession(params: TrackSessionParams): Promise<{ success: boolean; session_id: string; is_new: boolean }> {
  const { data, error } = await db.rpc('track_session', {
    p_session_id: params.session_id,
    p_user_id: params.user_id || null,
    p_session_type: params.session_type || 'anonymous',
    p_user_agent: params.user_agent || null,
    p_ip_address: params.ip_address || null,
    p_device_type: params.device_type || 'unknown',
    p_browser: params.browser || null,
    p_os: params.os || null,
    p_country: params.country || null,
    p_country_code: params.country_code || null,
    p_city: params.city || null,
    p_region: params.region || null,
    p_landing_page: params.landing_page || null,
    p_referrer: params.referrer || null,
  })

  if (error) throw error

  return data as { success: boolean; session_id: string; is_new: boolean }
}

/**
 * Met à jour l'activité d'une session
 */
export async function updateSessionActivity(
  sessionId: string,
  updates?: {
    pages_viewed?: number
    added_to_cart?: boolean
    started_checkout?: boolean
    completed_order?: boolean
  },
): Promise<void> {
  const { error } = await db.rpc('update_session_activity', {
    p_session_id: sessionId,
    p_pages_viewed: updates?.pages_viewed ?? null,
    p_added_to_cart: updates?.added_to_cart ?? null,
    p_started_checkout: updates?.started_checkout ?? null,
    p_completed_order: updates?.completed_order ?? null,
  })

  if (error) throw error
}

/**
 * Termine une session
 */
export async function endSession(sessionId: string): Promise<void> {
  const { error } = await db.rpc('end_session', {
    p_session_id: sessionId,
  })

  if (error) throw error
}

/**
 * Récupère l'historique des connexions d'un utilisateur
 */
export async function fetchUserSessionHistory(
  userId: string,
  limit = 20,
): Promise<UserSession[]> {
  const { data, error } = await db
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data || []) as UserSession[]
}

/**
 * Recherche des sessions par email ou nom
 */
export async function searchSessions(
  searchQuery: string,
  limit = 50,
): Promise<UserSession[]> {
  const searchTerm = `%${searchQuery.toLowerCase()}%`

  const { data, error } = await db
    .from('user_sessions')
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        email,
        avatar_url
      )
    `,
    )
    .or(`profiles.email.ilike.${searchTerm},profiles.full_name.ilike.${searchTerm}`)
    .order('started_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data || []) as UserSession[]
}
