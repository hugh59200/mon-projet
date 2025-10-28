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
      :key-id="keyId as TKeyId"
      :key-label="keyLabel as TKeyId"
      :key-icon-name="keyIconName as TKeyIconName"
    />
  </BasicCell>
</template>

<script setup lang="ts" generic="TDropdownKey extends DropdownId = DropdownId, TDropdownItem extends DropdownItem<TDropdownKey> = DropdownItem<TDropdownKey>, TKeyId extends keyof DropdownItem<TDropdownKey> = keyof DropdownItem<TDropdownKey>, TKeyIconName extends keyof DropdownItem<TDropdownKey> = keyof DropdownItem<TDropdownKey>">
  import type { BasicCellProps } from './BasicCell.types'
  import BasicCell from './BasicCell.vue'
  import type { DropdownItem, DropdownId, DropdownProps } from '@designSystem/components'

  export type BasicCellDropdownProps<T = DropdownItem<DropdownId>> = BasicCellProps & DropdownProps<T>

  withDefaults(defineProps<BasicCellDropdownProps<TDropdownItem>>(), {
    forceValue: false,
  })

  const modelValue = defineModel<TDropdownKey>()
</script>
