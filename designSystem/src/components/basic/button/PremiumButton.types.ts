import type { IconNameNext } from '../icon/BasicIconNext.types'

// Types de base hérités
export type PremiumButtonType = 'primary' | 'secondary' | 'danger' | 'success' | 'white'
export type PremiumButtonSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'
export type PremiumButtonVariant = 'solid' | 'outline' | 'ghost' | 'glass' | 'gradient'
export type PremiumButtonHtmlType = 'button' | 'submit' | 'reset'

// Configuration du loading
export type LoadingConfig = {
  text?: string
  showProgress?: boolean
  showDots?: boolean
}

export type PremiumButtonProps = {
  // Base
  type?: PremiumButtonType
  htmlType?: PremiumButtonHtmlType
  size?: PremiumButtonSize
  variant?: PremiumButtonVariant
  width?: 'auto' | 'full'

  // Contenu
  label?: string
  iconLeft?: IconNameNext
  iconRight?: IconNameNext
  badge?: string | number

  // États
  disabled?: boolean
  loading?: boolean
  active?: boolean

  // Premium features
  shine?: boolean
  glow?: boolean
  pulse?: boolean

  // Loading config
  loadingText?: string
  loadingIcon?: IconNameNext
  showLoadingProgress?: boolean
  showLoadingDots?: boolean
}

export const premiumButtonTypes: PremiumButtonType[] = ['primary', 'secondary', 'danger', 'success', 'white']
export const premiumButtonSizes: PremiumButtonSize[] = ['xl', 'lg', 'md', 'sm', 'xs']
export const premiumButtonVariants: PremiumButtonVariant[] = ['solid', 'outline', 'ghost', 'glass', 'gradient']
