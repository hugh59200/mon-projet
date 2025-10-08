export type PopupType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'task'
export type IconName = 'tick-circle' | 'danger' | 'warning' | 'info-circle' | 'task-square'

export type PopupProps = {
  titleText?: string
  firstParagraph?: string
  secondParagraph?: string
  hasCloseAction: boolean
  hasButtonAction: boolean
  type?: PopupType
}

export const popupTypes: PopupType[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'task']

export const IconMap: Record<PopupType, IconName> = {
  primary: 'tick-circle',
  secondary: 'tick-circle',
  success: 'tick-circle',
  danger: 'danger',
  warning: 'warning',
  info: 'info-circle',
  task: 'task-square',
}

export const TitleMap: Record<PopupType, string> = {
  primary: 'Une alerte simple - vérifiez-la!',
  secondary: 'Une alerte simple - vérifiez-la!',
  success: 'Success',
  danger: 'Danger',
  warning: 'Warning',
  info: 'Information',
  task: 'Tâche',
}
