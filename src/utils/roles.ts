// src/utils/roles.ts

/** 🎨 Couleurs associées à chaque rôle */
export const roleColors: Record<string, string> = {
  admin: 'role--admin',
  user: 'role--user',
  manager: 'role--manager',
}

/** 🧱 Labels lisibles */
export const roleLabels: Record<string, string> = {
  admin: 'Administrateur',
  user: 'Utilisateur',
  manager: 'Gestionnaire',
}

/** 🔁 Retourne la classe CSS pour un rôle */
export function getRoleClass(role: string): string {
  return roleColors[role] || ''
}

/** 🗂️ Retourne le label lisible pour un rôle */
export function getRoleLabel(role: string): string {
  return roleLabels[role] || role
}
