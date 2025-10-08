<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
    :help
  >
    <BasicInputDuree
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
      :maxlength
    />
  </WrapperFormElements>
</template>

<script setup lang="ts">
  import type { WrapperInputDureeProps, InputDureeModel } from '@designSystem/components'

  defineProps<WrapperInputDureeProps>()

  const modelValue = defineModel<InputDureeModel>()
</script>
