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

    <!-- 🔽 Dropdowns dynamiques -->
    <div
      v-for="(dropdown, index) in dropdowns"
      :key="index"
      class="elem elem--center elem--span-8"
    >
      <BasicDropdown
        v-model="models[dropdown.key]"
        :items="dropdown.items"
        size="small"
        :label="dropdown.label"
        dropdown-type="table"
        force-value
      />
    </div>

    <!-- ♻️ Bouton Réinitialiser -->
    <div
      v-if="showReset"
      class="elem elem--center elem--span-6 justify-end"
    >
      <BasicButton
        label="Réinitialiser"
        type="secondary"
        size="small"
        variant="outlined"
        @click="onReset"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * ✅ Version moderne avec defineModel() (Vue 3.4+)
   * Chaque v-model:<clé> est automatiquement typé et lié.
   */

  interface DropdownOption {
    id: string
    label: string
  }

  interface DropdownConfig {
    key: string
    label: string
    items: DropdownOption[]
  }

  /* Props */
  const props = defineProps<{
    /** Liste de dropdowns dynamiques */
    dropdowns: DropdownConfig[]

    /** Placeholder du champ de recherche */
    searchPlaceholder?: string

    /** Afficher ou non le bouton de reset */
    showReset?: boolean
  }>()

  /* defineModel() pour chaque valeur contrôlée */
  const search = defineModel<string>('search')
  const models = defineModel<Record<string, string>>('models', { required: true })

  /* Événement reset */
  const emit = defineEmits<{
    (e: 'reset'): void
  }>()

  function onReset() {
    emit('reset')
  }
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
