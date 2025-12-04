<template>
  <div class="premium-theme-selector">
    <div class="premium-theme-selector__options">
      <button
        v-for="option in themeOptions"
        :key="option.value.toString()"
        class="premium-theme-selector__option"
        :class="{
          'premium-theme-selector__option--active': modelValue === option.value,
        }"
        @click="selectTheme(option.value)"
      >
        <div class="premium-theme-selector__option-content">
          <!-- Gradient Background -->
          <div
            class="premium-theme-selector__gradient"
            :style="{ background: option.gradient }"
          ></div>

          <!-- Icon/Emoji -->
          <div class="premium-theme-selector__icon">
            {{ option.icon }}
          </div>

          <!-- Label -->
          <BasicText
            size="body-s"
            weight="semibold"
            :color="labelColor"
            class="premium-theme-selector__label"
          >
            {{ option.label }}
          </BasicText>

          <!-- Active Checkmark -->
          <div
            v-if="modelValue === option.value"
            class="premium-theme-selector__check"
          >
            <BasicIconNext
              name="Check"
              :size="14"
            />
          </div>

          <!-- Glow Effect on Active -->
          <div
            v-if="modelValue === option.value"
            class="premium-theme-selector__glow"
            :style="{ boxShadow: option.glow }"
          ></div>
        </div>

        <!-- Ripple Effect -->
        <span
          class="premium-theme-selector__ripple"
          :style="{ background: option.rippleColor }"
        ></span>
      </button>
    </div>

    <!-- Description -->
    <div class="premium-theme-selector__description">
      <BasicIconNext
        name="Sparkles"
        :size="16"
        class="premium-theme-selector__sparkle"
      />
      <BasicText
        size="body-s"
        :color="descriptionColor"
      >
        {{ activeThemeDescription }}
      </BasicText>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import type { TextColor } from '@designSystem/components/basic/text/BasicText.types'

  interface ThemeOption {
    value: boolean
    label: string
    icon: string
    gradient: string
    glow: string
    rippleColor: string
    description: string
  }

  const { labelColor = 'neutral-100', descriptionColor = 'neutral-400' } = defineProps<{
    labelColor?: TextColor
    descriptionColor?: TextColor
  }>()

  const modelValue = defineModel<boolean>({ required: true })

  const themeOptions: ThemeOption[] = [
    {
      value: false,
      label: 'Océan',
      icon: '🌊',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      glow: '0 0 40px rgba(102, 126, 234, 0.6), 0 0 80px rgba(102, 126, 234, 0.3)',
      rippleColor: 'rgba(102, 126, 234, 0.3)',
      description: 'Thème apaisant aux tons bleus et violets',
    },
    {
      value: true,
      label: 'Terreux',
      icon: '🏜️',
      gradient: 'linear-gradient(135deg, #d4a574 0%, #8b6f47 100%)',
      glow: '0 0 40px rgba(212, 165, 116, 0.6), 0 0 80px rgba(212, 165, 116, 0.3)',
      rippleColor: 'rgba(212, 165, 116, 0.3)',
      description: 'Thème chaleureux aux tons naturels',
    },
  ]

  const activeThemeDescription = computed(() => {
    return themeOptions.find((opt) => opt.value === modelValue.value)?.description || ''
  })

  function selectTheme(value: boolean) {
    modelValue.value = value
  }
</script>

<style lang="less" scoped>
  .premium-theme-selector {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    &__option {
      position: relative;
      background: rgba(var(--secondary-700-rgb), 0.4);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 0;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover:not(&--active) {
        transform: translateY(-4px);
        border-color: rgba(255, 255, 255, 0.2);
        background: rgba(var(--secondary-700-rgb), 0.6);

        .premium-theme-selector__gradient {
          opacity: 0.3;
          transform: scale(1.05);
        }

        .premium-theme-selector__icon {
          transform: scale(1.05) rotate(5deg);
        }
      }

      &--active {
        border-color: rgba(255, 255, 255, 0.3);
        background: rgba(var(--secondary-600-rgb), 0.5);
        transform: scale(1.02);

        .premium-theme-selector__gradient {
          opacity: 0.5;
        }

        .premium-theme-selector__icon {
          transform: scale(1.08);
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
        }

        .premium-theme-selector__glow {
          opacity: 1;
        }

        .premium-theme-selector__check {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
      }

      &:active {
        transform: scale(0.98);

        .premium-theme-selector__ripple {
          transform: scale(2);
          opacity: 0;
        }
      }
    }

    &__option-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 20px;
      gap: 12px;
      z-index: 2;
    }

    &__gradient {
      position: absolute;
      inset: 0;
      opacity: 0.15;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
    }

    &__icon {
      font-size: 48px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 3;
      user-select: none;
    }

    &__label {
      text-transform: uppercase;
      letter-spacing: 1px;
      z-index: 3;
      transition: all 0.3s ease;
    }

    &__check {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, var(--primary-400), var(--primary-500));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      opacity: 0;
      transform: scale(0) rotate(-180deg);
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 4;
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.2),
        0 0 0 3px rgba(255, 255, 255, 0.1);
    }

    &__glow {
      position: absolute;
      inset: -2px;
      border-radius: 16px;
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
      z-index: 0;
    }

    &__ripple {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      transform: scale(0);
      opacity: 0.5;
      transition:
        transform 0.6s ease,
        opacity 0.6s ease;
      pointer-events: none;
    }

    &__description {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      background: rgba(var(--secondary-800-rgb), 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    &__sparkle {
      color: var(--primary-400);
      animation: sparkle 2s ease-in-out infinite;
    }

    @keyframes sparkle {
      0%,
      100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.05) rotate(20deg);
      }
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      &__options {
        grid-template-columns: 1fr;
      }

      &__option-content {
        padding: 28px 16px;
      }

      &__icon {
        font-size: 40px;
      }
    }
  }
</style>
