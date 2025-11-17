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
   🌟 NAV BUTTON — Neural Glass v2
   ========================================================== */

  .nav-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;

    border: none;
    outline: none;
    cursor: pointer;
    background: transparent;

    border-radius: 10px;

    font-weight: 500;
    color: white;

    transition:
      background 0.25s ease,
      transform 0.25s ease,
      box-shadow 0.25s ease,
      opacity 0.2s ease;

    /* ----- SIZES ----- */
    &--small {
      padding: 6px 12px;
    }

    &--medium {
      padding: 8px 16px;
    }

    /* ----- ICON ----- */
    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 18px;
        height: 18px;
        opacity: 0.9;
        transition: opacity 0.25s ease;
      }
    }

    /* ======================================================
     VARIANT: GHOST (default)
     ====================================================== */
    &--ghost {
      background: fade(@secondary-900, 0%);

      &:hover {
        background: fade(@secondary-800, 25%);
        backdrop-filter: blur(4px);
        box-shadow: 0 0 8px fade(@primary-500, 20%);
        transform: translateY(-1px);
      }

      &.is-active {
        background: fade(@secondary-700, 35%);
        box-shadow:
          0 0 6px fade(@primary-500, 25%),
          inset 0 0 0 1px fade(@primary-500, 35%);
      }
    }

    /* ======================================================
     VARIANT: FILLED (subtle glass)
     ====================================================== */
    &--filled {
      background: linear-gradient(135deg, fade(@primary-700, 55%), fade(@primary-500, 45%));
      backdrop-filter: blur(4px);
      border: 1px solid fade(@primary-300, 18%);

      &:hover {
        background: linear-gradient(135deg, fade(@primary-700, 70%), fade(@primary-500, 60%));
        box-shadow: 0 0 10px fade(@primary-500, 30%);
        transform: translateY(-1px);
      }

      &.is-active {
        background: fade(@primary-700, 70%);
        box-shadow:
          0 0 6px fade(@primary-500, 40%),
          inset 0 0 0 1px fade(@primary-500, 50%);
      }
    }

    /* ======================================================
     VARIANT: ACTIVE (accent glow)
     ====================================================== */
    &--active {
      background: fade(@primary-600, 40%);
      backdrop-filter: blur(4px);

      box-shadow: 0 0 8px fade(@primary-400, 25%);

      &:hover {
        background: fade(@primary-600, 55%);
        box-shadow:
          0 0 12px fade(@primary-400, 32%),
          inset 0 0 0 1px fade(@primary-300, 25%);
        transform: translateY(-1px);
      }
    }

    /* ======================================================
     DISABLED
     ====================================================== */
    &.is-disabled {
      opacity: 0.45;
      pointer-events: none;
      filter: grayscale(50%);
    }
  }
</style>
