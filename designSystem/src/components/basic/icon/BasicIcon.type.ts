import type { IconName } from '@designSystem/fondation/icons/iconsList'

export type IconColor =
  | 'white'
  | 'black'
  | `neutral-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`
  | `primary-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`
  | `secondary-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000}`
  | `pink-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`
  | `danger-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`
  | `success-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`
  | `warning-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`
  | `info-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`

export type IconProps = {
  name: IconName
  active?: boolean
  focusable?: boolean
  pointer?: boolean
  disabled?: boolean
  color?: IconColor
}
