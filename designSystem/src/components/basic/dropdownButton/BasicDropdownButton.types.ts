import type { NestedKeyOf } from '@/features/shared/types/NestedKeyOf'
import type { ButtonProps } from '@designSystem/components'

export type DropdownButtonItem<T = string | number | null> = {
  id: T
  label: string
}

export type DropdownButtonProps<T extends object = object> = {
  items: T[]
  keyId?: NestedKeyOf<T>
  keyLabel?: NestedKeyOf<T>
} & ButtonProps

