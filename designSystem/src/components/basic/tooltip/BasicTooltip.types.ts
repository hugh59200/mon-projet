export type TooltipProps = {
  label: string
  position?: TooltipPosition
  visible?: boolean
  maxLength?: number
  maxWidth?: number
}

export const TooltipPosition = ['left', 'right', 'top', 'bottom'] as const

export type TooltipPosition = (typeof TooltipPosition)[number]
