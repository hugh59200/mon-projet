<template>
  <div class="ta util-surface-2 util-border util-radius-l util-shadow-elevated">
    <!-- TITLE -->
    <BasicText
      size="body-l"
      weight="semibold"
      class="ta__title"
    >
      Apparence
    </BasicText>

    <!-- THEME -->
    <div class="ta__row">
      <BasicText
        size="body-s"
        color="neutral-600"
      >
        Thème
      </BasicText>

      <div class="ta__pill-group">
        <button
          class="ta__pill"
          :class="{ active: scheme === 'light' }"
          @click="scheme = 'light'"
        >
          Clair
        </button>

        <button
          class="ta__pill"
          :class="{ active: scheme === 'dark' }"
          @click="scheme = 'dark'"
        >
          Sombre
        </button>
      </div>
    </div>

    <!-- PALETTE -->
    <div class="ta__row">
      <BasicText
        size="body-s"
        color="neutral-600"
      >
        Palette
      </BasicText>

      <div class="ta__pill-group">
        <button
          v-for="option in palettes"
          :key="option.value"
          class="ta__pill"
          :class="{ active: palette === option.value }"
          @click="palette = option.value as Palette"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTheme, type Palette } from '@/themes/composables/useTheme'

  const { palette, scheme } = useTheme()

  const palettes = [
    { label: 'Lab (clean médical)', value: 'lab' },
    { label: 'Premium (pharma)', value: 'premium' },
    { label: 'Neo (biotech)', value: 'neo' },
  ]
</script>

<style scoped lang="less">
  .ta {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    background: var(--surface-2);
    border-color: var(--surface-border);
    transition: var(--transition-medium);

    &:hover {
      border-color: var(--surface-border-strong);
    }

    /* Title */
    &__title {
      color: var(--text-title-contrast);
    }

    /* Rows */
    &__row {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Pill container */
    &__pill-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* Pills */
    &__pill {
      padding: 7px 18px;
      border-radius: 999px;
      border: 1px solid var(--surface-border);
      background: var(--surface-1);
      color: var(--neutral-700);
      font-size: var(--font-size-body-s);
      font-weight: var(--font-weight-regular);
      cursor: pointer;
      transition: var(--transition-medium);
      backdrop-filter: blur(4px);

      &:hover {
        background: var(--surface-3);
        border-color: var(--surface-border-strong);
      }

      &.active {
        background: rgba(var(--primary-100-rgb), 0.85);
        border-color: rgba(var(--primary-400-rgb), 0.75);
        color: var(--primary-700);
        box-shadow: 0 0 0 1px rgba(var(--primary-300-rgb), 0.85);
        font-weight: var(--font-weight-semibold);
      }
    }
  }
</style>
