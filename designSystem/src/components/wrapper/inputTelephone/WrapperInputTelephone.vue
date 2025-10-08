<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
    :help
  >
    <BasicInputTelephone
      v-model="modelValue"
      :default-value
      :disabled
      :size
      :validation-state
      :placeholder
      :icon-state
      :icon-name
      :deletable
      :readonly
      :maxlength="14"
    />
  </WrapperFormElements>
</template>

<script setup lang="ts">
  import type { WrapperInputTelephoneProps, InputTelephoneModel } from '@designSystem/components'

  defineProps<WrapperInputTelephoneProps>()

  const modelValue = defineModel<InputTelephoneModel>()
</script>
