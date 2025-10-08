<template>
  <div
    :class="[
      'toggle-switch',
      `toggle-switch--${size}`,
      { 'toggle-switch--disabled': disabled },
      { 'toggle-switch--readonly': readonly },
      { 'toggle-switch--focusable': allowFocusable },
    ]"
  >
    <label
      v-for="(item, index) in internalItems"
      :key="index"
      :class="[
        'toggle-switch__button',
        { 'toggle-switch__button--active': isSelected(item.id) },
        { 'toggle-switch__button--disabled': item.disabled },
      ]"
    >
      <input
        type="radio"
        v-model="toggleKey"
        :value="item.id"
        :disabled="readonly || disabled || item.disabled"
      />
      <BasicText
        :size="textSize"
        :weight="isSelected(item.id) ? 'bold' : 'regular'"
        wrap-all
      >
        {{ item.label }}
      </BasicText>
    </label>
  </div>
</template>

<script setup lang="ts" generic="TToggleItem = ToggleItem, TToggleKey extends ToggleId = ToggleId">
  import { computed } from 'vue'
  import type { ToggleSwitchProps, ToggleSize, TextSize, ToggleId, ToggleItem } from '@designSystem/components'

  const props = withDefaults(defineProps<ToggleSwitchProps<TToggleItem>>(), {
    size: 'medium' as ToggleSize,
    disabled: false,
    readonly: false,
    items: () => [] as TToggleItem[],
  })

  const toggleKey = defineModel<TToggleKey>()

  const internalItems = computed(() => {
    const intKeyId = props.keyId ?? 'id'
    const intKeyLabel = props.keyLabel ?? 'label'

    return (
      props.items?.map((item) => {
        const id = (item as any)[intKeyId]
        const label = (item as any)[intKeyLabel]
        const disabled = (item as ToggleItem).disabled ?? false
        return { id, label, disabled }
      }) ?? []
    )
  })

  const textSize = computed<TextSize>(() => {
    const mapping: Record<ToggleSize, TextSize> = {
      small: 'body-s',
      medium: 'body-m',
      large: 'body-l',
    }
    return mapping[props.size]
  })

  const isSelected = (id: ToggleId) => toggleKey.value === id

  const allowFocusable = computed(() => internalItems.value.every((item) => !item.disabled))
</script>

<style lang="less">
  @import './BasicToggleSwitch.less';
</style>
