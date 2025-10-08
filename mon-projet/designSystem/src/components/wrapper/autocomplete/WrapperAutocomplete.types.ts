import type { AutocompleteProps, WrapperFormElementProps } from '@designSystem/components'

export type WrapperAutocompleteProps<T extends object = object> = WrapperFormElementProps & AutocompleteProps<T>
