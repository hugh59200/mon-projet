import type { DropdownItem, DropdownId, DropdownProps, WrapperFormElementProps } from '@designSystem/components'

export type WrapperDropdownProps<T = DropdownItem<DropdownId>> = WrapperFormElementProps & DropdownProps<T>
