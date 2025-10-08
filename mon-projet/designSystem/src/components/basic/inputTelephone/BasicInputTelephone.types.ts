export type InputTelephoneModel = string | null | undefined
export type InputTelephoneProps = {
  modelValue?: InputTelephoneModel
  defaultValue?: string
}

export type InputTelephoneEvents = {
  (e: 'update:modelValue', modelValue: Exclude<InputTelephoneModel, undefined>): void
  (e: 'deleteBadge'): void
}
