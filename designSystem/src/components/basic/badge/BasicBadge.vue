<template>
  <div
    :class="badgeClasses"
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
  import type { BadgeProps, BadgeSize } from './BasicBadge.types'
  import type { TextSize } from '@designSystem/components'
  import { computed } from 'vue'

  const props = withDefaults(defineProps<BadgeProps>(), {
    type: 'default',
    size: 'medium',
    deletable: false,
    nbMaxLines: undefined,
    color: undefined,
    selected: false,
  })

  defineEmits(['click-delete'])

  const textSizeMapping: Record<BadgeSize, TextSize> = {
    small: 'body-s',
    medium: 'body-m',
  }

  const badgeClasses = computed(() => {
    const classes: string[] = ['badge', `badge--${props.size}`]

    // Si color est défini, utiliser le système de couleurs
    if (props.color) {
      classes.push(`badge--color-${props.color}`)
      if (props.selected) {
        classes.push('badge--selected')
      }
    } else {
      // Sinon utiliser le type classique
      classes.push(`badge--${props.type}`)
    }

    if (props.nbMaxLines) {
      classes.push(`text--nbMaxLines-${props.nbMaxLines}`)
    }

    return classes
  })
</script>

<style lang="less">
  @import './BasicBadge.less';
</style>
