<template>
  <component
    :is="['h1', 'h2', 'h3', 'h4', 'h5'].includes(size) ? size : 'span'"
    v-focusable="{ focusable, onEnter: () => $emit('click') }"
    :class="[
      'text',
      size,
      fontStyle,
      weight,
      {
        'text--wrap': wrap,
        'text--pointer': pointer,
        'text--wrapAll': wrapAll,
        [`text-color--${color}`]: color,
        [`text--nbMaxLines-${nbMaxLines}`]: nbMaxLines,
      },
    ]"
    @click="$emit('click')"
  >
    <slot>{{ label }}</slot>
  </component>
</template>

<script setup lang="ts">
  import type { HeadingProps } from '@designSystem/components'

  withDefaults(defineProps<HeadingProps>(), {
    fontStyle: 'normal',
    weight: 'regular',
    size: 'body-l',
    wrap: false,
    wrapAll: false,
    nbMaxLines: undefined,
    focusable: false,
    pointer: false,
  })

  defineEmits(['click'])
</script>

<style lang="less">
  @import './BasicText.less';
</style>
