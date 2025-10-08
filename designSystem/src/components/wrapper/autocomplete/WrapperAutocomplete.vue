<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
  >
    <BasicAutocomplete
      v-model="modelValue!"
      :get-input-text
      :get-item-label
      :search
      :search-min-length
      :size
      :placeholder
      :disabled
      :readonly
      :direction
      :emptyResultLabel
      :strict
      :key-id
      :key-label
      :search-formater
      @update:lastSearchResultCount="emits('update:lastSearchResultCount', $event)"
    >
      <template v-slot="item">
        <slot v-bind="item"></slot>
      </template>
    </BasicAutocomplete>
  </WrapperFormElements>
</template>

<script setup lang="ts" generic="TAutocompleteItem extends object = AutocompleteItem">
  import type { AutocompleteEmits, AutocompleteItem, WrapperAutocompleteProps } from '@designSystem/components'

  defineProps<WrapperAutocompleteProps<TAutocompleteItem>>()

  const modelValue = defineModel<TAutocompleteItem | null>()
  const emits = defineEmits<AutocompleteEmits>()
</script>
