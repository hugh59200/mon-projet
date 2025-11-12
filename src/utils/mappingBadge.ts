import type { Enums } from '@/supabase/types/supabase'
import type { Role } from '@/supabase/types/supabase.types'
import type { BadgeType } from '@designSystem/index'

export type OrderStatus = Enums<'order_status'>
export type EmailStatus = 'sent' | 'pending' | 'error' | null
export type AnyStatus = OrderStatus | EmailStatus | string | null

const ORDER_LABELS: Record<OrderStatus, string> = {
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

const EMAIL_LABELS = {
  sent: 'Envoyé',
  error: 'Erreur',
  custom: 'Message',
  payment: 'Paiement',
  shipping: 'Expédition',
  status_update: 'Mise à jour du statut',
  confirmation: 'Confirmation',
  cancelation: 'Annulation',
} as const

export const getLabel = (v?: AnyStatus) =>
  ORDER_LABELS[v as OrderStatus] || EMAIL_LABELS[v as keyof typeof EMAIL_LABELS] || '—'

const BADGES: Record<OrderStatus | 'sent' | 'error', BadgeType> = {
  pending: 'pending',
  processing: 'info',
  shipped: 'info',
  paid: 'success',
  confirmed: 'success',
  completed: 'success',
  refunded: 'info',
  canceled: 'canceled',
  failed: 'error',
  sent: 'success',
  error: 'error',
}

export const getBadge = (v?: AnyStatus): BadgeType => BADGES[v as keyof typeof BADGES] ?? 'default'

export const STATUSES = (Object.keys(ORDER_LABELS) as OrderStatus[]).map((id) => ({
  id,
  value: id,
  label: ORDER_LABELS[id],
}))

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrateur',
  user: 'Utilisateur',
}

export const ROLE_BADGES: Record<Role, BadgeType> = {
  admin: 'info',
  user: 'default',
}

export const getRoleLabel = (r?: Role): string => (r ? (ROLE_LABELS[r] ?? '—') : '—')

export const getRoleBadge = (r?: Role): BadgeType => (r ? (ROLE_BADGES[r] ?? 'default') : 'default')

export type StockStatus = 'in_stock' | 'out_of_stock'

export const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: 'En stock',
  out_of_stock: 'Rupture',
}

export const STOCK_BADGES: Record<StockStatus, BadgeType> = {
  in_stock: 'success',
  out_of_stock: 'error',
}

export const getStockLabel = (v?: boolean | number | null): string => {
  if (v === true || (typeof v === 'number' && v > 0)) return STOCK_LABELS.in_stock
  if (v === false || (typeof v === 'number' && v <= 0)) return STOCK_LABELS.out_of_stock
  return '—'
}

export const getStockBadge = (v?: boolean | number | null): BadgeType => {
  if (v === true || (typeof v === 'number' && v > 0)) return STOCK_BADGES.in_stock
  if (v === false || (typeof v === 'number' && v <= 0)) return STOCK_BADGES.out_of_stock
  return 'default'
}
