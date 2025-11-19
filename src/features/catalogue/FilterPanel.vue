<template>
  <div class="catalogue-filters">
    <div class="catalogue-filters__head">
      <BasicText
        size="h5"
        weight="bold"
        color="neutral-300"
      >
        Filtres
      </BasicText>
      <div class="catalogue-filters__actions">
        <BasicButton
          type="secondary"
          variant="outlined"
          size="small"
          :label="allOpen ? 'Tout réduire' : 'Tout ouvrir'"
          @click="emit('toggleAll')"
        />
        <BasicButton
          type="secondary"
          variant="outlined"
          size="small"
          label="Reset"
          @click="emit('resetAll')"
        />
      </div>
    </div>

    <FilterSection
      v-model="filterOpen.price"
      title="Prix"
    >
      <BasicRange v-model="priceRange" />
    </FilterSection>

    <FilterSection
      v-model="filterOpen.category"
      title="Catégorie"
    >
      <WrapperDropdown
        v-model="selectedCategories"
        :items="categoryItems"
        searchable
        deletable
        mode="multiple"
        size="small"
      />
    </FilterSection>

    <FilterSection
      v-model="filterOpen.stock"
      title="Disponibilité"
    >
      <WrapperCheckbox
        v-model="inStockOnly"
        :label="`En stock (${stockCount})`"
      />
    </FilterSection>

    <FilterSection
      v-if="tags.length"
      v-model="filterOpen.tags"
      title="Tags"
    >
      <div class="catalogue-filters__tags">
        <BasicBadge
          v-for="t in tagItems"
          :key="t.id"
          :label="`${t.label} (${t.count})`"
          size="small"
          :type="selectedTags.includes(t.id) ? 'success' : 'default'"
          deletable
          @click="emit('toggleTag', t.id)"
        />
      </div>
    </FilterSection>
  </div>
</template>

<script setup lang="ts">
  import FilterSection from '@/features/shared/components/FilterSection.vue'

  // Models
  const filterOpen = defineModel<Record<string, boolean>>('filterOpen', { default: () => ({}) })
  const priceRange = defineModel<{ min: number; max: number; from: number; to: number }>(
    'priceRange',
    {
      default: () => ({ min: 0, max: 0, from: 0, to: 0 }),
    },
  )
  const selectedCategories = defineModel<string[]>('selectedCategories', { default: () => [] })
  const inStockOnly = defineModel<boolean>('inStockOnly', { default: false })
  const selectedTags = defineModel<string[]>('selectedTags', { default: () => [] })

  defineProps<{
    allOpen: boolean
    categoryItems: any[]
    tagItems: any[]
    tags: string[]
    stockCount: number
  }>()

  const emit = defineEmits(['toggleAll', 'resetAll', 'toggleTag'])
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
    }

    &__actions {
      display: flex;
      gap: 8px;
    }

    &__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }
</style>
