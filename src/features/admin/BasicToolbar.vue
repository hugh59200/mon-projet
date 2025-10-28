<template>
  <div class="basic-toolbar cardLayoutWrapper">
    <!-- 🔍 Recherche -->
    <div class="elem elem--span-12">
      <BasicInput
        v-model="search"
        :placeholder="searchPlaceholder"
        icon-name="search"
        clearable
      />
    </div>

    <!-- 🔄 Reset -->
    <div
      v-if="showReset"
      class="elem elem--center elem--span-6 justify-end"
    >
      <BasicButton
        label="Réinitialiser"
        type="secondary"
        size="small"
        variant="outlined"
        @click="emit('reset')"
      />
    </div>

    <!-- 🆕 Actions (ajouter, exporter, etc.) -->
    <div class="elem elem--center elem--span-18 justify-end">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    searchPlaceholder?: string
    showReset?: boolean
  }>()

  const search = defineModel<string>('search')
  const emit = defineEmits<{ (e: 'reset'): void }>()
</script>

<style scoped lang="less">
  .basic-toolbar {
    display: grid;
    grid-template-columns: repeat(36, 1fr);
    align-items: center;
    gap: 12px;
    border: 1px solid @neutral-200;
    border-radius: 8px;
    background-color: @neutral-50;
    margin-bottom: 16px;
    padding: 10px 14px;
  }

  .justify-end {
    justify-content: flex-end;
  }

  /* 📱 Responsive : stack sur mobile */
  @media (max-width: 768px) {
    .basic-toolbar {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .elem--span-12,
    .elem--span-6,
    .elem--span-18 {
      width: 100%;
    }
  }
</style>
