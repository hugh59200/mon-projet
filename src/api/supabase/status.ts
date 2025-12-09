/**
 * API pour récupérer les indicateurs de statut du site
 * Affiche l'état des commandes, expéditions et support en temps réel
 */
import { supabaseSilent as supabase } from '@/supabase/supabaseClient'

export type SystemStatusLevel = 'operational' | 'degraded' | 'down'

export type SystemStatusIndicator = {
  id: string
  label: string
  status: SystemStatusLevel
  detail: string
  lastUpdate?: string
}

export type SystemStatus = {
  orders: SystemStatusIndicator
  shipping: SystemStatusIndicator
  support: SystemStatusIndicator
  lastChecked: string
}

/**
 * Récupère la dernière commande expédiée (shipped_at le plus récent)
 */
async function getLastShippedOrder(): Promise<{ shipped_at: string } | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('shipped_at')
    .eq('status', 'shipped')
    .not('shipped_at', 'is', null)
    .order('shipped_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[status] Error fetching last shipped order:', error)
    return null
  }
  // shipped_at est garanti non-null grâce au filtre .not('shipped_at', 'is', null)
  return data as { shipped_at: string } | null
}

/**
 * Vérifie si le support est actif (messages admin dans les 48h)
 */
async function getSupportActivity(): Promise<{ lastAdminResponse: string | null }> {
  const since48h = new Date()
  since48h.setHours(since48h.getHours() - 48)

  const { data, error } = await supabase
    .from('messages')
    .select('created_at')
    .eq('sender_role', 'admin')
    .gte('created_at', since48h.toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[status] Error fetching support activity:', error)
    return { lastAdminResponse: null }
  }

  return { lastAdminResponse: data?.created_at || null }
}

/**
 * Formate la date de dernière expédition en texte lisible
 */
function formatShippingDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const hours = date.getHours()
    return `Aujourd'hui ${hours}h`
  } else if (diffDays === 1) {
    return 'Hier'
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jours`
  } else {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }
}

/**
 * Récupère le statut complet du système
 */
export async function fetchSystemStatus(): Promise<SystemStatus> {
  const [lastShipped, supportActivity] = await Promise.all([
    getLastShippedOrder(),
    getSupportActivity(),
  ])

  // Indicateur Commandes - toujours opérationnel si le site fonctionne
  const ordersIndicator: SystemStatusIndicator = {
    id: 'orders',
    label: 'Commandes',
    status: 'operational',
    detail: 'Ouvertes',
  }

  // Indicateur Expéditions
  let shippingStatus: SystemStatusLevel = 'operational'
  let shippingDetail = 'Normales'

  if (lastShipped?.shipped_at) {
    const daysSinceShipped = Math.floor(
      (Date.now() - new Date(lastShipped.shipped_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceShipped > 5) {
      shippingStatus = 'degraded'
      shippingDetail = 'Retard possible'
    }
    shippingDetail += ` (Dernier départ : ${formatShippingDate(lastShipped.shipped_at)})`
  } else {
    // Pas de commande expédiée récemment
    shippingStatus = 'operational'
    shippingDetail = 'En attente de commandes'
  }

  const shippingIndicator: SystemStatusIndicator = {
    id: 'shipping',
    label: 'Expéditions',
    status: shippingStatus,
    detail: shippingDetail,
    lastUpdate: lastShipped?.shipped_at,
  }

  // Indicateur Support
  const supportStatus: SystemStatusLevel = 'operational'
  let supportDetail = 'Actif'

  if (!supportActivity.lastAdminResponse) {
    supportDetail = 'Disponible'
  }

  const supportIndicator: SystemStatusIndicator = {
    id: 'support',
    label: 'Support',
    status: supportStatus,
    detail: supportDetail,
    lastUpdate: supportActivity.lastAdminResponse || undefined,
  }

  return {
    orders: ordersIndicator,
    shipping: shippingIndicator,
    support: supportIndicator,
    lastChecked: new Date().toISOString(),
  }
}
