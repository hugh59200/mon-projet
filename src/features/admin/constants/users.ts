import type { Role } from '@/supabase/types/supabase.types'

export const ROLES: { id: Role; label: string }[] = [
  { id: 'user', label: 'Utilisateur' },
  { id: 'admin', label: 'Administrateur' },
]

export const ROLE_FILTERS = [{ id: 'all', label: 'Tous' }, ...ROLES]
