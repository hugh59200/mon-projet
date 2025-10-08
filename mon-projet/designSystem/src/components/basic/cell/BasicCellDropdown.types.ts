import type { DropdownItem, DropdownId, DropdownSize } from '../dropdown'

export type BasicCellDropdownProps = {
  items: DropdownItem[]
  modelValue: DropdownId
  disabled?: boolean
  forceValue?: boolean
  placeholder?: string
  size?: DropdownSize
  span?: number
  extraClass?: string | string[]
  inline?: boolean
}
