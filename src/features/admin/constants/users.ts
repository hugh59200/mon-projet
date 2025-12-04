import type { Role } from '@/supabase/types/supabase.types'

/** Type d'une option de rôle */
export type RoleOption = { id: Role; label: string }

/** 🧑‍💼 Liste des rôles disponibles */
export const ROLES: RoleOption[] = [
  { id: 'user', label: 'Utilisateur' },
  { id: 'admin', label: 'Administrateur' },
]

/** 🧮 Filtres de rôles (inclut "Tous") */
export const ROLE_FILTERS: ({ id: 'all'; label: string } | RoleOption)[] = [
  { id: 'all', label: 'Tous' },
  ...ROLES,
]
