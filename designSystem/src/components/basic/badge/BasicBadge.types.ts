export type BadgeType = 'default' | 'pending' | 'error' | 'success' | 'info' | 'canceled' | 'warning' | 'secondary'
export type BadgeSize = 'medium' | 'small'

/** Couleurs disponibles pour les badges colorés (tags) */
export type BadgeColor =
  | 'primary'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'cyan'

export type BadgeProps = {
  label?: string
  type?: BadgeType
  size?: BadgeSize
  deletable?: boolean
  nbMaxLines?: '1' | '2' | '3'
  /** Couleur personnalisée (pour les tags) - override type si défini */
  color?: BadgeColor
  /** État sélectionné (rend la couleur plus intense) */
  selected?: boolean
}

export const badgeTypes: BadgeType[] = ['default', 'pending', 'error', 'success', 'info', 'canceled']

export const badgeColors: BadgeColor[] = [
  'primary',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'cyan',
]
