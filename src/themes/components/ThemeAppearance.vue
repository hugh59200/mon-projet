<template>
  <div class="theme-appearance">
    <!-- ===== Thème (Clair / Sombre) ===== -->
    <div class="theme-appearance__block">
      <BasicText
        size="body-m"
        weight="bold"
      >
        Thème
      </BasicText>

      <div class="theme-appearance__toggle">
        <button
          class="theme-appearance__pill"
          :class="{ 'is-active': scheme === 'light' }"
          @click="scheme = 'light'"
        >
          <span class="theme-appearance__thumb light"></span>
          Clair
        </button>

        <button
          class="theme-appearance__pill"
          :class="{ 'is-active': scheme === 'dark' }"
          @click="scheme = 'dark'"
        >
          <span class="theme-appearance__thumb dark"></span>
          Sombre
        </button>
      </div>
    </div>

    <!-- ===== Palettes ===== -->
    <div class="theme-appearance__block">
      <BasicText
        size="body-m"
        weight="bold"
      >
        Palette
      </BasicText>

      <div class="theme-appearance__palette-grid">
        <div
          v-for="p in palettes"
          :key="p.value"
          class="theme-appearance__palette-card"
          :class="{ 'is-active': palette === p.value }"
          @click="palette = p.value"
        >
          <div class="theme-appearance__swatches">
            <span class="swatch swatch-primary"></span>
            <span class="swatch swatch-secondary"></span>
            <span class="swatch swatch-accent"></span>
          </div>

          <BasicText
            size="body-s"
            weight="semibold"
          >
            {{ p.label }}
          </BasicText>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTheme } from '@/themes/composables/useTheme'

  const { palette, scheme } = useTheme()

  const palettes = [
    { label: 'Lab (clean médical)', value: 'lab' },
    { label: 'Premium (pharma)', value: 'premium' },
    { label: 'Neo (biotech)', value: 'neo' },
  ] as const
</script>

<style scoped lang="less">
  .theme-appearance {
    display: flex;
    flex-direction: column;
    gap: 28px;

    &__block {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* ====== Toggle (Clair / Sombre) ====== */
    &__toggle {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    &__pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 13px;

      border: 1px solid rgba(var(--neutral-300-rgb), 0.7);
      background: rgba(var(--neutral-0-rgb), 0.9);
      transition: all 0.25s ease;

      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.85);
      }

      &.is-active {
        background: rgba(var(--primary-50-rgb), 0.9);
        border-color: rgba(var(--primary-500-rgb), 0.7);
        box-shadow: 0 0 0 1px rgba(var(--primary-200-rgb), 0.7);
        color: var(--primary-700);
      }
    }

    &__thumb {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      box-shadow: inset 0 0 0 1px rgba(var(--neutral-900-rgb), 0.15);

      &.light {
        background: linear-gradient(
          135deg,
          var(--neutral-0) 0%,
          rgba(var(--neutral-200-rgb), 1) 100%
        );
      }

      &.dark {
        background: linear-gradient(
          135deg,
          rgba(var(--neutral-800-rgb), 1),
          rgba(var(--neutral-700-rgb), 1)
        );
      }
    }

    /* ====== Palette Grid ====== */
    &__palette-grid {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    &__palette-card {
      width: 150px;
      padding: 14px 16px;
      border-radius: 16px;
      background: rgba(var(--neutral-0-rgb), 0.92);
      border: 1px solid rgba(var(--neutral-300-rgb), 0.6);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      transition: all 0.25s ease;
      box-shadow: 0 2px 6px rgba(var(--neutral-900-rgb), 0.05);

      &:hover {
        transform: translateY(-2px);
        border-color: rgba(var(--primary-400-rgb), 0.6);
        box-shadow: 0 4px 12px rgba(var(--neutral-900-rgb), 0.08);
      }

      &.is-active {
        background: rgba(var(--primary-50-rgb), 0.9);
        border-color: rgba(var(--primary-500-rgb), 0.7);
        box-shadow: 0 0 0 2px rgba(var(--primary-300-rgb), 0.6);
        transform: translateY(-2px);
      }
    }

    /* ====== Swatches ====== */
    &__swatches {
      display: flex;
      gap: 8px;
    }

    .swatch {
      width: 24px;
      height: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(var(--neutral-900-rgb), 0.15);
      border: 2px solid rgba(var(--neutral-0-rgb), 1);

      &-primary {
        background: var(--primary-500);
      }
      &-secondary {
        background: var(--secondary-500);
      }
      &-accent {
        background: var(--primary-200);
      }
    }
  }
</style>
