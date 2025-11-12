<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
    :help
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
      :key-id="'id' as keyof DropdownItem"
      :key-label="'label' as keyof DropdownItem"
      :key-icon-name="'iconName' as keyof DropdownItem"
      :mode
    />
  </WrapperFormElements>
</template>

<script
  setup
  lang="ts"
  generic="
    TDropdownItem extends DropdownItem = DropdownItem,
    TDropdownKey extends DropdownId = DropdownId
  "
>
  import type { DropdownId, DropdownItem, WrapperDropdownProps } from '@designSystem/components'

  withDefaults(defineProps<WrapperDropdownProps<TDropdownItem>>(), {
    deletable: true,
    mode: 'single',
  })

  type ModelType = TDropdownKey | TDropdownKey[]

  const modelValue = defineModel<ModelType>()
</script>
