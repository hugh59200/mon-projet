export type TextSize = 'body-s' | 'body-m' | 'body-l' | 'body-xl' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1'
export type TextWeight = 'light' | 'regular' | 'semibold' | 'bold'
export type TextStyle = 'italic' | 'normal'

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

export type TextColor =
  | 'primary-600'
  | 'primary-800'
  | 'secondary-1000'
  | 'secondary-900'
  | 'secondary-800'
  | 'secondary-600'
  | 'neutral-500'
  | 'pink-400'
  | 'dark-jungle-green'
  | 'white'
  | 'red'
