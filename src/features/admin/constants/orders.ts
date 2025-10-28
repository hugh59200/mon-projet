import type { Tables } from '@/supabase/types/supabase'
import type { OrderStatus } from '@/supabase/types/supabase.types'

export type StatusOption = { id: OrderStatus; label: string }
export type SortOption = { id: keyof Tables<'orders'> & string; label: string }

// 🟡 STATUTS DE COMMANDE (typés)
export const STATUSES: StatusOption[] = [
  { id: 'pending', label: 'En attente' },
  { id: 'confirmed', label: 'Confirmée' },
  { id: 'shipped', label: 'Expédiée' },
  { id: 'completed', label: 'Terminée' },
  { id: 'canceled', label: 'Annulée' },
]

// 🧮 FILTRES DE STATUT
export const STATUS_FILTERS: ({ id: 'all'; label: string } | StatusOption)[] = [
  { id: 'all', label: 'Tous' },
  ...STATUSES,
]

// 📊 OPTIONS DE TRI
export const SORT_OPTIONS: SortOption[] = [
  { id: 'created_at', label: 'Date' },
  { id: 'full_name', label: 'Client' },
  { id: 'total_amount', label: 'Montant' },
  { id: 'status', label: 'Statut' },
]
