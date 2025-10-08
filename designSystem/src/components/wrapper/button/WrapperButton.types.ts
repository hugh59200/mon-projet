import type { ButtonProps, WrapperFormElementProps } from '@designSystem/components'

export type WrapperButtonProps = WrapperFormElementProps &
  ButtonProps & {
    buttonLabel?: string
  }
