import type { IconColor } from '../icon'
import type { IconNameNext } from '../icon/BasicIconNext.vue'

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
  iconName?: IconNameNext
  deletable?: boolean
  disabled?: boolean
  readonly?: boolean
  iconColor?: IconColor
  pointer?: boolean
  validationState?: ValidationState
  autocomplete?: 'off' | 'on' | 'email' | 'username' | 'current-password' | 'new-password' | 'name' | 'given-name' | 'family-name' | 'tel' | 'street-address' | 'postal-code' | 'country' | 'cc-number' | 'cc-exp' | 'cc-csc' | (string & {})
  inputType?: 'form' | 'table'
}
