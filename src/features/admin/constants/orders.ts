import type { Tables } from '@/supabase/types/supabase'
import type { OrderStatus } from '@/supabase/types/supabase.types'

export type SortOption = { id: keyof Tables<'orders'> & string; label: string }

export type StatusOption = {
  id: OrderStatus
  label: string
  value: OrderStatus // ✅ obligatoire (plus "optionnel")
}

// 🟡 STATUTS DE COMMANDE (typés)
export const STATUSES: readonly StatusOption[] = [
  { id: 'pending', label: 'En attente', value: 'pending' },
  { id: 'confirmed', label: 'Confirmée', value: 'confirmed' },
  { id: 'shipped', label: 'Expédiée', value: 'shipped' },
  { id: 'completed', label: 'Terminée', value: 'completed' },
  { id: 'canceled', label: 'Annulée', value: 'canceled' },
] as const

// 🧮 FILTRES DE STATUT
export const STATUS_FILTERS: readonly ({ id: 'all'; label: string } | StatusOption)[] = [
  { id: 'all', label: 'Tous' },
  ...STATUSES,
] as const

// 📊 OPTIONS DE TRI
export const SORT_OPTIONS: readonly SortOption[] = [
  { id: 'created_at', label: 'Date' },
  { id: 'full_name', label: 'Client' },
  { id: 'total_amount', label: 'Montant' },
  { id: 'status', label: 'Statut' },
] as const
