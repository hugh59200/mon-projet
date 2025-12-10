<template>
  <div
    ref="tabRef"
    class="tab"
    :class="{ 'tab--selected': isSelected, 'tab--unselected': !isSelected }"
    @click="handleSelect"
  >
    <!-- Icône (visible en mobile, cachée en desktop sauf si sélectionné) -->
    <BasicIconNext
      v-if="!$slots['tab-icon'] && icon"
      class="tab__icon"
      :name="icon"
      :size="20"
    />

    <slot
      name="tab-icon"
      :tabKey="tabKey"
      :selected="isSelected"
    />

    <span class="tab__label">{{ tabKey }}</span>
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
</script>

<style scoped lang="less">
  @import '@designSystem/fondation/breakpoints/responsive-mixins.less';

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

    &__label {
      font-weight: 500;
      font-size: 13px;
      color: @neutral-600;
      transition: color 0.2s ease;
      white-space: nowrap;
    }

    &__icon {
      display: none;
      flex-shrink: 0;
      color: @neutral-500;
      transition: color 0.2s ease;
    }

    // Hover desktop
    &:hover:not(.tab--selected) {
      background: @neutral-100;

      .tab__label {
        color: @neutral-700;
      }
    }

    // État sélectionné
    &--selected {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      box-shadow:
        0 2px 8px color-mix(in srgb, var(--primary-600) 30%, transparent),
        0 4px 16px color-mix(in srgb, var(--primary-700) 20%, transparent);

      .tab__label {
        color: white;
        font-weight: 600;
      }

      .tab__icon {
        color: white;
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow:
          0 4px 12px color-mix(in srgb, var(--primary-600) 40%, transparent),
          0 6px 20px color-mix(in srgb, var(--primary-700) 25%, transparent);
      }
    }

    // ══════════════════════════════════════════════════════════════
    // 📱 MOBILE - Style Premium avec icônes
    // ══════════════════════════════════════════════════════════════
    .respond-mobile({
      flex-direction: column;
      padding: 10px 12px;
      gap: 6px;
      min-width: 60px;
      min-height: 60px;
      border-radius: 14px;

      // Onglet NON sélectionné - Style visible
      &--unselected {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid @neutral-200;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

        .tab__icon {
          color: var(--primary-500);
        }

        .tab__label {
          color: @neutral-700;
        }

        &:active {
          background: @neutral-100;
          transform: scale(0.96);
          border-color: @neutral-300;
        }
      }

      // Onglet sélectionné mobile
      &--selected {
        padding: 10px 14px;
        min-width: 68px;
        border: none;

        .tab__label {
          font-size: 11px;
        }
      }

      // Icône visible en mobile
      .tab__icon {
        display: flex;
      }

      // Label adapté mobile
      .tab__label {
        font-size: 10px;
        line-height: 1.2;
        text-align: center;
      }

      // Désactiver hover sur mobile
      &:hover:not(.tab--selected) {
        background: rgba(255, 255, 255, 0.9);
        transform: none;
      }
    });
  }
</style>
