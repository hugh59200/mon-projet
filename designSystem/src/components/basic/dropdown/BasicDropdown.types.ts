import type { IconName } from '@designSystem/fondation/icons/iconsList'
import type { AlertInputProps } from '../alert'

export type DropdownSize = 'small' | 'medium' | 'large'
export type DropdownType = 'form' | 'table'

export type DropdownId = number | string | boolean | undefined

export type DropdownItem<T = DropdownId> = {
  id: T
  label: string
  iconName?: IconName | undefined
}

export type DropdownProps<T = DropdownItem<DropdownId>> = {
  items?: T[]
  placeholder?: string
  selectedLabel?: string
  searchable?: boolean
  forceValue?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: DropdownSize
  deletable?: boolean
  keyId?: keyof T
  keyLabel?: keyof T
  keyIconName?: keyof T
  dropdownType?: DropdownType
} & AlertInputProps

export const dropdownSizes: DropdownSize[] = ['small', 'medium', 'large']
