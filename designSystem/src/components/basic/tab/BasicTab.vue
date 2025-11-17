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
      :color="computedTextColor"
    >
      {{ tabKey }}
    </BasicText>

    <slot
      name="tab-icon"
      :tabKey="tabKey"
      :selected="isSelected"
    />

    <!-- ✅ Couleur icône selon sélection -->
    <BasicIconNext
      v-if="!$slots['tab-icon'] && icon"
      class="tab__icon"
      :name="icon"
      :color="isSelected ? color : ('neutral-600' as IconColor)"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { IconColor } from '../icon'
  import type { TextColor } from '../text'
  import type { TabProps } from './BasicTab.types'

  const props = defineProps<TabProps>()
  const modelValue = defineModel<string | number | null | undefined>()

  const isSelected = computed(
    () => modelValue.value === props.routeName || modelValue.value === props.tabKey,
  )

  const handleSelect = () => {
    modelValue.value = props.routeName ?? props.tabKey
  }

  // ✅ Couleur du texte (normal / sélectionné)
  const computedTextColor = computed<TextColor>(() => {
    if (isSelected.value && props.color) return props.color
    return 'neutral-400'
  })
</script>

<style scoped lang="less">
  .tab {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 22px;
    gap: 8px;
    border-radius: 10px 10px 0 0;
    cursor: pointer;
    transition: all 0.25s ease;
    background: fade(@secondary-900, 75%);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    border: 1px solid fade(@neutral-300, 25%);
    user-select: none;

    /* ✅ Hover sur onglet non sélectionné */
    &:hover {
      background: fade(@secondary-700, 75%);

      &:not(.tab--selected) {
        .tab__label {
          color: @white !important;
          transition: color 0.25s ease;
        }

        .tab__icon {
          color: @white !important;
          transition: color 0.25s ease;
        }
      }
    }

    &--selected {
      background: fade(@secondary-500, 75%);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px 22px;
      box-shadow: inset 0 1px 3px fade(@primary-500, 12%);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        background 0.25s ease,
        color 0.25s ease,
        opacity 0.18s ease;
    }
  }
</style>
