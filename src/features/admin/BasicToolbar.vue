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
      v-for="dropdown in dropdowns"
      :key="dropdown.key"
      class="elem elem--center elem--span-8"
    >
      <BasicDropdown
        v-if="dropdown.key === 'sortKey'"
        v-model="sortKey"
        :items="dropdown.items"
        size="small"
        :label="dropdown.label"
        dropdown-type="table"
        force-value
      />
      <BasicDropdown
        v-else-if="dropdown.key === 'selectedRole'"
        v-model="selectedRole"
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
        @click="$emit('reset')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface DropdownOption {
    id: string
    label: string
  }

  interface DropdownConfig {
    key: string
    label: string
    items: DropdownOption[]
  }

  defineProps<{
    dropdowns: DropdownConfig[]
    searchPlaceholder?: string
    showReset?: boolean
  }>()

  /* ✅ declare tes v-models */
  const search = defineModel<string>('search')
  const sortKey = defineModel<string>('sortKey')
  const selectedRole = defineModel<string>('selectedRole')

  /* ✅ déclare aussi l'event custom 'reset' */
  const emit = defineEmits<{
    (e: 'reset'): void
  }>()
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
