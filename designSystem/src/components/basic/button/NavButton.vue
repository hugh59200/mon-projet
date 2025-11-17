<template>
  <button
    type="button"
    class="nav-btn"
    :class="[
      `nav-btn--${variant}`,
      `nav-btn--${size}`,
      { 'is-active': active, 'is-disabled': disabled },
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span
      v-if="iconName"
      class="nav-btn__icon"
    >
      <BasicIconNext :name="iconName" />
    </span>

    <span
      v-if="label"
      class="nav-btn__label"
    >
      <BasicText
        :size="textSize[size]"
        color="neutral-900"
        weight="semibold"
        nb-max-lines="1"
      >
        {{ label }}
      </BasicText>
    </span>
  </button>
</template>

<script setup lang="ts">
  import type { TextSize } from '@designSystem/index'
  import type { IconNameNext } from '../icon/BasicIconNext.vue'

  defineEmits(['click'])

  export type NavBtnVariant = 'ghost' | 'reverse' | 'primary'
  export type NavBtnSize = 'small' | 'medium'

  withDefaults(
    defineProps<{
      label?: string
      iconName?: IconNameNext
      active?: boolean
      disabled?: boolean
      variant?: NavBtnVariant
      size?: NavBtnSize
    }>(),
    {
      label: '',
      iconName: undefined,
      active: false,
      disabled: false,
      variant: 'ghost',
      size: 'medium',
    },
  )

  const textSize: Record<NavBtnSize, TextSize> = {
    small: 'body-s',
    medium: 'body-m',
  }
</script>

<style scoped lang="less">
  .nav-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-5);
    border: none;
    cursor: pointer;
    transition: var(--transition-medium);
    border-radius: var(--radius-button-m);
    background: transparent;

    &--small {
      padding: var(--padding-button-s) var(--spacing-10);
    }
    &--medium {
      padding: var(--padding-button-m) var(--spacing-15);
    }

    /* ICON */
    &__icon svg {
      width: 18px;
      height: 18px;
    }

    /* VARIANT: GHOST */
    &--ghost {
      color: var(--neutral-700);

      &:hover {
        background: var(--surface-hover);
      }
      &:active {
        background: var(--surface-active);
      }
    }

    /* VARIANT: REVERSE (Dark mode nav style) */
    &--reverse {
      color: var(--neutral-0);

      &:hover {
        background: rgba(var(--neutral-0-rgb), 0.1);
      }
      &:active {
        background: rgba(var(--neutral-0-rgb), 0.18);
      }
    }

    /* VARIANT: PRIMARY (nav selected) */
    &--primary,
    &.is-active {
      background: rgba(var(--primary-500-rgb), 0.12);
      color: var(--primary-600);
      box-shadow: var(--shadow-100);

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.18);
      }
    }

    /* DISABLED */
    &.is-disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
</style>
