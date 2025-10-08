import type { IconName } from '@designSystem/fondation/icons/iconsList'

export type InputSize = 'small' | 'medium' | 'large'
export type ValidationState = 'success' | 'error'
export type IconState = 'iconLeft' | 'iconRight'

export type InputModel = string | null | undefined

export const inputSizes: InputSize[] = ['small', 'medium', 'large']
export const inputValidationStates: ValidationState[] = ['success', 'error']

export type InputProps = {
  size?: InputSize
  placeholder?: string
  maxlength?: number
  iconState?: IconState
  iconName?: IconName | undefined
  deletable?: boolean
  disabled?: boolean
  readonly?: boolean
  validationState?: ValidationState
  autocomplete?: 'off' | 'on'
  inputType?: 'form' | 'table'
}
