import type { DropdownItem, DropdownProps, WrapperFormElementProps } from '@designSystem/components'

export type WrapperDropdownProps<T = DropdownItem> = WrapperFormElementProps &
  DropdownProps<T extends DropdownItem ? T : DropdownItem>
