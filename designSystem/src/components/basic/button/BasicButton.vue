<template>
  <button
    type="button"
    :class="[
      'btn',
      `btn--${type}`,
      `btn--${variant}`,
      `btn--${size}`,
      `btn--${width}`,
      {
        'btn--icon-right': iconRight,
        'is-active': active,
        'is-disabled': disabled,
      },
    ]"
    :disabled
  >
    <span
      class="icon-container"
      v-if="iconName"
    >
      <BasicIconNext
        :name="iconName"
        :active
      />
    </span>
    <BasicText
      v-if="label"
      class="btn__label"
      :size="textSizeMapping[size]"
      nb-max-lines="2"
    >
      {{ label }}
    </BasicText>
  </button>
</template>

<script setup lang="ts">
  import type { ButtonProps, ButtonSize, TextSize } from '@designSystem/components'

  withDefaults(defineProps<ButtonProps>(), {
    type: 'primary',
    size: 'medium',
    variant: 'filled',
    width: 'auto',
    label: '',
    iconName: undefined,
    iconRight: false,
    disabled: false,
    active: false,
  })

  const textSizeMapping: Record<ButtonSize, TextSize> = {
    large: 'body-xl',
    medium: 'body-l',
    small: 'body-m',
  }
</script>

<style lang="less">
  @import './BasicButton.less';
</style>
