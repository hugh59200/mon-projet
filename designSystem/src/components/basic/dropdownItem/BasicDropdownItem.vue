<template>
  <div
    :class="[
      'dropdown-item',
      { 'dropdown-item--active': active, 'dropdown-item--highlighted': highlighted },
      `dropdown-item--${size}`,
    ]"
    @click="handleClick"
    @keydown="handleKeydown"
    tabindex="0"
    role="option"
    :aria-selected="active"
  >
    <slot>
      <BasicIcon
        v-if="iconName"
        :name="iconName"
        :class="['icon', `icon--${size}`]"
      />
      <BasicText class="dropdown-item__label">
        {{ label }}
      </BasicText>
    </slot>
  </div>
</template>

<script setup lang="ts">
  import { type DropdownItemProps } from '@designSystem/components'
  import { inject } from 'vue'

  const closeDropdown = inject<(force?: boolean) => void>('closeDropdown', () => {})

  const handleClick = () => {
    emit('select', props.label)
    closeDropdown()
  }

  const props = withDefaults(defineProps<DropdownItemProps>(), {
    iconName: undefined,
    size: 'medium',
    active: false,
    highlighted: false,
  })

  const emit = defineEmits(['select'])

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }
</script>

<style lang="less">
  @import './BasicDropdownItem.less';
</style>
