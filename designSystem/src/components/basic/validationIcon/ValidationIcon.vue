<!--
  Icône de validation animée PREMIUM
  Style grands retailers (Apple, Amazon, Stripe)

  Features:
  - Animation fluide entre les états
  - 4 états: idle, loading, valid, invalid
  - Support SVG animé
  - Transitions premium
-->
<template>
  <div
    class="validation-icon"
    :class="[
      `validation-icon--${status}`,
      { 'validation-icon--visible': status !== 'idle' }
    ]"
  >
    <Transition name="validation-icon" mode="out-in">
      <!-- Loading spinner -->
      <svg
        v-if="status === 'validating'"
        key="loading"
        class="validation-icon__spinner"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-dasharray="60"
          stroke-dashoffset="20"
        />
      </svg>

      <!-- Check icon (valid) -->
      <svg
        v-else-if="status === 'valid'"
        key="valid"
        class="validation-icon__check"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="currentColor"
          class="validation-icon__circle"
        />
        <path
          d="M8 12.5L10.5 15L16 9"
          stroke="white"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="validation-icon__checkmark"
        />
      </svg>

      <!-- X icon (invalid) -->
      <svg
        v-else-if="status === 'invalid'"
        key="invalid"
        class="validation-icon__x"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="currentColor"
          class="validation-icon__circle"
        />
        <path
          d="M15 9L9 15M9 9L15 15"
          stroke="white"
          stroke-width="2.5"
          stroke-linecap="round"
          class="validation-icon__xmark"
        />
      </svg>

      <!-- Empty state -->
      <span v-else key="idle" class="validation-icon__empty" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { ValidationStatus } from '@/composables/validation'

defineProps<{
  status: ValidationStatus
}>()
</script>

<style scoped lang="less">
.validation-icon {
  --size: 20px;
  --transition-duration: 0.25s;
  --transition-easing: cubic-bezier(0.34, 1.56, 0.64, 1);

  width: var(--size);
  height: var(--size);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition:
    opacity var(--transition-duration) ease,
    transform var(--transition-duration) var(--transition-easing);

  &--visible {
    opacity: 1;
    transform: scale(1);
  }

  // États de couleur
  &--validating {
    color: var(--color-primary-500);
  }

  &--valid {
    color: var(--color-success-500);
  }

  &--invalid {
    color: var(--color-danger-500);
  }

  // SVG styling
  svg {
    width: 100%;
    height: 100%;
  }

  // Spinner animation
  &__spinner {
    animation: spin 1s linear infinite;

    circle {
      transform-origin: center;
    }
  }

  // Check animation
  &__check {
    .validation-icon__circle {
      animation: scaleIn 0.3s var(--transition-easing) forwards;
    }

    .validation-icon__checkmark {
      stroke-dasharray: 20;
      stroke-dashoffset: 20;
      animation: drawCheck 0.3s ease-out 0.15s forwards;
    }
  }

  // X animation
  &__x {
    .validation-icon__circle {
      animation: scaleIn 0.3s var(--transition-easing) forwards;
    }

    .validation-icon__xmark {
      stroke-dasharray: 20;
      stroke-dashoffset: 20;
      animation: drawX 0.3s ease-out 0.15s forwards;
    }
  }

  &__empty {
    display: block;
    width: 100%;
    height: 100%;
  }
}

// Animations
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes drawCheck {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes drawX {
  to {
    stroke-dashoffset: 0;
  }
}

// Transition entre les états
.validation-icon-enter-active,
.validation-icon-leave-active {
  transition: all 0.2s var(--transition-easing);
}

.validation-icon-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-90deg);
}

.validation-icon-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(90deg);
}
</style>
