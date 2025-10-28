<template>
  <BasicToolbar
    v-model:search="search"
    v-model:models="models"
    v-model:sortAsc="sortAsc"
    :search-placeholder="'Rechercher un utilisateur...'"
    :dropdowns="[
      { key: 'sortKey', label: 'Trier par', items: SORT_OPTIONS },
      { key: 'selectedRole', label: 'Rôle', items: ROLE_FILTERS },
    ]"
    :show-reset="true"
    @reset="resetFilters"
  />

  <BasicPagination
    :current-page="page"
    :nb-pages="nbPages"
    :nb-pages-max="5"
    :nb-results="total"
    @change="page = $event"
  />

  <WrapperLoader
    :loading="loading"
    :has-loaded="hasLoaded"
    :is-empty="hasLoaded && filteredData.length === 0"
    message="Chargement des utilisateurs..."
    empty-message="Aucun utilisateur trouvé 😅"
  >
    <div class="users--desktop">
      <!-- HEADER -->
      <div class="cardLayoutWrapper cardLayoutWrapper--header">
        <BasicCell
          :span="10"
          text="Email"
          icon-name="ArrowUpDown"
          :sort-asc="sortKey === 'email' ? sortAsc : undefined"
          :is-active="sortKey === 'email'"
          :icon-color="sortKey === 'email' ? 'primary-600' : 'grey-800'"
          :on-icon-click="() => toggleSort('email')"
        />

        <BasicCell
          :span="8"
          text="Nom"
          icon-name="ArrowUpDown"
          :sort-asc="sortKey === 'full_name' ? sortAsc : undefined"
          :is-active="sortKey === 'full_name'"
          :icon-color="sortKey === 'full_name' ? 'primary-600' : 'grey-800'"
          :on-icon-click="() => toggleSort('full_name')"
        />

        <BasicCell
          center
          :span="6"
          text="Rôle"
          icon-name="ArrowUpDown"
          :sort-asc="sortKey === 'role' ? sortAsc : undefined"
          :is-active="sortKey === 'role'"
          :icon-color="sortKey === 'role' ? 'primary-600' : 'grey-800'"
          :on-icon-click="() => toggleSort('role')"
        />

        <BasicCell
          center
          :span="6"
          text="Créé le"
          icon-name="ArrowUpDown"
          :sort-asc="sortKey === 'created_at' ? sortAsc : undefined"
          :is-active="sortKey === 'created_at'"
          :icon-color="sortKey === 'created_at' ? 'primary-600' : 'grey-800'"
          :on-icon-click="() => toggleSort('created_at')"
        />

        <BasicCell
          center
          :span="6"
          text="Actions"
        />
      </div>

      <!-- ROWS -->
      <div
        v-for="user in filteredData"
        :key="user.id"
        class="gridElemWrapper"
      >
        <div class="cardLayoutWrapper">
          <BasicCell :span="10">{{ user.email }}</BasicCell>
          <BasicCell :span="8">{{ user.full_name || '—' }}</BasicCell>

          <BasicCell
            center
            :span="6"
          >
            <BasicDropdown
              v-model="localRoles[user.id]"
              :items="ROLES"
              size="small"
              dropdown-type="table"
              force-value
              @update:model-value="(v) => v && handleRoleChange(user, v)"
            />
          </BasicCell>

          <BasicCell
            :span="6"
            center
          >
            {{ formatDate(user.created_at) }}
          </BasicCell>

          <BasicCellActionIcon
            icon-name="eye"
            tooltip="Voir"
            center
            :span="3"
            @click="openUserModal(user.id)"
          />
          <BasicCellActionIcon
            icon-name="trash"
            tooltip="Supprimer"
            center
            :span="3"
            @click="handleDelete(user)"
          />
        </div>
      </div>
    </div>
  </WrapperLoader>

  <teleport to="#app">
    <AdminUserDetailsModal
      v-if="selectedUserId"
      v-model="isModalVisible"
      :user-id="selectedUserId"
    />
  </teleport>
</template>

<script setup lang="ts">
  import { supabase } from '@/services/supabaseClient'
  import type { Tables } from '@/types/supabase'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { ref, watch, watchEffect } from 'vue'
  import BasicToolbar from '../BasicToolbar.vue'
  import { usePaginatedSupabaseTable } from '../composables/usePaginatedSupabaseTable'
  import AdminUserDetailsModal from './AdminUserDetailsModal.vue'

  type UserRow = Tables<'profiles'>
  const toast = useToastStore()

  /* Pagination / data composable */
  const {
    filteredData,
    total,
    nbPages,
    loading,
    hasLoaded,
    page,
    search,
    sortKey,
    sortAsc,
    activeFilters,
    fetchData,
    reset,
  } = usePaginatedSupabaseTable<UserRow>({
    table: 'profiles',
    orderBy: 'created_at',
    ascending: false,
    filters: { role: 'all' },
    searchFn: (u, q) =>
      (u.email?.toLowerCase()?.includes(q) ?? false) ||
      (u.full_name?.toLowerCase()?.includes(q) ?? false),
  })

  /* Toolbar models */
  const models = ref<{ sortKey: string; selectedRole: 'all' | 'user' | 'admin' }>({
    sortKey: 'created_at',
    selectedRole: 'all',
  })

  watchEffect(() => {
    models.value.sortKey = sortKey.value
    models.value.selectedRole = activeFilters.value.role ?? 'all'
  })

  watch(models, (val) => {
    sortKey.value = val.sortKey
    activeFilters.value.role = val.selectedRole
  })

  /* Local roles */
  const localRoles = ref<Record<string, string>>({})

  /* Dropdown data */
  const ROLES = [
    { id: 'user', label: 'Utilisateur' },
    { id: 'admin', label: 'Administrateur' },
  ]
  const ROLE_FILTERS = [{ id: 'all', label: 'Tous' }, ...ROLES]
  const SORT_OPTIONS = [
    { id: 'created_at', label: 'Date de création' },
    { id: 'email', label: 'Email' },
    { id: 'full_name', label: 'Nom' },
    { id: 'role', label: 'Rôle' },
  ]

  /* Sorting logic */
  function toggleSort(key: string) {
    if (sortKey.value === key) {
      sortAsc.value = !sortAsc.value
    } else {
      sortKey.value = key
      sortAsc.value = true
    }
  }

  /* Reset */
  function resetFilters() {
    models.value.selectedRole = 'all'
    models.value.sortKey = 'created_at'
    reset()
  }

  /* CRUD */
  async function handleRoleChange(user: UserRow, newRole: string) {
    localRoles.value[user.id] = newRole
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    if (error) toast.show('Erreur de mise à jour du rôle', 'danger')
    else toast.show('Rôle mis à jour ✅', 'success')
  }

  async function handleDelete(user: UserRow) {
    const confirmDelete = confirm(`Supprimer ${user.email} ?`)
    if (!confirmDelete) return
    const { error } = await supabase.from('profiles').delete().eq('id', user.id)
    if (error) toast.show('Erreur suppression', 'danger')
    else {
      toast.show('Utilisateur supprimé ✅', 'success')
      fetchData()
    }
  }

  /* Modal */
  const isModalVisible = ref(false)
  const selectedUserId = ref<string | null>(null)
  function openUserModal(id: string) {
    selectedUserId.value = id
    isModalVisible.value = true
  }

  /* Date formatting */
  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  /* Sync local roles */
  watchEffect(() => {
    if (filteredData.value.length > 0) {
      const newRoles: Record<string, string> = {}
      for (const u of filteredData.value) {
        newRoles[u.id] = u.role ?? 'user'
      }
      localRoles.value = newRoles
    }
  })
</script>

<style scoped lang="less">
  .users--mobile {
    display: none;
  }

  @media (max-width: 1000px) {
    .users--desktop {
      display: none;
    }
    .users--mobile {
      display: block;
    }
  }

  .mobile-cards-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
</style>
