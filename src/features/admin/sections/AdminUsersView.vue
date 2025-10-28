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
      <div class="cardLayoutWrapper cardLayoutWrapper--header">
        <BasicCell
          :span="10"
          text="Email"
          icon-name="ArrowUpDown"
          :is-active="sortKey === 'email'"
          :icon-color="getSortColor('email')"
          :on-icon-click="() => toggleSort('email')"
        />
        <BasicCell
          :span="8"
          text="Nom"
          icon-name="ArrowUpDown"
          :is-active="sortKey === 'full_name'"
          :icon-color="getSortColor('full_name')"
          :on-icon-click="() => toggleSort('full_name')"
        />
        <BasicCell
          center
          :span="6"
          text="Rôle"
          icon-name="ArrowUpDown"
          :is-active="sortKey === 'role'"
          :icon-color="getSortColor('role')"
          :on-icon-click="() => toggleSort('role')"
        />
        <BasicCell
          center
          :span="6"
          text="Créé le"
          icon-name="ArrowUpDown"
          :is-active="sortKey === 'created_at'"
          :icon-color="getSortColor('created_at')"
          :on-icon-click="() => toggleSort('created_at')"
        />
        <BasicCell
          center
          :span="6"
          text="Actions"
        />
      </div>

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
            center
            :span="6"
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
  import { useAdminTable } from '@/features/admin/composables/useAdminTable'
  import { useSortableTable } from '@/features/admin/composables/useSortableTable'
  import { supabase } from '@/services/supabaseClient'
  import type { Tables } from '@/types/supabase'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { ref, watchEffect } from 'vue'
  import BasicToolbar from '../BasicToolbar.vue'
  import AdminUserDetailsModal from './AdminUserDetailsModal.vue'

  type UserRow = Tables<'profiles'>
  const toast = useToastStore()

  const {
    filteredData,
    total,
    nbPages,
    page,
    search,
    sortKey,
    sortAsc,
    activeFilters,
    loading,
    hasLoaded,
    fetchData,
    reset,
  } = useAdminTable<'profiles'>({
    table: 'profiles',
    orderBy: 'created_at',
    ascending: false,
    filters: { role: 'all' },
    searchFn: (u, q) =>
      (u.email?.toLowerCase()?.includes(q) ?? false) ||
      (u.full_name?.toLowerCase()?.includes(q) ?? false),
  })

  const { toggleSort, getSortColor } = useSortableTable(sortKey, sortAsc)

  /* Toolbar models */
  const models = ref<{ sortKey: string; selectedRole: 'all' | 'user' | 'admin' }>({
    sortKey: 'created_at',
    selectedRole: 'all',
  })

  watchEffect(() => {
    models.value.sortKey = sortKey.value
    models.value.selectedRole = activeFilters.value.role ?? 'all'
  })

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

  function resetFilters() {
    models.value.selectedRole = 'all'
    models.value.sortKey = 'created_at'
    reset()
  }

  /* Local roles sync + CRUD */
  const localRoles = ref<Record<string, string>>({})

  watchEffect(() => {
    const roles: Record<string, string> = {}
    for (const u of filteredData.value) roles[u.id] = u.role ?? 'user'
    localRoles.value = roles
  })

  async function handleRoleChange(user: UserRow, newRole: string) {
    localRoles.value[user.id] = newRole
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    if (error) toast.show('Erreur de mise à jour du rôle', 'danger')
    else toast.show('Rôle mis à jour ✅', 'success')
  }

  async function handleDelete(user: UserRow) {
    if (!confirm(`Supprimer ${user.email} ?`)) return
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

  /* Utils */
  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }
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
</style>
