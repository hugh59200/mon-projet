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
        placeholder="Choisir..."
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
          v-for="t in displayedTags"
          :key="t.id"
          :label="`${t.label} (${t.count})`"
          size="small"
          :type="selectedTags.includes(t.id) ? 'success' : 'default'"
          deletable
          @click="emit('toggleTag', t.id)"
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
          {{ showAllTags ? '- Voir moins' : `+ Voir tout (${tagItems.length})` }}
        </BasicText>
      </div>
    </FilterSection>
  </div>
</template>

<script setup lang="ts">
  import FilterSection from '@/features/shared/components/FilterSection.vue'
  import { computed, ref } from 'vue'

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
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
