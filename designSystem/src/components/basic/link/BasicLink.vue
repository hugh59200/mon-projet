<template>
  <span
    :class="[
      'standalone-link',
      `standalone-link--${type}`,
      `standalone-link--${size}`,
      {
        'standalone-link--with-icon': state === 'icon-left' || state === 'icon-right',
        'standalone-link--text-only': !state || state === 'text-only',
        'standalone-link--disabled': disabled,
      },
    ]"
    @click.stop="!disabled ? $emit('link-click') : undefined"
  >
    <BasicIcon
      v-if="state === 'icon-left'"
      :name="iconName?.length ? 'arrow-up' : 'arrow-right'"
      :active="iconName?.length > 0"
    />
    <BasicText
      v-if="label"
      class="standalone-link__label"
      :size="textSizeMapping[size]"
      :wrap="wrapLink"
      :nb-max-lines
      :wrap-all
    >
      {{ label }}
    </BasicText>
    <BasicIcon
      v-if="state === 'icon-right'"
      name="arrow-right"
    />
  </span>
</template>

<script setup lang="ts">
  import type { LinkSize, StandaloneLinkProps, TextSize } from '@designSystem/components'

  withDefaults(defineProps<StandaloneLinkProps>(), {
    state: 'text-only',
    type: 'primary',
    size: 'medium',
    iconName: undefined,
    wrapLink: false,
    wrapAll: false,
    disabled: false,
    nbMaxLines: undefined,
  })

  defineEmits(['link-click'])

  const textSizeMapping: Record<LinkSize, TextSize> = {
    large: 'body-xl',
    medium: 'body-l',
    small: 'body-m',
  }
</script>

<style lang="less">
  @import './BasicLink.less';
</style>
