export type InputDateModel = string | null | undefined
export type InputDateProps = {
  modelValue?: InputDateModel
  defaultValue?: string
  hasCalendar?: boolean
}

export type InputDateEvents = {
  (e: 'update:modelValue', modelValue: Exclude<InputDateModel, undefined>): void
  (e: 'deleteBadge'): void
}
