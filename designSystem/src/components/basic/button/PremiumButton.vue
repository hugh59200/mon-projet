<template>
  <button
    :type="htmlType"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Effet Shine -->
    <span
      v-if="shine && !loading"
      class="pbtn__shine"
    ></span>

    <!-- Effet Glow -->
    <span
      v-if="glow"
      class="pbtn__glow"
    ></span>

    <!-- Contenu normal -->
    <span
      v-if="!loading"
      class="pbtn__content"
    >
      <BasicIconNext
        v-if="iconLeft"
        :name="iconLeft"
        :size="iconSize"
        class="pbtn__icon pbtn__icon--left"
      />
      <span
        v-if="label"
        class="pbtn__label"
      >
        {{ label }}
      </span>
      <span
        v-if="badge !== undefined"
        class="pbtn__badge"
      >
        {{ badge }}
      </span>
      <BasicIconNext
        v-if="iconRight"
        :name="iconRight"
        :size="iconSize"
        class="pbtn__icon pbtn__icon--right"
      />
    </span>

    <!-- État Loading -->
    <span
      v-else
      class="pbtn__loading"
    >
      <span class="pbtn__loader">
        <span class="pbtn__loader-ring"></span>
        <BasicIconNext
          :name="loadingIcon"
          :size="loaderIconSize"
          class="pbtn__loader-icon"
        />
      </span>
      <span
        v-if="loadingText"
        class="pbtn__loading-text"
      >
        {{ loadingText }}
        <span
          v-if="showLoadingDots"
          class="pbtn__loading-dots"
        >
          <span></span>
          <span></span>
          <span></span>
        </span>
      </span>
    </span>

    <!-- Barre de progression -->
    <span
      v-if="loading && showLoadingProgress"
      class="pbtn__progress"
    ></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PremiumButtonProps, PremiumButtonSize } from './PremiumButton.types'

const props = withDefaults(defineProps<PremiumButtonProps>(), {
  type: 'primary',
  htmlType: 'button',
  size: 'md',
  variant: 'solid',
  width: 'auto',
  label: '',
  iconLeft: undefined,
  iconRight: undefined,
  badge: undefined,
  disabled: false,
  loading: false,
  active: false,
  shine: true,
  glow: false,
  pulse: false,
  loadingText: '',
  loadingIcon: 'Shield',
  showLoadingProgress: true,
  showLoadingDots: true,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Classes dynamiques
const buttonClasses = computed(() => [
  'pbtn',
  `pbtn--${props.type}`,
  `pbtn--${props.variant}`,
  `pbtn--${props.size}`,
  `pbtn--${props.width}`,
  {
    'pbtn--loading': props.loading,
    'pbtn--disabled': props.disabled,
    'pbtn--active': props.active,
    'pbtn--glow': props.glow,
    'pbtn--pulse': props.pulse,
    'pbtn--icon-only': !props.label && (props.iconLeft || props.iconRight),
  },
])

// Taille des icônes selon la taille du bouton
const iconSizeMap: Record<PremiumButtonSize, number> = {
  xl: 22,
  lg: 20,
  md: 18,
  sm: 16,
  xs: 14,
}

const loaderIconSizeMap: Record<PremiumButtonSize, number> = {
  xl: 18,
  lg: 16,
  md: 14,
  sm: 12,
  xs: 10,
}

const iconSize = computed(() => iconSizeMap[props.size])
const loaderIconSize = computed(() => loaderIconSizeMap[props.size])

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style lang="less">
@import './PremiumButton.less';
</style>
