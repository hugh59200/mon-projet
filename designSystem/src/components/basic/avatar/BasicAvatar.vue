<template>
  <div :class="['avatar', `avatar--${avatarSize}`, `avatar--${type}`]">
    <slot
      v-if="type === 'icon'"
      name="icon"
    >
      <BasicIcon :name="iconName" />
    </slot>
    <slot
      v-else-if="type === 'media'"
      name="media"
    >
      <img :src="imageUrl" />
    </slot>
    <slot
      v-else-if="type === 'name'"
      name="name"
    >
      <BasicText
        :size="sizeClassMapping[avatarSize]"
        weight="bold"
        wrap
      >
        {{ getInitials(name) }}
      </BasicText>
    </slot>
    <slot
      v-else-if="type === 'date'"
      name="date"
    >
      <div class="date-container">
        <div class="date-day">
          <BasicText
            color="danger-400"
            size="body-xl"
            weight="bold"
          >
            {{ dayAndMounth?.day ?? '21' }}
          </BasicText>
        </div>
        <BasicText
          class="date-month"
          size="body-s"
          color="white"
        >
          {{ dayAndMounth?.mounth ?? 'Mars' }}
        </BasicText>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
  import type { AvatarProps, AvatarSize, TextSize } from '@designSystem/components'

  withDefaults(defineProps<AvatarProps>(), {
    name: '',
    iconName: undefined,
    imageUrl: '',
    avatarSize: 'large',
    type: 'name',
  })

  const sizeClassMapping: Record<AvatarSize, TextSize> = {
    'extra-small': 'body-s',
    small: 'body-m',
    medium: 'body-l',
    large: 'body-xl',
    'extra-large': 'h1',
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return ''
    const names = name.split(' ')
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join('')
    return initials
  }
</script>

<style lang="less">
  @import './BasicAvatar.less';

  .date-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .date-day {
    align-items: center;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  .date-month {
    // background-color: @brick_red-600;
    padding: 3px 0;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    text-transform: none;
  }
</style>
