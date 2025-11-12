import type { Enums } from '@/supabase/types/supabase'
import type { Role } from '@/supabase/types/supabase.types'
import type { BadgeType } from '@designSystem/index'

/* -------------------------------------------------------------------------- */
/* 🧩 TYPES DE BASE                                                           */
/* -------------------------------------------------------------------------- */

export type OrderStatus = Enums<'order_status'>
export type EmailStatus = 'sent' | 'pending' | 'error' | null
export type StockStatus = 'in_stock' | 'out_of_stock'
export type AnyStatus = OrderStatus | EmailStatus | Role | StockStatus | string | null

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

/**
 * Retourne le label textuel d’un statut, quel que soit son domaine.
 */
export const getLabelBadge = (value?: AnyStatus | boolean | null): string => {
  if (typeof value === 'boolean') {
    value = value ? 'in_stock' : 'out_of_stock'
  }

  return (
    (value &&
      (ORDER_LABELS[value as keyof typeof ORDER_LABELS] ??
        EMAIL_LABELS[value as keyof typeof EMAIL_LABELS] ??
        ROLE_LABELS[value as keyof typeof ROLE_LABELS] ??
        STOCK_LABELS[value as keyof typeof STOCK_LABELS])) ||
    '—'
  )
}

/**
 * Retourne le type de badge (`success`, `info`, `error`, etc.) associé à un statut.
 */
export const getTypeBadge = (value?: AnyStatus | boolean | null): BadgeType => {
  if (typeof value === 'boolean') {
    value = value ? 'in_stock' : 'out_of_stock'
  }

  return (
    (value &&
      (ORDER_BADGES[value as keyof typeof ORDER_BADGES] ??
        EMAIL_BADGES[value as keyof typeof EMAIL_BADGES] ??
        ROLE_BADGES[value as keyof typeof ROLE_BADGES] ??
        STOCK_BADGES[value as keyof typeof STOCK_BADGES])) ||
    'default'
  )
}

/* -------------------------------------------------------------------------- */
/* 📦 EXPORT SUPPLÉMENTAIRE (utile pour les listes)                           */
/* -------------------------------------------------------------------------- */

export const STATUSES = (Object.keys(ORDER_LABELS) as OrderStatus[]).map((id) => ({
  id,
  value: id,
  label: ORDER_LABELS[id],
}))
