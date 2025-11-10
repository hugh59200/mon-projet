import type { Orders } from '@/supabase/types/supabase.types'

export type SortOption = { id: keyof Orders & string; label: string }

export const SORT_OPTIONS: readonly SortOption[] = [
  { id: 'created_at', label: 'Date' },
  { id: 'full_name', label: 'Client' },
  { id: 'total_amount', label: 'Montant' },
  { id: 'status', label: 'Statut' },
] as const
