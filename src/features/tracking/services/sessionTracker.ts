import { trackSession, updateSessionActivity, endSession } from '@/api/supabase/sessions'
import type { TrackSessionParams } from '@/api/supabase/sessions'

// ============================================================
// Session Tracker Service
// ============================================================
// Service singleton pour tracker les sessions utilisateurs
// Gère automatiquement les visiteurs anonymes et authentifiés
// ============================================================

const SESSION_STORAGE_KEY = 'fp_session_id'
const SESSION_EXPIRY_KEY = 'fp_session_expiry'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24h en ms

// État local du tracker
let currentSessionId: string | null = null
let pagesViewed = 1
let isInitialized = false

// ============================================================
// Helpers
// ============================================================

/**
 * Génère un UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Détecte le type d'appareil
 */
function detectDeviceType(): 'desktop' | 'tablet' | 'mobile' | 'unknown' {
  const ua = navigator.userAgent.toLowerCase()

  // Mobile patterns
  if (/android.*mobile|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)) {
    return 'mobile'
  }

  // Tablet patterns
  if (/ipad|android(?!.*mobile)|tablet/i.test(ua)) {
    return 'tablet'
  }

  // Desktop par défaut
  if (typeof window !== 'undefined') {
    return 'desktop'
  }

  return 'unknown'
}

/**
 * Détecte le navigateur
 */
function detectBrowser(): string {
  const ua = navigator.userAgent

  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'

  return 'Unknown'
}

/**
 * Détecte l'OS
 */
function detectOS(): string {
  const ua = navigator.userAgent

  if (ua.includes('Win')) return 'Windows'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'

  return 'Unknown'
}

/**
 * Récupère ou crée un session ID
 */
function getOrCreateSessionId(): string {
  // Vérifie si une session existe et n'a pas expiré
  const storedId = sessionStorage.getItem(SESSION_STORAGE_KEY)
  const expiry = sessionStorage.getItem(SESSION_EXPIRY_KEY)

  if (storedId && expiry && Date.now() < parseInt(expiry)) {
    return storedId
  }

  // Crée une nouvelle session
  const newId = generateUUID()
  sessionStorage.setItem(SESSION_STORAGE_KEY, newId)
  sessionStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION))

  return newId
}

/**
 * Récupère les données de géolocalisation via API externe
 */
async function fetchGeoData(): Promise<{
  country?: string
  country_code?: string
  city?: string
  region?: string
  ip?: string
} | null> {
  try {
    // API gratuite de géolocalisation (limite : 45 req/min)
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000), // Timeout 3s
    })

    if (!response.ok) return null

    const data = await response.json()

    return {
      country: data.country_name,
      country_code: data.country_code,
      city: data.city,
      region: data.region,
      ip: data.ip,
    }
  } catch {
    // Silently fail - geo is optional
    return null
  }
}

// ============================================================
// Public API
// ============================================================

/**
 * Initialise le tracking de session
 * À appeler au démarrage de l'app (main.ts ou App.vue)
 */
export async function initSessionTracking(userId?: string | null): Promise<string> {
  if (isInitialized && currentSessionId) {
    // Si déjà initialisé et l'utilisateur change, mettre à jour
    if (userId) {
      await updateSessionUser(userId)
    }
    return currentSessionId
  }

  currentSessionId = getOrCreateSessionId()

  // Collecte des données de session
  const geoData = await fetchGeoData()

  const params: TrackSessionParams = {
    session_id: currentSessionId,
    user_id: userId || null,
    session_type: userId ? 'authenticated' : 'anonymous',
    user_agent: navigator.userAgent,
    ip_address: geoData?.ip || null,
    device_type: detectDeviceType(),
    browser: detectBrowser(),
    os: detectOS(),
    country: geoData?.country || null,
    country_code: geoData?.country_code || null,
    city: geoData?.city || null,
    region: geoData?.region || null,
    landing_page: window.location.pathname,
    referrer: document.referrer || null,
  }

  try {
    await trackSession(params)
    isInitialized = true
  } catch (error) {
    console.warn('[SessionTracker] Failed to track session:', error)
  }

  // Listener pour fermeture de page
  window.addEventListener('beforeunload', handleBeforeUnload)

  // Listener pour visibilité (onglet caché/visible)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  return currentSessionId
}

/**
 * Met à jour l'utilisateur de la session (après login)
 */
export async function updateSessionUser(userId: string): Promise<void> {
  if (!currentSessionId) {
    await initSessionTracking(userId)
    return
  }

  try {
    await trackSession({
      session_id: currentSessionId,
      user_id: userId,
      session_type: 'authenticated',
    })
  } catch (error) {
    console.warn('[SessionTracker] Failed to update session user:', error)
  }
}

/**
 * Enregistre une navigation de page
 */
export async function trackPageView(_path?: string): Promise<void> {
  if (!currentSessionId) return

  pagesViewed++

  try {
    await updateSessionActivity(currentSessionId, {
      pages_viewed: pagesViewed,
    })
  } catch (error) {
    console.warn('[SessionTracker] Failed to track page view:', error)
  }
}

/**
 * Enregistre un ajout au panier
 */
export async function trackAddToCart(): Promise<void> {
  if (!currentSessionId) return

  try {
    await updateSessionActivity(currentSessionId, {
      added_to_cart: true,
    })
  } catch (error) {
    console.warn('[SessionTracker] Failed to track add to cart:', error)
  }
}

/**
 * Enregistre le début du checkout
 */
export async function trackCheckoutStart(): Promise<void> {
  if (!currentSessionId) return

  try {
    await updateSessionActivity(currentSessionId, {
      started_checkout: true,
    })
  } catch (error) {
    console.warn('[SessionTracker] Failed to track checkout start:', error)
  }
}

/**
 * Enregistre une commande complétée
 */
export async function trackOrderComplete(): Promise<void> {
  if (!currentSessionId) return

  try {
    await updateSessionActivity(currentSessionId, {
      completed_order: true,
    })
  } catch (error) {
    console.warn('[SessionTracker] Failed to track order complete:', error)
  }
}

/**
 * Termine la session manuellement
 */
export async function terminateSession(): Promise<void> {
  if (!currentSessionId) return

  try {
    await endSession(currentSessionId)
  } catch (error) {
    console.warn('[SessionTracker] Failed to end session:', error)
  } finally {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    sessionStorage.removeItem(SESSION_EXPIRY_KEY)
    currentSessionId = null
    isInitialized = false
  }
}

/**
 * Récupère l'ID de session actuel
 */
export function getCurrentSessionId(): string | null {
  return currentSessionId
}

// ============================================================
// Event Handlers
// ============================================================

function handleBeforeUnload(): void {
  // Utilise sendBeacon pour envoyer même si la page se ferme
  if (currentSessionId) {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/end_session`
    const data = JSON.stringify({ p_session_id: currentSessionId })

    navigator.sendBeacon(
      url,
      new Blob([data], { type: 'application/json' }),
    )
  }
}

function handleVisibilityChange(): void {
  if (document.visibilityState === 'hidden' && currentSessionId) {
    // L'utilisateur a changé d'onglet - on peut mettre à jour last_activity
    updateSessionActivity(currentSessionId).catch(() => {
      // Silently fail
    })
  }
}
