<template>
  <component
    :is="['h1', 'h2', 'h3', 'h4', 'h5'].includes(size) ? size : 'span'"
    :class="[
      'text',
      size,
      fontStyle,
      weight,
      {
        'text--wrap': wrap,
        'text--pointer': pointer,
        'text--wrapAll': wrapAll,
        [`text-color--${color}`]: isDesignToken,
        [`text--nbMaxLines-${nbMaxLines}`]: nbMaxLines,
      },
    ]"
    :style="inlineStyle"
    @click="$emit('click')"
  >
    <slot>{{ label }}</slot>
  </component>
</template>

<script setup lang="ts">
  import type { HeadingProps } from '@designSystem/components'
  import { computed } from 'vue'

  const props = withDefaults(defineProps<HeadingProps>(), {
    fontStyle: 'normal',
    weight: 'regular',
    size: 'body-l',
    wrap: false,
    wrapAll: false,
    nbMaxLines: undefined,
    focusable: false,
    pointer: false,
  })

  // ✅ Vérifie si la couleur correspond à un token du design system
  const isDesignToken = computed(() => /^[a-zA-Z]+-\d{2,4}$/.test(props.color || ''))

  // ✅ Si ce n’est PAS un token (ex : #3B82F6), applique la couleur inline
  const inlineStyle = computed(() => {
    const color = props.color
    if (!color) return {}
    const isCustom = /^#|rgb|hsl/i.test(color)
    return isCustom ? { color } : {}
  })

  defineEmits(['click'])
</script>

<style lang="less">
  @import './BasicText.less';
</style>
