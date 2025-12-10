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
      <div class="admin-toolbar__filters">
        <slot name="filters" />
      </div>
      <PremiumButton
        v-if="showReset"
        label="Réinitialiser"
        variant="outline"
        size="sm"
        class="admin-toolbar__reset"
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
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'

  defineProps<{
    searchPlaceholder?: string
    showReset?: boolean
  }>()

  const search = defineModel<string>('search')
  const emit = defineEmits<{ (e: 'reset'): void }>()
</script>

<style scoped lang="less">
  @import '@designSystem/fondation/breakpoints/responsive-mixins.less';

  .admin-toolbar {
    background: var(--bg-subtle);
    border: 1px solid var(--border-default);
    border-radius: 14px;
    padding: 12px 16px;
    margin-bottom: 16px;
    max-width: 100%;
    overflow: visible;

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

    &__filters {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    &__pagination {
      margin-left: auto;
    }

    // Tablet (≤ 1160px)
    .respond-tablet({
      padding: 10px 14px;

      &__row {
        gap: 10px;
      }

      &__search {
        flex: 0 1 220px;
        min-width: 160px;
      }

      &__filters {
        gap: 6px;
      }

      &__pagination {
        margin-left: auto;
        flex-shrink: 0;
      }
    });

    // Mobile (≤ 720px)
    .respond-mobile({
      padding: 12px;
      border-radius: 12px;

      &__row {
        gap: 10px;
      }

      // Recherche en premier, pleine largeur
      &__search {
        min-width: 100%;
        max-width: none;
        flex: 1 1 100%;
        order: -1;
      }

      // Filtres : pleine largeur, scroll horizontal si nécessaire
      &__filters {
        width: 100%;
        order: 0;
        overflow-x: auto;
        flex-wrap: nowrap;
        gap: 6px;
        padding: 4px 0;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar {
          display: none;
        }

        // Styles pour les boutons enfants
        :deep(.PremiumButton),
        :deep(button) {
          flex-shrink: 0;
          font-size: 12px;
          padding: 6px 10px;
          white-space: nowrap;
        }
      }

      // Bouton reset
      &__reset {
        order: 1;
        flex-shrink: 0;
      }

      // Pagination en dernier, centrée
      &__pagination {
        margin-left: 0;
        width: 100%;
        justify-content: center;
        display: flex;
        order: 20;
      }

      // Réduire taille boutons généraux sur mobile
      :deep(.PremiumButton) {
        font-size: 13px;
        padding: 8px 12px;
      }
    });
  }
</style>
