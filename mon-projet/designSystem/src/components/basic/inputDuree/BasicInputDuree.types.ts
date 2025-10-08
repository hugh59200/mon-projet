import type { InputProps } from '../input/BasicInput.types'
import type { IInputDuree } from './IInputDuree'

export type InputDureeModel = IInputDuree | null | undefined
export type InputDureeProps = {
  modelValue?: InputDureeModel
  defaultValue?: InputDureeModel
  separateur?: 'h' | ':'
}

export type InputDureeEvents = {
  (e: 'update:modelValue', modelValue: Exclude<InputDureeModel, undefined>): void
}

export type BasicInputDureeProps = InputDureeProps & InputProps
