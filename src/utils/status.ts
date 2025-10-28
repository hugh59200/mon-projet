// src/utils/status.ts

/**
 * Mapping des statuts → classes CSS (ou Tailwind)
 * Chaque statut a sa couleur principale et son style
 */
export const statusColors: Record<string, string> = {
  pending: 'status--pending',
  confirmed: 'status--confirmed',
  shipped: 'status--shipped',
  completed: 'status--completed',
  canceled: 'status--canceled',
}

/**
 * Retourne la classe CSS associée à un statut
 * Ex: getStatusClass('pending') → "status--pending"
 */
export function getStatusClass(status: string): string {
  return statusColors[status] || ''
}

/**
 * (Optionnel) Retourne le label lisible pour un statut
 * → utile pour affichage localisé ou UI (badge, tooltip…)
 */
export const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  completed: 'Terminée',
  canceled: 'Annulée',
}

export function getStatusLabel(status: string): string {
  return statusLabels[status] || status
}
