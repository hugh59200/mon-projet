<template>
  <div class="admin-toolbar">
    <div class="admin-toolbar__row">
      <BasicInput
        v-model="search"
        :placeholder="searchPlaceholder"
        icon-name="Search"
        clearable
        size="small"
        class="admin-toolbar__search"
      />
      <slot name="filters" />
      <BasicButton
        v-if="showReset"
        label="Réinitialiser"
        variant="outlined"
        size="small"
        @click="emit('reset')"
      />
      <slot name="actions" />
      <div
        v-if="$slots.pagination"
        class="admin-toolbar__pagination"
      >
        <slot name="pagination" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'

  defineProps<{
    searchPlaceholder?: string
    showReset?: boolean
  }>()

  const search = defineModel<string>('search')
  const emit = defineEmits<{ (e: 'reset'): void }>()
</script>

<style scoped lang="less">
  .admin-toolbar {
    background: @neutral-100;
    border: 1px solid @neutral-200;
    border-radius: 14px;
    padding: 12px 16px;
    margin-bottom: 16px;

    &__row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    &__search {
      flex: 0 1 280px;
      min-width: 180px;
      max-width: 320px;
    }

    &__pagination {
      margin-left: auto;
    }

    // Tablette
    @media (max-width: 1024px) {
      padding: 10px 14px;

      &__row {
        gap: 10px;
      }

      &__search {
        flex: 0 1 220px;
        min-width: 160px;
      }

      &__pagination {
        margin-left: auto;
        flex-shrink: 0;
      }
    }

    // Mobile
    @media (max-width: 768px) {
      padding: 10px 12px;

      &__row {
        gap: 8px;
      }

      &__search {
        min-width: 100%;
        max-width: none;
        flex: 1 1 100%;
        order: -1;
      }

      &__pagination {
        margin-left: 0;
        width: 100%;
        justify-content: center;
        display: flex;
        order: 20;
      }
    }
  }
</style>
