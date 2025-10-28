<template>
  <WrapperFormElements
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
      :required
    >
      <template v-if="$slots.default">
        <div :class="{ required }">
          <slot></slot>
        </div>
      </template>
      <template v-else>
        <BasicText :class="{ required }">
          {{ label }}
        </BasicText>
      </template>
    </BasicCheckbox>
  </WrapperFormElements>
</template>

<script setup lang="ts">
  import type { WrapperCheckboxProps } from './WrapperCheckbox.types'

  defineProps<WrapperCheckboxProps>()

  const modelValue = defineModel<boolean | null>()
</script>

<style lang="less" scoped>
  .required::after {
    content: '*';
    color: @danger-600;
    margin-left: 4px;
  }
</style>
