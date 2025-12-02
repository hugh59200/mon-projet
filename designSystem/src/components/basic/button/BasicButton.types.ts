import type { IconNameNext } from '../icon/BasicIconNext.vue'

export type ButtonType = 'primary' | 'reverse' | 'secondary' | 'danger'
export type ButtonSize = 'large' | 'medium' | 'small'
export type ButtonVariant = 'filled' | 'outlined' | 'ghost'
export type ButtonHtmlType = 'button' | 'submit' | 'reset'

export type ButtonProps = {
  type?: ButtonType
  htmlType?: ButtonHtmlType
  size?: ButtonSize
  variant?: ButtonVariant
  label?: string
  iconName?: IconNameNext
  iconRight?: boolean
  disabled?: boolean
  active?: boolean
  width?: 'auto' | 'full'
}

export const buttonTypes: ButtonType[] = ['primary', 'reverse', 'secondary', 'danger']
export const buttonSizes: ButtonSize[] = ['large', 'medium', 'small']
export const buttonVariants: ButtonVariant[] = ['filled', 'outlined', 'ghost']
