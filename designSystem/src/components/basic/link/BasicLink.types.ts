import type { IconName } from '@designSystem/fondation/icons/iconsList'

export type LinkType = 'primary' | 'secondary' | 'light' | 'dark'
export type LinkSize = 'large' | 'medium' | 'small'
export type LinkState = 'icon-left' | 'icon-right' | 'text-only'

export type StandaloneLinkProps = {
  label: string
  state?: LinkState
  type?: LinkType
  size?: LinkSize
  iconName?: IconName | undefined
  disabled?: boolean
  wrapLink?: boolean
  wrapAll?: boolean
  nbMaxLines?: '1' | '2' | '3'
}

export const linkTypes: LinkType[] = ['primary', 'secondary', 'light', 'dark']
export const linkSizes: LinkSize[] = ['large', 'medium', 'small']
export const linkStates: LinkState[] = ['icon-left', 'icon-right', 'text-only']
