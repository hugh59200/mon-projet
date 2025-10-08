<template>
  <InputContainer
    v-model="modelValue"
    :size
    :validation-state
    :icon-state
    :icon-name
    :deletable
    :readonly
    :disabled
    :input-type
    :alertLabel
    :alertType
  >
    <input
      type="text"
      :id
      v-model="modelValue"
      :placeholder
      :maxlength
      :readonly
      :disabled
    />
  </InputContainer>
</template>

<script setup lang="ts">
  import { useAutoId, type AlertInputProps, type InputModel, type InputProps } from '@designSystem/components'

  withDefaults(defineProps<InputProps & AlertInputProps>(), {
    size: 'medium',
    readonly: false,
    disabled: false,
    hasBg: false,
    wrap: false,
    hasLabel: true,
    maxLength: undefined,
  })

  const modelValue = defineModel<InputModel>()

  const id = useAutoId('input')
</script>
<style lang="less">
  @import './BasicInput.less';
</style>
