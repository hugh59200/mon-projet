<template>
  <div class="catalogue-filters">
    <div class="catalogue-filters__head">
      <BasicText
        size="h5"
        weight="bold"
        color="neutral-300"
      >
        {{ t('catalogue.filters.title') }}
      </BasicText>
      <div class="catalogue-filters__actions">
        <PremiumButton
          type="secondary"
          variant="outline"
          size="sm"
          :label="allOpen ? t('catalogue.filters.collapseAll') : t('catalogue.filters.expandAll')"
          @click="emit('toggleAll')"
        />
        <PremiumButton
          type="secondary"
          variant="outline"
          size="sm"
          :label="t('catalogue.filters.resetAll')"
          @click="emit('resetAll')"
        />
      </div>
    </div>

    <FilterSection
      v-model="filterOpen.price"
      :title="t('catalogue.filters.price')"
    >
      <BasicRange v-model="priceRange" />
    </FilterSection>

    <FilterSection
      v-model="filterOpen.category"
      :title="t('catalogue.filters.categories')"
    >
      <WrapperDropdown
        v-model="selectedCategories"
        :items="categoryItems"
        searchable
        deletable
        mode="multiple"
        size="small"
        :placeholder="t('common.select')"
      />
    </FilterSection>

    <FilterSection
      v-model="filterOpen.stock"
      :title="t('catalogue.filters.availability')"
    >
      <WrapperCheckbox
        v-model="inStockOnly"
        :label="`${t('catalogue.filters.inStock')} (${stockCount})`"
      />
    </FilterSection>

    <FilterSection
      v-if="tags.length"
      v-model="filterOpen.tags"
      :title="t('catalogue.filters.tags')"
    >
      <div class="catalogue-filters__tags">
        <BasicBadge
          v-for="tag in displayedTags"
          :key="tag.id"
          :label="`${tag.label} (${tag.count})`"
          size="small"
          :type="selectedTags.includes(tag.id) ? 'success' : 'default'"
          deletable
          @click="emit('toggleTag', tag.id)"
          class="filter-tag"
        />
      </div>

      <div
        v-if="tagItems.length > VISIBLE_TAGS_COUNT"
        class="catalogue-filters__more"
      >
        <BasicText
          size="body-s"
          weight="semibold"
          color="primary-500"
          class="toggle-link"
          @click="showAllTags = !showAllTags"
        >
          {{ showAllTags ? `- ${t('common.seeLess')}` : `+ ${t('common.viewAll')} (${tagItems.length})` }}
        </BasicText>
      </div>
    </FilterSection>
  </div>
</template>

<script setup lang="ts">
  import FilterSection from '@/features/shared/components/FilterSection.vue'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // Models
  const filterOpen = defineModel<Record<string, boolean>>('filterOpen', { default: () => ({}) })
  const priceRange = defineModel<{ min: number; max: number; from: number; to: number }>(
    'priceRange',
    { default: () => ({ min: 0, max: 0, from: 0, to: 0 }) },
  )
  const selectedCategories = defineModel<string[]>('selectedCategories', { default: () => [] })
  const inStockOnly = defineModel<boolean>('inStockOnly', { default: false })
  const selectedTags = defineModel<string[]>('selectedTags', { default: () => [] })

  const props = defineProps<{
    allOpen: boolean
    categoryItems: any[]
    tagItems: any[]
    tags: string[]
    stockCount: number
  }>()

  const emit = defineEmits(['toggleAll', 'resetAll', 'toggleTag'])

  // --- LOGIQUE VOIR PLUS / MOINS ---
  const VISIBLE_TAGS_COUNT = 8 // Nombre de tags à afficher par défaut
  const showAllTags = ref(false)

  const displayedTags = computed(() => {
    if (showAllTags.value) return props.tagItems
    // On affiche toujours les tags sélectionnés même s'ils sont loin dans la liste
    // Sinon, on affiche juste les N premiers
    return props.tagItems.slice(0, VISIBLE_TAGS_COUNT)
  })
</script>

<style scoped lang="less">
  .catalogue-filters {
    display: flex;
    flex-direction: column;
    gap: 18px;

    &__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--content-block-border, rgba(255, 255, 255, 0.1));
    }

    &__actions {
      display: flex;
      gap: 4px;
    }

    &__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    /* Permet au badge de ne pas écraser la largeur si le texte est long */
    .filter-tag {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__more {
      margin-top: 8px;
      cursor: pointer;

      .toggle-link {
        transition: color 0.2s;
        &:hover {
          color: var(--primary-400);
        }
      }
    }
  }
</style>
