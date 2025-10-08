<template>
  <div
    class="wrapper__hint-container"
    v-if="hint || label"
  >
    <BasicInputLabel
      v-if="label"
      :label
      :required
      :help
      class="wrapper__label"
      :wrap-label
    >
      <slot name="label"></slot>
    </BasicInputLabel>

    <div class="wrapper__hint">
      <BasicHint
        v-if="hint"
        :hint
      >
        <slot name="hint"></slot>
      </BasicHint>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BasicInputLabel, BasicHint } from '@designSystem/components'

  export interface WrapperLabelHintProps {
    label?: string
    required?: boolean
    help?: string
    hint?: string
    wrapLabel?: boolean
  }

  withDefaults(defineProps<WrapperLabelHintProps>(), {
    label: '',
    required: false,
    help: '',
    hint: '',
    wrapLabel: true,
  })
</script>

<style lang="less" scoped>
  .wrapper__hint-container {
    display: flex;
    flex-direction: column;
    caret-color: transparent;

    ::v-deep(.basic-hint) {
      padding-top: @spacing-5;
    }
  }

  .wrapper__label {
    height: auto;
  }

  .wrapper__hint {
    height: 14px;
    margin-top: calc(-@spacing-5);
    margin-bottom: @spacing-5;
  }
</style>
