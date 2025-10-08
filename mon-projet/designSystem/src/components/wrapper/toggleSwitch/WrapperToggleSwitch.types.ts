import type { ToggleSwitchProps, WrapperFormElementProps, ToggleId, ToggleItem } from '@designSystem/components'

export type WrapperToggleSwitchProps<T = ToggleItem<ToggleId>> = WrapperFormElementProps & ToggleSwitchProps<T>
