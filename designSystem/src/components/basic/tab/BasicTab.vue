<template>
  <div
    ref="tabRef"
    class="tab"
    :class="{ 'tab--selected': isSelected, 'tab--unselected': !isSelected }"
    @click="handleSelect"
  >
    <BasicText
      :wrap-all="!isSelected"
      :nb-max-lines="isSelected ? '2' : '1'"
      :size="isSelected ? 'body-l' : 'body-m'"
      :weight="isSelected ? 'semibold' : 'regular'"
      class="tab__label"
      :style="{ color: textColor }"
    >
      <slot
        name="tab-text"
        :tabKey="tabKey"
        :tabState="tabState"
        :selected="isSelected"
      />
      <template v-if="!$slots['tab-text']">{{ tabKey }}</template>
    </BasicText>

    <slot
      name="tab-icon"
      :tabKey="tabKey"
      :tabState="tabState"
      :selected="isSelected"
    />
    <BasicIconNext
      v-if="!$slots['tab-icon'] && tabState"
      class="tab__icon"
      :name="tabState"
      :color="iconColor"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { TabProps } from './BasicTab.types'

  const props = defineProps<TabProps>()
  const modelValue = defineModel<string | number | null | undefined>()

  const isSelected = computed(
    () => modelValue.value === props.routeName || modelValue.value === props.tabKey,
  )

  const handleSelect = () => {
    modelValue.value = props.routeName ?? props.tabKey
  }

  const textColor = computed(() => (isSelected.value && props.color ? props.color : ''))

  const iconColor = computed(
    () => (isSelected.value ? props.color : '#9CA3AF'), // ✅ gris explicite
  )
</script>

<style scoped lang="less">
  .tab {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 10px 22px;
    gap: 8px;
    border-radius: 10px 10px 0 0;
    cursor: pointer;
    transition: all 0.25s ease;
    background-color: fade(@neutral-100, 50%);
    color: @neutral-600;
    user-select: none;

    &__icon {
      transform: scale(0.9);
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    &:hover {
      background-color: fade(@neutral-200, 80%);
      color: @primary-700;
      box-shadow: 0 1px 6px fade(@neutral-700, 10%);
    }

    &--selected {
      background-color: @white;
      color: @primary-700;
      font-weight: 600;
      z-index: 3;
      box-shadow: 0 -1px 8px fade(@primary-600, 25%);
      .tab__icon {
        opacity: 1;
        fill: currentColor;
        stroke: currentColor;
      }
    }

    &--unselected {
      color: @neutral-500;
      box-shadow: inset 0 -2px 0 fade(@neutral-300, 50%);
    }
  }
</style>
