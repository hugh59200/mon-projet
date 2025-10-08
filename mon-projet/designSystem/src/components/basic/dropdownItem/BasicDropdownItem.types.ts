import type { IconName } from '@designSystem/fondation/icons/iconsList'

export type DropdownItemSize = 'small' | 'medium' | 'large'

export type DropdownItemProps = {
  label: string
  iconName?: IconName
  size?: DropdownItemSize
  active?: boolean
  highlighted?: boolean
}
