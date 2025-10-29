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
      :items="items"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :deletable="deletable"
      :force-value="forceValue"
      :key-id="keyId"
      :key-label="keyLabel"
      :key-icon-name="keyIconName"
    />
  </WrapperFormElements>
</template>

<script
  setup
  lang="ts"
  generic="TDropdownKey extends string | number | boolean | undefined = string | number | boolean | undefined, TDropdownItem extends DropdownItem<TDropdownKey> = DropdownItem<TDropdownKey>"
>
  import type {  DropdownItem, WrapperDropdownProps } from '@designSystem/components'

  withDefaults(defineProps<WrapperDropdownProps<TDropdownItem> & {
    keyId?: keyof DropdownItem<TDropdownKey>
    keyLabel?: keyof DropdownItem<TDropdownKey>
    keyIconName?: keyof DropdownItem<TDropdownKey>
  }>(), {
    deletable: true,
  })

  const modelValue = defineModel<TDropdownKey>()
</script>
