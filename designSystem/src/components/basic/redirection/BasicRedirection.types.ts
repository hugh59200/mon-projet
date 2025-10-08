import type { ButtonProps, TooltipProps } from '@designSystem/components/index'

export type RedirectionMode = 'sticky' | 'fixed'

export type BasicRedirectionProps = Partial<ButtonProps> &
  Partial<TooltipProps> & {
    to?: string
    showIf?: boolean
  }
