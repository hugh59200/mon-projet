<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :disabled="disabled"
    class="standalone-link"
    :class="[
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
    <BasicIconNext
      v-if="state === 'icon-left'"
      :name="iconName || 'ArrowLeft'"
      class="icon-left"
    />

    <slot>
      <BasicText
        v-if="label"
        class="standalone-link__label"
        :size="textSizeMapping[size]"
        :wrap="wrapLink"
        :nb-max-lines="nbMaxLines"
        :wrap-all="wrapAll"
      >
        {{ label }}
      </BasicText>
    </slot>

    <BasicIconNext
      v-if="state === 'icon-right'"
      :name="iconName || 'ArrowRight'"
      class="icon-right"
    />
  </component>
</template>

<script setup lang="ts">
  import type { LinkSize, StandaloneLinkProps, TextSize } from '@designSystem/components'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<
      StandaloneLinkProps & {
        to?: string
        href?: string
      }
    >(),
    {
      state: 'icon-left',
      type: 'primary',
      size: 'medium',
      iconName: undefined,
      wrapLink: false,
      wrapAll: false,
      disabled: false,
      nbMaxLines: undefined,
      to: undefined,
      href: undefined,
    },
  )

  defineEmits(['link-click'])

  const tag = computed(() => (props.to ? 'RouterLink' : props.href ? 'a' : 'span'))

  const textSizeMapping: Record<LinkSize, TextSize> = {
    large: 'body-xl',
    medium: 'body-l',
    small: 'body-m',
  }
</script>

<style scoped lang="less">
  @import './BasicLink.less';

  /* ✅ Améliorations UX / UI */
  .standalone-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    line-height: 1.4;
    transition:
      color 0.2s ease,
      transform 0.2s ease;

    &--with-icon {
      svg {
        transition: transform 0.25s ease;
      }

      &:hover .icon-left {
        transform: translateX(-4px);
      }

      &:hover .icon-right {
        transform: translateX(4px);
      }
    }

    &--disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
</style>
