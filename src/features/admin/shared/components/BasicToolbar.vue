<template>
  <FilterSection
    v-model="open"
    title="Filtres"
    class="toolbar-section"
  >
    <div class="basic-toolbar">
      <BasicInput
        v-model="search"
        :placeholder="searchPlaceholder"
        icon-name="Search"
        clearable
        size="small"
        class="toolbar-item"
      />
      <BasicButton
        v-if="showReset"
        label="Réinitialiser"
        variant="outlined"
        size="small"
        class="toolbar-item"
        @click="emit('reset')"
      />
      <slot name="actions" />
      <BasicBadge
        v-if="showRole && role"
        :type="role === 'admin' ? 'info' : 'default'"
        class="toolbar-item role-badge"
      >
        <BasicIconNext
          :name="role === 'admin' ? 'ShieldCheck' : 'User'"
          :size="18"
          class="role-icon"
        />
        <BasicText>{{ roleLabel }}</BasicText>
      </BasicBadge>
    </div>
  </FilterSection>
</template>

<script setup lang="ts">
  import FilterSection from '@/features/shared/components/FilterSection.vue'

  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import BasicBadge from '@designSystem/components/basic/badge/BasicBadge.vue'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicInput from '@designSystem/components/basic/input/BasicInput.vue'
  import { computed, ref } from 'vue'

  defineProps<{
    searchPlaceholder?: string
    showReset?: boolean
    showRole?: boolean
  }>()

  const search = defineModel<string>('search')
  const emit = defineEmits<{ (e: 'reset'): void }>()

  const auth = useAuthStore()
  const role = computed(() => auth.profile?.role || 'user')
  const roleLabel = computed(() => (role.value === 'admin' ? 'Administrateur' : 'Utilisateur'))

  const open = ref(false)
</script>

<style scoped lang="less">
  .toolbar-section {
    margin: 16px;
  }

  .basic-toolbar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    align-items: center;

    .toolbar-item {
      width: 100%;
    }

    @media (max-width: 700px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px 14px;

      .role-badge {
        justify-self: end;
      }
    }
  }
</style>
