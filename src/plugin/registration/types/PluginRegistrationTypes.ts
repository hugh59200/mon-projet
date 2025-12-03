/**
 * 🚨 ATTENTION :
 * Les types suivants sont déclarés globalement pour simplifier leur usage dans des fichiers TypeScript purs (.ts).
 * Cependant, dans les composants Vue (.vue), il est **obligatoire** d'importer explicitement chaque type
 * pour qu'il soit correctement reconnu par le compilateur SFC de Vue (defineProps, defineEmits).
 */
declare global {
  type AlertInputProps = import('@designSystem/components').AlertInputProps
  type AutocompleteProps = import('@designSystem/components').AutocompleteProps
  type AvatarProps = import('@designSystem/components').AvatarProps
  type BadgeProps = import('@designSystem/components').BadgeProps
  type PremiumButtonProps = import('@designSystem/components').PremiumButtonProps
  type CheckboxProps = import('@designSystem/components').CheckboxProps
  type DropdownProps = import('@designSystem/components').DropdownProps
  type DropdownItemProps = import('@designSystem/components').DropdownItemProps
  type HintProps = import('@designSystem/components').HintProps
  type InputProps = import('@designSystem/components').InputProps
  type InputDateProps = import('@designSystem/components').InputDateProps
  type InputDureeProps = import('@designSystem/components').InputDureeProps
  type InputLabelProps = import('@designSystem/components').InputLabelProps
  type InputNumberProps = import('@designSystem/components').InputNumberProps
  type InputTelephoneProps = import('@designSystem/components').InputTelephoneProps
  type LinkProps = import('@designSystem/components').StandaloneLinkProps
  type TabProps = import('@designSystem/components').TabProps
  type TextProps = import('@designSystem/components').HeadingProps
  type ToggleSwitchProps = import('@designSystem/components').ToggleSwitchProps
  type TooltipProps = import('@designSystem/components').TooltipProps
}

export {}
