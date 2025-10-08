<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
  >
    <BasicDropdownMultiple
      v-model="modelValue"
      :items
      :disabled
      :placeholder
      :size
      :readonly
      :deletable
      :key-id
      :key-label
      :key-icon-name
    />
  </WrapperFormElements>
</template>

<script setup lang="ts" generic="TDropdownItem = DropdownItem, TDropdownKey extends DropdownId = DropdownId">
  import type { WrapperDropdownProps, DropdownId, DropdownItem } from '@designSystem/components'

  withDefaults(defineProps<WrapperDropdownProps<TDropdownItem>>(), {
    deletable: true,
  })

  const modelValue = defineModel<TDropdownKey[]>()
</script>
