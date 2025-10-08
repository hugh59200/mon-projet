export type InputNumberModel = string | number | null | undefined
export type InputNumberProps = {
  modelValue?: InputNumberModel
  defaultValue?: number
  pourcentage?: boolean
  separateur?: boolean
  decimal?: number
  maxLength?: number
  textAlign?: 'left' | 'right'
}
export type InputNumberEvents = {
  (e: 'update:modelValue', modelValue: Exclude<InputNumberModel, undefined>): void
}
