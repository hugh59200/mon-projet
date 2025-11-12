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
        :size="textSizeMapping[size]"
        nb-max-lines="1"
        color="white"
      >
        {{ label }}
      </BasicText>
    </span>
  </button>
</template>

<script setup lang="ts">
  import type { TextSize } from '@designSystem/index'
  import type { IconNameNext } from '../icon/BasicIconNext.vue'

  export type NavButtonVariant = 'ghost' | 'filled' | 'active'
  export type NavButtonSize = 'small' | 'medium'

  defineEmits(['click'])

  withDefaults(
    defineProps<{
      label?: string
      iconName?: IconNameNext
      active?: boolean
      disabled?: boolean
      variant?: NavButtonVariant
      size?: NavButtonSize
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

  const textSizeMapping: Record<NavButtonSize, TextSize> = {
    small: 'body-s',
    medium: 'body-m',
  }
</script>

<style scoped lang="less">
  /* ==========================================================
   🌟 NAV BUTTON — composant dédié à la navigation
   ========================================================== */

  .nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 0.25s ease;
    background: transparent;
    color: white;
    border-radius: 8px;
    font-weight: 500;
    text-align: left;

    &--small {
      padding: 6px 10px;
    }

    &--medium {
      padding: 8px 14px;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    /* -------- Variants -------- */
    &--ghost {
      &:hover {
        background: fade(white, 8%);
        transform: translateY(-1px);
      }
    }

    &--filled {
      background: fade(@primary-500, 25%);
      &:hover {
        background: fade(@primary-500, 35%);
        transform: translateY(-1px);
      }
    }

    &--active,
    &.is-active {
      background: fade(@primary-500, 25%);
      color: white;
      transform: translateY(-1px);
    }

    &.is-disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
</style>
