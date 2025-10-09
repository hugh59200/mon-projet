export type DialogType = 'Ok' | 'OkCancel' | 'YesNo' | 'CancelRetry' | 'Error'
export type DialogResult = 'Ok' | 'Cancel' | 'Yes' | 'No' | 'Retry'
export type DialogOptions = {
  type: DialogType
}
export type Invocation = {
  resolve: (value: DialogResult | PromiseLike<DialogResult>) => void
} & ShowDialogOptions

export type ShowDialogOptions = {
  type: DialogType
  title?: string
  message: string | string[]
  closable?: boolean
  isHtml?: boolean
}

export interface IDialog {
  showDialog(options: ShowDialogOptions): Promise<DialogResult>
}

