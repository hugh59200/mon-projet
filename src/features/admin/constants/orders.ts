export const STATUSES = [
  { id: 'pending', label: 'En attente' },
  { id: 'confirmed', label: 'Confirmée' },
  { id: 'shipped', label: 'Expédiée' },
  { id: 'completed', label: 'Terminée' },
  { id: 'canceled', label: 'Annulée' },
]
export const STATUS_FILTERS = [{ id: 'all', label: 'Tous' }, ...STATUSES]
export const SORT_OPTIONS = [
  { id: 'created_at', label: 'Date' },
  { id: 'full_name', label: 'Client' },
  { id: 'total_amount', label: 'Montant' },
  { id: 'status', label: 'Statut' },
]
