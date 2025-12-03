/**
 * 🚨 ATTENTION :
 * Les types suivants sont déclarés globalement pour simplifier leur usage dans des fichiers TypeScript purs (.ts).
 * Cependant, dans les composants Vue (.vue), il est **obligatoire** d'importer explicitement chaque type
 * pour qu'il soit correctement reconnu par le compilateur SFC de Vue (defineProps, defineEmits).
 */
declare global {
  type AlertInputProps = import('@designSystem/components').AlertInputProps
  type BadgeProps = import('@designSystem/components').BadgeProps
  type PremiumButtonProps = import('@designSystem/components').PremiumButtonProps
  type CheckboxProps = import('@designSystem/components').CheckboxProps
  type DropdownProps = import('@designSystem/components').DropdownProps
  type DropdownItemProps = import('@designSystem/components').DropdownItemProps
  type HintProps = import('@designSystem/components').HintProps
  type InputProps = import('@designSystem/components').InputProps
  type InputLabelProps = import('@designSystem/components').InputLabelProps
  type InputNumberProps = import('@designSystem/components').InputNumberProps
  type TabProps = import('@designSystem/components').TabProps
  type TextProps = import('@designSystem/components').HeadingProps
  type TooltipProps = import('@designSystem/components').TooltipProps
}

export {}
