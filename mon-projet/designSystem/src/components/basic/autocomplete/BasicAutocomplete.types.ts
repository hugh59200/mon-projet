import type { NestedKeyOf } from '@/features/shared/types/NestedKeyOf'

export const AutocompleteSize = ['small', 'medium', 'large'] as const

export type AutocompleteSize = (typeof AutocompleteSize)[number]

export type AutocompleteSearchCallback<T extends object = object> = (
  value: string,
  signal: AbortSignal,
) => T[] | Promise<T[]>
export type AutocompleteSearchFormater = (value: string) => string

export type AutocompleteItemToStringCallback<T extends object = object> = (value: T) => string

export type AutocompleteItem<T = string | number | null> = {
  id: T
  label: string
}

export type AutocompleteProps<T extends object = object> = {
  search: AutocompleteSearchCallback<T>
  searchFormater?: AutocompleteSearchFormater
  searchMinLength?: number
  getItemLabel?: AutocompleteItemToStringCallback<T>
  getInputText?: AutocompleteItemToStringCallback<T>
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  strict?: boolean
  debounce?: number
  size?: AutocompleteSize
  keyId?: NestedKeyOf<T>
  keyLabel?: NestedKeyOf<T>
  emptyResultLabel?: string
  direction?: 'up' | 'down'
}

export type AutocompleteLastSearchCount = 'no-search' | 'searching' | 'error' | number
export type AutocompleteEmits = {
  (e: 'update:lastSearchResultCount', value: AutocompleteLastSearchCount): void
}
