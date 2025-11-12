<template>
  <div
    :class="[
      'badge',
      `badge--${type}`,
      `badge--${size}`,
      {
        [`text--nbMaxLines-${nbMaxLines}`]: nbMaxLines,
      },
    ]"
  >
    <slot>
      <BasicText
        class="badge__label"
        :size="textSizeMapping[size]"
        weight="semibold"
        wrapAll
        :nbMaxLines
      >
        {{ label }}
      </BasicText>
    </slot>
    <BasicIcon
      v-if="deletable"
      name="close-square"
      class="badge__close-icon"
      @click="$emit('click-delete')"
    />
  </div>
</template>

<script setup lang="ts">
  import type { BadgeProps, BadgeSize, TextSize } from '@designSystem/components'

  withDefaults(defineProps<BadgeProps>(), {
    type: 'default',
    size: 'medium',
    deletable: false,
    nbMaxLines: undefined,
  })

  defineEmits(['click-delete'])

  const textSizeMapping: Record<BadgeSize, TextSize> = {
    small: 'body-s',
    medium: 'body-m',
  }
</script>

<style lang="less">
  @import './BasicBadge.less';
</style>
