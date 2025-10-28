export const SORT_OPTIONS = [
  { id: 'created_at', label: 'Date de création' },
  { id: 'email', label: 'Email' },
  { id: 'full_name', label: 'Nom' },
  { id: 'role', label: 'Rôle' },
  { id: 'id', label: 'ID utilisateur' },
]

export const ROLES = [
  { id: 'user', label: 'Utilisateur' },
  { id: 'admin', label: 'Administrateur' },
]
export const ROLE_FILTERS = [{ id: 'all', label: 'Tous' }, ...ROLES]
