import type { Enums } from '@/supabase/types/supabase'
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
