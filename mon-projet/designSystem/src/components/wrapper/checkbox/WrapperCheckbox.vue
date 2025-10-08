<template>
  <WrapperFormElements
    :required
    :hint
    :alertLabel
    :alertType
    :help
  >
    <BasicCheckbox
      v-model="modelValue"
      :label
      :disabled
      :readonly
    >
      <slot></slot>
    </BasicCheckbox>
  </WrapperFormElements>
</template>

<script setup lang="ts">
  import type { WrapperCheckboxProps } from './WrapperCheckbox.types'

  defineProps<WrapperCheckboxProps>()

  const modelValue = defineModel<boolean | null>()
</script>
