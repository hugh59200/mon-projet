import type { Enums } from '@/supabase/types/supabase'
import type { Role } from '@/supabase/types/supabase.types'
import type { BadgeType } from '@designSystem/index'
import i18n from '@/i18n'

/* -------------------------------------------------------------------------- */
/* 🧩 TYPES DE BASE                                                           */
/* -------------------------------------------------------------------------- */

export type OrderStatus = Enums<'order_status'>
export type EmailStatus = 'sent' | 'pending' | 'error' | null
export type EmailType = 'custom' | 'payment' | 'shipping' | 'status_update' | 'confirmation' | 'cancelation'
export type StockStatus = 'in_stock' | 'out_of_stock'

// ✅ Ajout de 'number' pour gérer le stock V2.0
export type AnyStatus =
  | OrderStatus
  | EmailStatus
  | EmailType
  | Role
  | StockStatus
  | string
  | number
  | boolean
  | null

/* -------------------------------------------------------------------------- */
/* 🧱 MAPPINGS LABELS (via i18n)                                              */
/* -------------------------------------------------------------------------- */

// Clés de traduction pour les status de commande
const ORDER_STATUS_KEYS: Record<OrderStatus, string> = {
  pending: 'orders.statuses.pending',
  processing: 'orders.statuses.processing',
  paid: 'orders.statuses.paid',
  confirmed: 'orders.statuses.confirmed',
  shipped: 'orders.statuses.shipped',
  completed: 'orders.statuses.completed',
  canceled: 'orders.statuses.canceled',
  refunded: 'orders.statuses.refunded',
  failed: 'orders.statuses.failed',
}

// Clés de traduction pour les status d'email
const EMAIL_STATUS_KEYS: Record<'sent' | 'pending' | 'error', string> = {
  sent: 'orders.emailStatuses.sent',
  pending: 'orders.emailStatuses.pending',
  error: 'orders.emailStatuses.error',
}

// Clés de traduction pour les types d'email
const EMAIL_TYPE_KEYS: Record<EmailType, string> = {
  custom: 'orders.emailTypes.custom',
  payment: 'orders.emailTypes.payment',
  shipping: 'orders.emailTypes.shipping',
  status_update: 'orders.emailTypes.status_update',
  confirmation: 'orders.emailTypes.confirmation',
  cancelation: 'orders.emailTypes.cancelation',
}

// Clés de traduction pour les rôles
const ROLE_KEYS: Record<Role, string> = {
  admin: 'orders.roles.admin',
  user: 'orders.roles.user',
}

// Clés de traduction pour le stock
const STOCK_KEYS: Record<StockStatus, string> = {
  in_stock: 'orders.stockStatuses.in_stock',
  out_of_stock: 'orders.stockStatuses.out_of_stock',
}

// Helper pour obtenir la traduction
const t = (key: string): string => {
  return i18n.global.t(key)
}

// Getters dynamiques pour les labels traduits
export const getOrderLabel = (status: OrderStatus): string => t(ORDER_STATUS_KEYS[status])
export const getEmailStatusLabel = (status: 'sent' | 'pending' | 'error'): string => t(EMAIL_STATUS_KEYS[status])
export const getEmailTypeLabel = (type: EmailType): string => t(EMAIL_TYPE_KEYS[type])
export const getRoleLabel = (role: Role): string => t(ROLE_KEYS[role])
export const getStockLabel = (status: StockStatus): string => t(STOCK_KEYS[status])

/* -------------------------------------------------------------------------- */
/* 🎨 MAPPINGS BADGES                                                        */
/* -------------------------------------------------------------------------- */

export const ORDER_BADGES: Record<OrderStatus, BadgeType> = {
  pending: 'pending',
  processing: 'info',
  paid: 'success',
  confirmed: 'success',
  shipped: 'info',
  completed: 'success',
  refunded: 'info',
  canceled: 'canceled',
  failed: 'error',
}

export const EMAIL_BADGES: Record<'sent' | 'error', BadgeType> = {
  sent: 'success',
  error: 'error',
}

export const ROLE_BADGES: Record<Role, BadgeType> = {
  admin: 'info',
  user: 'default',
}

export const STOCK_BADGES: Record<StockStatus, BadgeType> = {
  in_stock: 'success',
  out_of_stock: 'error',
}

/* -------------------------------------------------------------------------- */
/* ⚙️ LOGIQUE DE CONVERSION (CORE V2)                                         */
/* -------------------------------------------------------------------------- */

/**
 * Convertit une valeur brute (booléen, nombre, string) en clé de statut connue
 */
const normalizeStatus = (value: AnyStatus | undefined): string | null => {
  if (value === null || value === undefined) return null

  // ✅ Gestion Stock V2 (Integer)
  if (typeof value === 'number') {
    return value > 0 ? 'in_stock' : 'out_of_stock'
  }

  // ✅ Gestion Legacy (Boolean)
  if (typeof value === 'boolean') {
    return value ? 'in_stock' : 'out_of_stock'
  }

  return value as string
}

/**
 * Retourne le label textuel d'un statut (traduit via i18n)
 */
export const getLabelBadge = (rawValue?: AnyStatus): string => {
  const value = normalizeStatus(rawValue)
  if (!value) return '—'

  // Order status
  if (value in ORDER_STATUS_KEYS) {
    return t(ORDER_STATUS_KEYS[value as OrderStatus])
  }

  // Email status
  if (value in EMAIL_STATUS_KEYS) {
    return t(EMAIL_STATUS_KEYS[value as 'sent' | 'pending' | 'error'])
  }

  // Email type
  if (value in EMAIL_TYPE_KEYS) {
    return t(EMAIL_TYPE_KEYS[value as EmailType])
  }

  // Role
  if (value in ROLE_KEYS) {
    return t(ROLE_KEYS[value as Role])
  }

  // Stock
  if (value in STOCK_KEYS) {
    return t(STOCK_KEYS[value as StockStatus])
  }

  return value // Fallback si c'est du texte brut
}

/**
 * Retourne le type de badge (couleur)
 */
export const getTypeBadge = (rawValue?: AnyStatus): BadgeType => {
  const value = normalizeStatus(rawValue)
  if (!value) return 'default'

  return (
    ORDER_BADGES[value as OrderStatus] ??
    EMAIL_BADGES[value as keyof typeof EMAIL_BADGES] ??
    ROLE_BADGES[value as Role] ??
    STOCK_BADGES[value as StockStatus] ??
    'default'
  )
}

/* -------------------------------------------------------------------------- */
/* 📦 EXPORT LISTES                                                           */
/* -------------------------------------------------------------------------- */

// Liste des status de commande (avec labels traduits dynamiquement)
export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'paid',
  'confirmed',
  'processing',
  'shipped',
  'completed',
  'canceled',
  'refunded',
  'failed',
]

// Fonction pour générer la liste des status avec labels traduits
export const getStatusOptions = () =>
  ORDER_STATUSES.map((id) => ({
    id,
    value: id,
    label: t(ORDER_STATUS_KEYS[id]),
  }))

// Export pour rétrocompatibilité (⚠️ les labels sont traduits dynamiquement)
export const STATUSES = getStatusOptions()
