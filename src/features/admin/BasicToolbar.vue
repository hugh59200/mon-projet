<template>
  <div class="basic-toolbar cardLayoutWrapper">
    <div class="elem elem--span-12">
      <BasicInput
        v-model="search"
        :placeholder="searchPlaceholder"
        icon-name="search"
        clearable
      />
    </div>
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
    gap: 12px;
    border: 1px solid @neutral-200;
    border-radius: 8px;
    background-color: @neutral-50;
    margin-bottom: 16px;
    padding: 10px 14px;
  }
</style>
