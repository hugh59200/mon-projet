export type BadgeType = 'default' | 'pending' | 'error' | 'success' | 'info' | 'canceled'
export type BadgeSize = 'medium' | 'small'

export type BadgeProps = {
  label: string
  type?: BadgeType
  size?: BadgeSize
  deletable?: boolean
  nbMaxLines?: '1' | '2' | '3'
}

export const badgeTypes: BadgeType[] = ['default', 'pending', 'error', 'success', 'info', 'canceled']
