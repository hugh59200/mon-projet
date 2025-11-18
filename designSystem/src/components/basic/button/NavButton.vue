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
      background: color-mix(in srgb, var(--secondary-900) 0%, transparent);

      &:hover {
        background: color-mix(in srgb, var(--secondary-800) 25%, transparent);
        backdrop-filter: blur(4px);
        box-shadow: 0 0 8px color-mix(in srgb, var(--primary-500) 20%, transparent);
        transform: translateY(-1px);
      }

      &.is-active {
        background: color-mix(in srgb, var(--secondary-700) 35%, transparent);
        box-shadow:
          0 0 6px color-mix(in srgb, var(--primary-500) 25%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-500) 35%, transparent);
      }
    }

    /* ======================================================
     VARIANT: FILLED (subtle glass)
     ====================================================== */
    &--filled {
      background: linear-gradient(135deg, color-mix(in srgb, var(--primary-700) 55%, transparent), color-mix(in srgb, var(--primary-500) 45%, transparent));
      backdrop-filter: blur(4px);
      border: 1px solid color-mix(in srgb, var(--primary-300) 18%, transparent);

      &:hover {
        background: linear-gradient(135deg, color-mix(in srgb, var(--primary-700) 70%, transparent), color-mix(in srgb, var(--primary-500) 60%, transparent));
        box-shadow: 0 0 10px color-mix(in srgb, var(--primary-500) 30%, transparent);
        transform: translateY(-1px);
      }

      &.is-active {
        background: color-mix(in srgb, var(--primary-700) 70%, transparent);
        box-shadow:
          0 0 6px color-mix(in srgb, var(--primary-500) 40%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-500) 50%, transparent);
      }
    }

    /* ======================================================
     VARIANT: ACTIVE (accent glow)
     ====================================================== */
    &--active {
      background: color-mix(in srgb, var(--primary-600) 40%, transparent);
      backdrop-filter: blur(4px);

      box-shadow: 0 0 8px color-mix(in srgb, var(--primary-400) 25%, transparent);

      &:hover {
        background: color-mix(in srgb, var(--primary-600) 55%, transparent);
        box-shadow:
          0 0 12px color-mix(in srgb, var(--primary-400) 32%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-300) 25%, transparent);
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
