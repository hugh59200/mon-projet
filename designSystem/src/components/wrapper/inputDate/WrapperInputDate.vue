<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
    :help
  >
    <BasicInputDate
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
      :maxlength="10"
      hasCalendar
    />
  </WrapperFormElements>
</template>

<script setup lang="ts">
  import type { WrapperInputDateProps, InputDateModel } from '@designSystem/components'

  defineProps<WrapperInputDateProps>()

  const modelValue = defineModel<InputDateModel>()
</script>
