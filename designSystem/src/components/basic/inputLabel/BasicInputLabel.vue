<template>
  <div
    class="input-label"
    :class="{ 'input-label--unwrap': !wrapLabel }"
  >
    <BasicText
      v-if="required"
      class="input-label__required"
    >
      <span>*</span>
    </BasicText>
    <BasicText
      size="body-m"
      wrap
    >
      <slot>{{ label }}</slot>
    </BasicText>
    <span
      :title="help"
      class="input-label__icon"
    >
      <BasicIcon
        v-if="help"
        name="help"
        active
      />
    </span>
  </div>
</template>

<script setup lang="ts">
  import { type InputLabelProps } from '@designSystem/components'

  withDefaults(defineProps<InputLabelProps>(), {
    wrapLabel: true,
  })
</script>

<style lang="less">
  @import './BasicInputLabel.less';
</style>
