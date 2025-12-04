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
    return 'neutral-600'
  })
</script>

<style scoped lang="less">
  .tab {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
    gap: 8px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: transparent;
    user-select: none;
    position: relative;
    overflow: hidden;
    font-weight: 600;
    font-size: 13px;

    // Effet de hover subtil
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        transparent 0%,
        color-mix(in srgb, var(--primary-500) 5%, transparent) 100%
      );
      opacity: 0;
      transition: opacity 0.2s ease;
      border-radius: 12px;
    }

    &:hover:not(.tab--selected) {
      background: @neutral-100;

      &::before {
        opacity: 1;
      }

      .tab__label {
        color: @neutral-700 !important;
      }
    }

    &--selected {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      box-shadow:
        0 2px 8px color-mix(in srgb, var(--primary-600) 30%, transparent),
        0 4px 16px color-mix(in srgb, var(--primary-700) 20%, transparent);

      .tab__label {
        color: white !important;
      }

      .tab__icon {
        color: white !important;
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow:
          0 4px 12px color-mix(in srgb, var(--primary-600) 40%, transparent),
          0 6px 20px color-mix(in srgb, var(--primary-700) 25%, transparent);
      }
    }
  }
</style>
