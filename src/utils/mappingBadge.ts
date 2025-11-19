import type { Enums } from '@/supabase/types/supabase'
import type { Role } from '@/supabase/types/supabase.types'
import type { BadgeType } from '@designSystem/index'

/* -------------------------------------------------------------------------- */
/* 🧩 TYPES DE BASE                                                           */
/* -------------------------------------------------------------------------- */

export type OrderStatus = Enums<'order_status'>
export type EmailStatus = 'sent' | 'pending' | 'error' | null
export type StockStatus = 'in_stock' | 'out_of_stock'

// ✅ Ajout de 'number' pour gérer le stock V2.0
export type AnyStatus =
  | OrderStatus
  | EmailStatus
  | Role
  | StockStatus
  | string
  | number
  | boolean
  | null

/* -------------------------------------------------------------------------- */
/* 🧱 MAPPINGS LABELS                                                         */
/* -------------------------------------------------------------------------- */

export const ORDER_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  processing: 'Préparation',
  paid: 'Payée',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  completed: 'Terminée',
  canceled: 'Annulée',
  refunded: 'Remboursée',
  failed: 'Échouée',
}

export const EMAIL_LABELS = {
  sent: 'Envoyé',
  error: 'Erreur',
  custom: 'Message',
  payment: 'Paiement',
  shipping: 'Expédition',
  status_update: 'Mise à jour du statut',
  confirmation: 'Confirmation',
  cancelation: 'Annulation',
} as const

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrateur',
  user: 'Utilisateur',
}

export const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: 'En stock',
  out_of_stock: 'Rupture',
}

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
 * Retourne le label textuel d’un statut
 */
export const getLabelBadge = (rawValue?: AnyStatus): string => {
  const value = normalizeStatus(rawValue)
  if (!value) return '—'

  return (
    ORDER_LABELS[value as OrderStatus] ??
    EMAIL_LABELS[value as keyof typeof EMAIL_LABELS] ??
    ROLE_LABELS[value as Role] ??
    STOCK_LABELS[value as StockStatus] ??
    value // Fallback si c'est du texte brut
  )
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

export const STATUSES = (Object.keys(ORDER_LABELS) as OrderStatus[]).map((id) => ({
  id,
  value: id,
  label: ORDER_LABELS[id],
}))
