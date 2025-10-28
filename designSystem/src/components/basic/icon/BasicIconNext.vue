<template>
  <component
    :is="iconComponent"
    v-bind="computedProps"
    class="basic-icon-next"
    :class="[
      `basic-icon-next--color--${colorClass}`,
      { 'basic-icon-next--pointer': pointer },
      { 'basic-icon-next--not-allowed': disabled && !pointer },
      { 'basic-icon-next--disabled': disabled },
    ]"
  />
</template>

<script setup lang="ts">
  import * as LucideIcons from 'lucide-vue-next'
  import { computed, type Component } from 'vue'
  import type { IconColor } from './BasicIcon.type'

  export type IconNameNext = keyof typeof LucideIcons

  interface Props {
    name: IconNameNext
    size?: number
    color: IconColor
    strokeWidth?: number
    pointer?: boolean
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 20,
    color: 'primary-600',
    strokeWidth: 1.5,
    pointer: false,
    disabled: false,
  })

  const iconComponent = computed(() => {
    return (LucideIcons[props.name] as Component) || LucideIcons.HelpCircle
  })

  const computedProps = computed(() => ({
    size: props.size,
    color: 'currentColor',
    'stroke-width': props.strokeWidth,
  }))

  const colorClass = computed(() => (props.disabled ? 'neutral-300' : props.color))
</script>

<style scoped lang="less">
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .basic-icon-next {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    opacity: 0;
    animation: fadeIn 0.25s ease forwards;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;

    &--pointer {
      cursor: pointer;
    }

    &--not-allowed {
      cursor: not-allowed !important;
    }

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &--color--primary-600 {
      color: @primary-600;
    }
    &--color--pink-400 {
      color: @pink-400;
    }
    &--color--secondary-800 {
      color: @secondary-800;
    }
    &--color--secondary-1000 {
      color: @secondary-1000;
    }
    &--color--grey-800 {
      color: @grey-800;
    }
    &--color--neutral-300 {
      color: @neutral-300;
    }
    &--color--white {
      color: @white;
    }

    &:focus {
      outline: none;
      box-shadow: @focus-global;
    }

    svg {
      display: block;
    }
  }
</style>
