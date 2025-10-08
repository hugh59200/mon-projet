export type ToggleSize = 'small' | 'medium' | 'large'

export type ToggleId = number | string | boolean | undefined | null

export type ToggleItem<T = ToggleId> = {
  id: T
  label: string
  disabled?: boolean
}

export type ToggleSwitchProps<T = ToggleItem<ToggleId>> = {
  items?: T[]
  size?: ToggleSize
  disabled?: boolean
  readonly?: boolean
  keyId?: keyof T
  keyLabel?: keyof T
}

export const toggleSizes: ToggleSize[] = ['small', 'medium', 'large']
