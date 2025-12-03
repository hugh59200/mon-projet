import type { WrapperFormElementProps } from '@designSystem/components'
import type { PremiumButtonType } from '@designSystem/components/basic/button/PremiumButton.types'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'

export type WrapperButtonProps = WrapperFormElementProps & {
  type?: PremiumButtonType
  size?: 'large' | 'medium' | 'small'
  buttonLabel?: string
  iconName?: IconNameNext
  disabled?: boolean
  active?: boolean
  width?: 'auto' | 'full'
}
