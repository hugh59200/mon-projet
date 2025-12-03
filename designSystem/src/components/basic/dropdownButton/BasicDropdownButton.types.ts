import type { NestedKeyOf } from '@/features/shared/types/NestedKeyOf'
import type { PremiumButtonType } from '@designSystem/components/basic/button/PremiumButton.types'

export type DropdownButtonItem<T = string | number | null> = {
  id: T
  label: string
}

export type DropdownButtonProps<T extends object = object> = {
  items: T[]
  keyId?: NestedKeyOf<T>
  keyLabel?: NestedKeyOf<T>
  type?: PremiumButtonType
  size?: 'large' | 'medium' | 'small'
  label?: string
  disabled?: boolean
  active?: boolean
  iconRight?: boolean
}

