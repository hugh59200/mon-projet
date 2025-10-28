export type TextSize = 'body-s' | 'body-m' | 'body-l' | 'body-xl' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1'

export type TextWeight = 'light' | 'regular' | 'semibold' | 'bold'
export type TextStyle = 'italic' | 'normal'

export type TextColor =
  | 'primary-600'
  | 'primary-800'
  | 'primary-400'
  | 'secondary-1000'
  | 'secondary-900'
  | 'secondary-800'
  | 'secondary-600'
  | 'secondary-400'
  | 'neutral-900'
  | 'neutral-700'
  | 'neutral-500'
  | 'neutral-400'
  | 'neutral-300'
  | 'success-600'
  | 'success-400'
  | 'danger-600'
  | 'danger-400'
  | 'warning-600'
  | 'warning-400'
  | 'info-600'
  | 'info-400'
  | 'pink-400'
  | 'white'
  | 'black'
  | 'dark-jungle-green'

export type HeadingProps = {
  size?: TextSize
  weight?: TextWeight
  fontStyle?: TextStyle
  color?: TextColor
  maxLength?: number
  label?: string
  wrap?: boolean
  wrapAll?: boolean
  nbMaxLines?: '1' | '2' | '3'
  focusable?: boolean
  pointer?: boolean
}
