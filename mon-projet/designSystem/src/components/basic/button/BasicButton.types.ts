import type { IconName } from '@designSystem/fondation/icons/iconsList'

export type ButtonType = 'primary' | 'reverse' | 'secondary' | 'danger'
export type ButtonSize = 'large' | 'medium' | 'small'
export type ButtonVariant = 'filled' | 'outlined' | 'ghost'

export type ButtonProps = {
  type?: ButtonType
  size?: ButtonSize
  variant?: ButtonVariant
  label?: string
  iconName?: IconName | undefined
  iconRight?: boolean
  disabled?: boolean
  active?: boolean
  width?: 'auto' | 'full'
}

export const buttonTypes: ButtonType[] = ['primary', 'reverse', 'secondary', 'danger']
export const buttonSizes: ButtonSize[] = ['large', 'medium', 'small']
export const buttonVariants: ButtonVariant[] = ['filled', 'outlined', 'ghost']
