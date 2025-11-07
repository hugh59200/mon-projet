<template>
  <component
    :is="iconComponent"
    v-bind="computedProps"
    class="basic-icon-next"
    :class="[
      colorClass,
      {
        'basic-icon-next--pointer': pointer,
        'basic-icon-next--not-allowed': disabled && !pointer,
        'basic-icon-next--disabled': disabled,
        'basic-icon-next--active': active,
      },
    ]"
  />
</template>

<script setup lang="ts">
  import type { IconName } from '@designSystem/fondation/icons/iconsList'
  import * as LucideIcons from 'lucide-vue-next'
  import { computed, type Component } from 'vue'

  export type IconNameNext = keyof typeof LucideIcons | IconName

  export type IconColor =
    | 'white'
    | 'black'
    | 'neutral-50'
    | 'neutral-100'
    | 'neutral-200'
    | 'neutral-300'
    | 'neutral-400'
    | 'neutral-500'
    | 'neutral-600'
    | 'neutral-700'
    | 'neutral-800'
    | 'neutral-900'
    | 'primary-50'
    | 'primary-100'
    | 'primary-200'
    | 'primary-300'
    | 'primary-400'
    | 'primary-500'
    | 'primary-600'
    | 'primary-700'
    | 'primary-800'
    | 'primary-900'
    | 'secondary-50'
    | 'secondary-100'
    | 'secondary-200'
    | 'secondary-300'
    | 'secondary-400'
    | 'secondary-500'
    | 'secondary-600'
    | 'secondary-700'
    | 'secondary-800'
    | 'secondary-900'
    | 'secondary-1000'
    | 'pink-50'
    | 'pink-100'
    | 'pink-200'
    | 'pink-300'
    | 'pink-400'
    | 'pink-500'
    | 'pink-600'
    | 'pink-700'
    | 'pink-800'
    | 'pink-900'
    | 'danger-50'
    | 'danger-100'
    | 'danger-200'
    | 'danger-300'
    | 'danger-400'
    | 'danger-500'
    | 'danger-600'
    | 'danger-700'
    | 'danger-800'
    | 'danger-900'
    | 'success-50'
    | 'success-100'
    | 'success-200'
    | 'success-300'
    | 'success-400'
    | 'success-500'
    | 'success-600'
    | 'success-700'
    | 'success-800'
    | 'success-900'
    | 'warning-50'
    | 'warning-100'
    | 'warning-200'
    | 'warning-300'
    | 'warning-400'
    | 'warning-500'
    | 'warning-600'
    | 'warning-700'
    | 'warning-800'
    | 'warning-900'
    | 'info-50'
    | 'info-100'
    | 'info-200'
    | 'info-300'
    | 'info-400'
    | 'info-500'
    | 'info-600'
    | 'info-700'
    | 'info-800'
    | 'info-900'

  interface IconNextProps {
    name: IconNameNext
    size?: number
    color?: IconColor | string
    strokeWidth?: number
    pointer?: boolean
    disabled?: boolean
    active?: boolean
  }

  const props = withDefaults(defineProps<IconNextProps>(), {
    size: 20,
    color: 'currentColor',
    strokeWidth: 1.5,
    pointer: false,
    disabled: false,
    active: false,
  })

  // ✅ Sélection dynamique de l’icône Lucide
  const iconComponent = computed(() => {
    const capitalizedName = props.name.charAt(0).toUpperCase() + props.name.slice(1)
    return (
      (LucideIcons[capitalizedName as keyof typeof LucideIcons] as Component) ||
      LucideIcons.HelpCircle
    )
  })

  // ✅ Props Lucide dynamiques (jamais de "fill")
  const computedProps = computed(() => {
    const isHex = /^#|rgb|hsl/i.test(props.color)
    return {
      size: props.size,
      stroke: isHex ? props.color : 'currentColor',
      color: isHex ? props.color : 'currentColor',
      'stroke-width': props.strokeWidth,
    }
  })

  // ✅ Classe dynamique pour tokens (primary-600, etc.)
  const colorClass = computed(() => {
    if (!props.color) return null
    const isDesignToken = /^[a-zA-Z]+-\d{2,4}$/.test(props.color)
    return isDesignToken ? `basic-icon-next--color--${props.color}` : null
  })
</script>

<style scoped lang="less">
  .basic-icon-next {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    opacity: 0;
    animation: fadeIn 0.25s ease forwards;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease,
      stroke 0.25s ease,
      color 0.25s ease;
    fill: transparent !important;

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

    &--active {
      stroke-width: 1.8;
    }

    &:focus {
      outline: none;
      box-shadow: @focus-global;
    }
  }

  /* Basics */
  .basic-icon-next--color--white {
    color: @white;
  }
  .basic-icon-next--color--black {
    color: @black;
  }

  /* Neutral */
  .basic-icon-next--color--neutral-50 {
    color: @neutral-50;
  }
  .basic-icon-next--color--neutral-100 {
    color: @neutral-100;
  }
  .basic-icon-next--color--neutral-200 {
    color: @neutral-200;
  }
  .basic-icon-next--color--neutral-300 {
    color: @neutral-300;
  }
  .basic-icon-next--color--neutral-400 {
    color: @neutral-400;
  }
  .basic-icon-next--color--neutral-500 {
    color: @neutral-500;
  }
  .basic-icon-next--color--neutral-600 {
    color: @neutral-600;
  }
  .basic-icon-next--color--neutral-700 {
    color: @neutral-700;
  }
  .basic-icon-next--color--neutral-800 {
    color: @neutral-800;
  }
  .basic-icon-next--color--neutral-900 {
    color: @neutral-900;
  }

  /* Primary */
  .basic-icon-next--color--primary-50 {
    color: @primary-50;
  }
  .basic-icon-next--color--primary-100 {
    color: @primary-100;
  }
  .basic-icon-next--color--primary-200 {
    color: @primary-200;
  }
  .basic-icon-next--color--primary-300 {
    color: @primary-300;
  }
  .basic-icon-next--color--primary-400 {
    color: @primary-400;
  }
  .basic-icon-next--color--primary-500 {
    color: @primary-500;
  }
  .basic-icon-next--color--primary-600 {
    color: @primary-600;
  }
  .basic-icon-next--color--primary-700 {
    color: @primary-700;
  }
  .basic-icon-next--color--primary-800 {
    color: @primary-800;
  }
  .basic-icon-next--color--primary-900 {
    color: @primary-900;
  }

  /* Secondary */
  .basic-icon-next--color--secondary-50 {
    color: @secondary-50;
  }
  .basic-icon-next--color--secondary-100 {
    color: @secondary-100;
  }
  .basic-icon-next--color--secondary-200 {
    color: @secondary-200;
  }
  .basic-icon-next--color--secondary-300 {
    color: @secondary-300;
  }
  .basic-icon-next--color--secondary-400 {
    color: @secondary-400;
  }
  .basic-icon-next--color--secondary-500 {
    color: @secondary-500;
  }
  .basic-icon-next--color--secondary-600 {
    color: @secondary-600;
  }
  .basic-icon-next--color--secondary-700 {
    color: @secondary-700;
  }
  .basic-icon-next--color--secondary-800 {
    color: @secondary-800;
  }
  .basic-icon-next--color--secondary-900 {
    color: @secondary-900;
  }
  .basic-icon-next--color--secondary-1000 {
    color: @secondary-1000;
  }

  /* Pink */
  .basic-icon-next--color--pink-50 {
    color: @pink-50;
  }
  .basic-icon-next--color--pink-100 {
    color: @pink-100;
  }
  .basic-icon-next--color--pink-200 {
    color: @pink-200;
  }
  .basic-icon-next--color--pink-300 {
    color: @pink-300;
  }
  .basic-icon-next--color--pink-400 {
    color: @pink-400;
  }
  .basic-icon-next--color--pink-500 {
    color: @pink-500;
  }
  .basic-icon-next--color--pink-600 {
    color: @pink-600;
  }
  .basic-icon-next--color--pink-700 {
    color: @pink-700;
  }
  .basic-icon-next--color--pink-800 {
    color: @pink-800;
  }
  .basic-icon-next--color--pink-900 {
    color: @pink-900;
  }

  /* Danger */
  .basic-icon-next--color--danger-50 {
    color: @danger-50;
  }
  .basic-icon-next--color--danger-100 {
    color: @danger-100;
  }
  .basic-icon-next--color--danger-200 {
    color: @danger-200;
  }
  .basic-icon-next--color--danger-300 {
    color: @danger-300;
  }
  .basic-icon-next--color--danger-400 {
    color: @danger-400;
  }
  .basic-icon-next--color--danger-500 {
    color: @danger-500;
  }
  .basic-icon-next--color--danger-600 {
    color: @danger-600;
  }
  .basic-icon-next--color--danger-700 {
    color: @danger-700;
  }
  .basic-icon-next--color--danger-800 {
    color: @danger-800;
  }
  .basic-icon-next--color--danger-900 {
    color: @danger-900;
  }

  /* Success */
  .basic-icon-next--color--success-50 {
    color: @success-50;
  }
  .basic-icon-next--color--success-100 {
    color: @success-100;
  }
  .basic-icon-next--color--success-200 {
    color: @success-200;
  }
  .basic-icon-next--color--success-300 {
    color: @success-300;
  }
  .basic-icon-next--color--success-400 {
    color: @success-400;
  }
  .basic-icon-next--color--success-500 {
    color: @success-500;
  }
  .basic-icon-next--color--success-600 {
    color: @success-600;
  }
  .basic-icon-next--color--success-700 {
    color: @success-700;
  }
  .basic-icon-next--color--success-800 {
    color: @success-800;
  }
  .basic-icon-next--color--success-900 {
    color: @success-900;
  }

  /* Warning */
  .basic-icon-next--color--warning-50 {
    color: @warning-50;
  }
  .basic-icon-next--color--warning-100 {
    color: @warning-100;
  }
  .basic-icon-next--color--warning-200 {
    color: @warning-200;
  }
  .basic-icon-next--color--warning-300 {
    color: @warning-300;
  }
  .basic-icon-next--color--warning-400 {
    color: @warning-400;
  }
  .basic-icon-next--color--warning-500 {
    color: @warning-500;
  }
  .basic-icon-next--color--warning-600 {
    color: @warning-600;
  }
  .basic-icon-next--color--warning-700 {
    color: @warning-700;
  }
  .basic-icon-next--color--warning-800 {
    color: @warning-800;
  }
  .basic-icon-next--color--warning-900 {
    color: @warning-900;
  }

  /* Info */
  .basic-icon-next--color--info-50 {
    color: @info-50;
  }
  .basic-icon-next--color--info-100 {
    color: @info-100;
  }
  .basic-icon-next--color--info-200 {
    color: @info-200;
  }
  .basic-icon-next--color--info-300 {
    color: @info-300;
  }
  .basic-icon-next--color--info-400 {
    color: @info-400;
  }
  .basic-icon-next--color--info-500 {
    color: @info-500;
  }
  .basic-icon-next--color--info-600 {
    color: @info-600;
  }
  .basic-icon-next--color--info-700 {
    color: @info-700;
  }
  .basic-icon-next--color--info-800 {
    color: @info-800;
  }
  .basic-icon-next--color--info-900 {
    color: @info-900;
  }

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
</style>
