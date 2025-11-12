<template>
  <div class="filters-panel-content">
    <div class="filters__head">
      <BasicText
        size="h5"
        weight="bold"
      >
        Filtres
      </BasicText>
      <div class="filters__actions">
        <BasicButton
          type="secondary"
          variant="outlined"
          size="small"
          :label="allOpen ? 'Tout réduire' : 'Tout ouvrir'"
          @click="$emit('toggleAll')"
        />
        <BasicButton
          type="secondary"
          variant="outlined"
          size="small"
          label="Reset"
          @click="$emit('resetAll')"
        />
      </div>
    </div>

    <!-- 🔹 Prix -->
    <FilterSection
      v-model="filterOpen.price"
      title="Prix"
    >
      <BasicRange
        v-if="priceRange.max > priceRange.min"
        :model-value="priceRange"
        @update:model-value="(val) => $emit('update:priceRange', val)"
      />
    </FilterSection>

    <!-- 🔹 Catégories -->
    <FilterSection
      v-model="filterOpen.category"
      title="Catégorie"
    >
      <WrapperDropdown
        :model-value="selectedCategories"
        :items="categoryItems"
        searchablecfbdftfddccdsww
        deletable
        mode="multiple"
        size="small"
      />
    </FilterSection>

    <!-- 🔹 Stock -->
    <FilterSection
      v-model="filterOpen.stock"
      title="Disponibilité"
    >
      <WrapperCheckbox
        :model-value="inStockOnly"
        @update:model-value="(val) => $emit('update:inStockOnly', val)"
        :label="`En stock (${stockCount})`"
      />
    </FilterSection>

    <!-- 🔹 Tags -->
    <FilterSection
      v-if="tags.length"
      v-model="filterOpen.tags"
      title="Tags"
    >
      <div class="tags-list">
        <BasicBadge
          v-for="t in tagItems"
          :key="t.id"
          :label="`${t.label} (${t.count})`"
          size="small"
          :type="selectedTags.includes(t.id) ? 'success' : 'default'"
          deletable
          @click="$emit('toggleTag', t.id)"
        />
      </div>
    </FilterSection>
  </div>
</template>

<script setup lang="ts">
  import FilterSection from '@/features/shared/components/FilterSection.vue'

  defineProps<{
    allOpen: boolean
    filterOpen: Record<string, boolean>
    priceRange: any
    categoryItems: any[]
    selectedCategories: string[]
    inStockOnly: boolean
    stockCount: number
    tags: string[]
    tagItems: any[]
    selectedTags: string[]
  }>()

  defineEmits([
    'toggleAll',
    'resetAll',
    'toggleTag',
    'update:priceRange',
    'update:selectedCategories',
    'update:inStockOnly',
  ])
</script>

<style scoped lang="less">
  .filters-panel-content {
    display: flex;
    flex-direction: column;
    gap: 18px;

    .filters__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .filters__actions {
      display: flex;
      gap: 8px;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }
</style>
