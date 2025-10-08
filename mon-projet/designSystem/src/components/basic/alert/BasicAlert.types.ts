export type AlertType = 'warning' | 'danger' | 'success' | 'info'
export type AlertSize = 'medium' | 'small'

export type AlertInputProps = {
  alertType?: AlertType
  alertLabel?: string
  wrap?: boolean
  hasBg?: boolean
  hasLabel?: boolean
  alertSize?: AlertSize
  alertMaxlength?: number
}
