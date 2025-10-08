<template>
  <BasicCell
    :center
    :span
    :danger
    :readonly
    :deactivated
    :extra-class
  >
    <BasicDropdown
      v-model="modelValue"
      :items
      :placeholder
      :size
      :disabled
      :readonly
      :deletable
      :force-value
      :key-id
      :key-label
      :key-icon-name
    />
  </BasicCell>
</template>

<script setup lang="ts" generic="TDropdownItem = DropdownItem, TDropdownKey extends DropdownId = DropdownId">
  import type { BasicCellProps } from './BasicCell.types'
  import BasicCell from './BasicCell.vue'
  import type { DropdownItem, DropdownId, DropdownProps } from '@designSystem/components'

  export type BasicCellDropdownProps<T = DropdownItem<DropdownId>> = BasicCellProps & DropdownProps<T>

  withDefaults(defineProps<BasicCellDropdownProps<TDropdownItem>>(), {
    forceValue: false,
  })

  const modelValue = defineModel<TDropdownKey>()
</script>
