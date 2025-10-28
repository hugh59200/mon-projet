import type { IconName } from '@designSystem/fondation/icons/iconsList'

export type IconColor =
  | 'primary-600'
  | 'primary-400'
  | 'pink-400'
  | 'secondary-800'
  | 'secondary-1000'
  | 'grey-800'

export type IconProps = {
  name: IconName
  active?: boolean
  focusable?: boolean
  pointer?: boolean
  disabled?: boolean
  color?: IconColor
}
