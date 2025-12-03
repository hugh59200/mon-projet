<template>
  <div :class="['dropdown__button', `dropdown__button--${size}`, { 'dropdown__button--disabled': disabled }]">
    <PremiumButton
      :label
      :active
      :type
      icon-right="ArrowDown"
      :disabled
      :size="size === 'large' ? 'lg' : size === 'medium' ? 'md' : 'sm'"
      @click="toggleDropdownButton"
      :class="['dropdown__button__content', { 'dropdown__button--open': isOpen }]"
    />
    <ClickOutside
      v-if="isOpen && !disabled"
      @close="closeFromOutside"
      class="dropdown__menu"
    >
      <BasicDropdownItem
        v-for="(item, index) in computedItems"
        :key="index"
        :label="item.label"
        :size
        @select="selectItem(item)"
      />
    </ClickOutside>
  </div>
</template>

<script setup lang="ts" generic="TDropdownButtonItem extends object = DropdownButtonItem">
  import { computed, ref } from 'vue'
  import type { DropdownButtonProps, DropdownButtonItem } from '@designSystem/components'

  const props = withDefaults(defineProps<DropdownButtonProps<TDropdownButtonItem>>(), {
    label: 'Button',
    size: 'medium',
    disabled: false,
    iconRight: false,
    items: () => [] as TDropdownButtonItem[],
  })

  const emit = defineEmits<{
    (e: 'selectItem', value: any): void
  }>()

  const isOpen = ref(false)
  const isClosingFromOutside = ref(false)

  const computedItems = computed(() => {
    const intKeyId = props.keyId ?? 'id'
    const intKeyLabel = props.keyLabel ?? 'label'
    return props.items.map(
      (item) =>
        ({
          id: (item as any)[intKeyId],
          label: (item as any)[intKeyLabel],
        }) as DropdownButtonItem,
    )
  })

  const toggleDropdownButton = () => {
    if (!props.disabled && !isClosingFromOutside.value) {
      isOpen.value = !isOpen.value
    }
    isClosingFromOutside.value = false
  }

  const closeFromOutside = () => {
    if (isOpen.value) {
      isClosingFromOutside.value = true
      isOpen.value = false
    }
  }

  const selectItem = (item: DropdownButtonItem) => {
    isOpen.value = false
    emit('selectItem', item.id)
  }
</script>
<style lang="less">
  @import './BasicDropdownButton.less';
</style>
