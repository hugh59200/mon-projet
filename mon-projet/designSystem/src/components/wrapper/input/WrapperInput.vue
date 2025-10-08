<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
    :help
  >
    <BasicInput
      v-model="modelValue"
      :disabled
      :size
      :validation-state
      :placeholder
      :maxlength
      :icon-state
      :icon-name
      :deletable
      :readonly
      :input-type
      :alertLabel
      :alertType
    />
  </WrapperFormElements>
</template>

<script setup lang="ts">
  import type { AlertInputProps, InputModel, WrapperInputProps } from '@designSystem/components'

  withDefaults(defineProps<WrapperInputProps & AlertInputProps>(), {
    hasBg: true,
    wrap: false,
    hasLabel: true,
    maxLength: undefined,
    alertType: undefined,
    alertLabel: undefined,
  })

  const modelValue = defineModel<InputModel>()
</script>
