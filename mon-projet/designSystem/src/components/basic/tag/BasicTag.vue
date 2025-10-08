<template>
  <div :class="['tag', `tag--${labelToTypeMapping[label]}`, `tag--${size}`]">
    <BasicText
      class="tag__label"
      :size="textSizeMapping[size]"
      weight="bold"
    >
      {{ label }}
    </BasicText>
  </div>
</template>

<script setup lang="ts">
  import { labelToTypeMapping } from '@designSystem/components'
  import type { TagSize, TextSize, TagProps } from '@designSystem/components'

  withDefaults(defineProps<TagProps>(), {
    label: 'TRAITE',
    size: 'small',
  })

  const textSizeMapping: Record<TagSize, TextSize> = {
    medium: 'body-m',
    small: 'body-s',
  }
</script>
<style lang="less">
  @import './BasicTag.less';
</style>
