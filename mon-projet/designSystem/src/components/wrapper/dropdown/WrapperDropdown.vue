<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
    :help
    :wrapLabel
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
  </WrapperFormElements>
</template>

<script setup lang="ts" generic="TDropdownItem = DropdownItem, TDropdownKey extends DropdownId = DropdownId">
  import type { WrapperDropdownProps, DropdownId, DropdownItem } from '@designSystem/components'

  withDefaults(defineProps<WrapperDropdownProps<TDropdownItem>>(), {
    deletable: true,
  })

  const modelValue = defineModel<TDropdownKey>()
</script>
