<template>
  <button
    class="pill"
    :class="[`pill--${size}`, { 'pill--active': active }]"
    type="button"
    @click="$emit('click')"
  >
    <slot>
      <BasicText
        :size="textSizeMapping[size]"
        weight="semibold"
        class="pill__label"
      >
        {{ label }}
      </BasicText>
    </slot>
  </button>
</template>

<script setup lang="ts">
  import type { TextSize } from '@designSystem/components'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'

  type PillSize = 'small' | 'medium'

  const props = withDefaults(
    defineProps<{
      label?: string
      size?: PillSize
      active?: boolean
    }>(),
    {
      size: 'medium',
      label: '',
      active: false,
    },
  )

  const textSizeMapping: Record<PillSize, TextSize> = {
    small: 'body-s',
    medium: 'body-m',
  }
</script>

<style lang="less" scoped>
  .pill {
    padding: 7px 18px;
    border-radius: 999px;
    border: 1px solid var(--surface-border);
    background: var(--surface-1);
    color: var(--neutral-700);
    cursor: pointer;
    transition: var(--transition-medium);
    backdrop-filter: blur(4px);
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: var(--surface-3);
      border-color: var(--surface-border-strong);
    }

    &--small {
      padding: 4px 12px;
    }

    &--active {
      background: rgba(var(--primary-100-rgb), 0.85);
      border-color: rgba(var(--primary-400-rgb), 0.75);
      color: var(--primary-700);
      box-shadow: 0 0 0 1px rgba(var(--primary-300-rgb), 0.85);
    }
  }
</style>
