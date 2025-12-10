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
    transition: all 0.2s ease;
    background: transparent;
    user-select: none;
    position: relative;
    overflow: hidden;

    &__label {
      font-weight: 500;
      font-size: 13px;
      color: var(--text-secondary, @neutral-600);
      transition: color 0.2s ease;
      white-space: nowrap;
    }

    &__icon {
      display: none;
      flex-shrink: 0;
      color: var(--text-muted, @neutral-500);
      transition: color 0.2s ease;
    }

    // Hover desktop
    &:hover:not(.tab--selected) {
      background: var(--bg-subtle, @neutral-100);

      .tab__label {
        color: var(--text-primary, @neutral-700);
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
        box-shadow:
          0 4px 12px color-mix(in srgb, var(--primary-600) 40%, transparent),
          0 6px 20px color-mix(in srgb, var(--primary-700) 25%, transparent);
      }
    }

    // ══════════════════════════════════════════════════════════════
    // 📱 MOBILE - Style avec icônes
    // ══════════════════════════════════════════════════════════════
    .respond-mobile({
      flex-direction: column;
      padding: 10px 12px;
      gap: 6px;
      min-width: 60px;
      min-height: 60px;
      border-radius: 12px;

      // Onglet NON sélectionné
      &--unselected {
        background: var(--bg-subtle, @neutral-50);

        .tab__icon {
          color: var(--primary-500);
        }

        .tab__label {
          color: var(--text-primary, @neutral-700);
        }

        &:active {
          background: var(--border-default, @neutral-200);
          transform: scale(0.97);
        }
      }

      // Onglet sélectionné mobile
      &--selected {
        padding: 10px 14px;
        min-width: 68px;

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
        background: var(--bg-subtle, @neutral-50);
        transform: none;
      }
    });
  }
</style>
