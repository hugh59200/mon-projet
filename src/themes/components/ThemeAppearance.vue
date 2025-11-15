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

    <!-- THEME SECTION -->
    <div class="ta__row">
      <BasicText
        size="body-s"
        color="neutral-600"
      >
        Thème
      </BasicText>

      <BasicPillGroup
        v-model="scheme"
        :options="[
          { label: 'Clair', value: 'light' },
          { label: 'Sombre', value: 'dark' },
        ]"
      />
    </div>

    <!-- PALETTE SECTION -->
    <div class="ta__row">
      <BasicText
        size="body-s"
        color="neutral-600"
      >
        Palette
      </BasicText>

      <BasicPillGroup
        v-model="palette"
        :options="palettes"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTheme } from '@/themes/composables/useTheme'
  import BasicPillGroup from '@designSystem/components/basic/pill/BasicPillGroup.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'

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

    &__title {
      color: var(--text-title-contrast);
    }

    &__row {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
</style>
