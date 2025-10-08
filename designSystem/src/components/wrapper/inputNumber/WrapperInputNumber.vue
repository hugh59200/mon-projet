<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
    :help
  >
    <BasicInputNumber
      v-model="modelValue"
      :pourcentage
      :default-value
      :separateur
      :decimal
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
  import type { WrapperInputNumberProps, InputNumberModel } from '@designSystem/components'

  defineProps<WrapperInputNumberProps>()

  const modelValue = defineModel<InputNumberModel>()
</script>
