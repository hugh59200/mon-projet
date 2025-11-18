<template>
  <section class="filter-group">
    <header class="filter-group__header">
      <div class="filter-group__title">
        <BasicIconNext
          :name="icon!"
          :size="22"
          color="primary-600"
        />
        <BasicText
          size="h5"
          weight="semibold"
          color="neutral-900"
        >
          {{ title }}
        </BasicText>
      </div>

      <BasicButton
        size="small"
        variant="ghost"
        class="fg-action"
        :label="toggleLabel"
        :icon-name="toggleIcon"
        @click="toggleAll"
      />
    </header>
    <div class="filter-group__content">
      <FilterSection
        v-for="item in items"
        :key="item.id"
        :title="item.q"
        v-model="openState[item.id]"
      >
        <slot
          name="item"
          :item="item"
        />
      </FilterSection>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { computed } from 'vue'
  import FilterSection from './FilterSection.vue'

  const props = defineProps<{
    title: string
    icon?: IconNameNext
    items: Array<{ id: string; q: string }>
  }>()

  const openState = defineModel<Record<string, boolean>>('openState', {
    required: true,
  })

  const allOpen = computed(() => props.items.every((it) => openState.value[it.id]))

  const toggleLabel = computed(() => (allOpen.value ? 'Tout fermer' : 'Tout ouvrir'))
  const toggleIcon = computed<IconNameNext>(() => (allOpen.value ? 'ChevronUp' : 'ChevronDown'))

  function toggleAll() {
    const newVal = !allOpen.value
    props.items.forEach((it) => (openState.value[it.id] = newVal))
  }
</script>

<style scoped lang="less">
  .filter-group {
    background: color-mix(in srgb, @neutral-50 40%, transparent);
    backdrop-filter: blur(14px);
    border: 1px solid color-mix(in srgb, @neutral-300 35%, transparent);
    border-radius: 18px;
    padding: 18px 20px 22px;

    box-shadow:
      0 8px 30px fade(#000, 10%),
      inset 0 0 0 1px fade(@white, 40%);

    display: flex;
    flex-direction: column;
    gap: 16px;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 6px;
      border-bottom: 1px solid color-mix(in srgb, @neutral-300 35%, transparent);
    }

    &__title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__actions {
      display: flex;
      gap: 6px;

      .fg-action {
        opacity: 0.75;
        transition:
          opacity 0.2s ease,
          transform 0.2s ease;

        &:hover {
          opacity: 1;
          transform: translateY(-1px);
        }
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 6px;
    }
  }

  .fg-section {
    border-radius: 14px !important;
    overflow: hidden;
    background: fade(@white, 50%) !important;
    border: 1px solid color-mix(in srgb, @neutral-300 40%, transparent) !important;

    box-shadow:
      0 4px 12px fade(#000, 6%),
      inset 0 0 0 1px fade(@white, 30%);

    transition:
      background 0.25s ease,
      box-shadow 0.25s ease;

    &:hover {
      background: fade(@white, 70%) !important;
      box-shadow:
        0 8px 20px fade(#000, 10%),
        inset 0 0 0 1px color-mix(in srgb, var(--primary-300) 30%, transparent);
    }
  }
</style>
