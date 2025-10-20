<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :help
    :alertLabel
    :alertType
  >
    <BasicToggleSwitch
      v-model="modelValue"
      :items
      :disabled
      :readonly
      :size
      :key-id="keyId"
      :key-label="keyLabel"
    />
  </WrapperFormElements>
</template>

<script setup lang="ts" generic="TToggleItem = ToggleItem, TToggleKey extends ToggleId = ToggleId">
  import type { ToggleId, ToggleItem, WrapperToggleSwitchProps } from '@designSystem/components'

  defineProps<WrapperToggleSwitchProps<TToggleItem>>()

  const modelValue = defineModel<TToggleKey>()
</script>
<style lang="less">
  .toggle-switch {
    margin-left: 1px;
  }
</style>
