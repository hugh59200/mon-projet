<template>
  <div class="hint">
    <BasicText
      class="basic-hint"
      size="body-s"
      wrap
    >
      <slot>{{ hint }}</slot>
    </BasicText>
  </div>
</template>

<script setup lang="ts">
  import type { HintProps } from '@designSystem/components'

  defineProps<HintProps>()
</script>

<style lang="less">
  @import './BasicHint.less';
</style>
