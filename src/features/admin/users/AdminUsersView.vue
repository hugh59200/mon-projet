<template>
  <BasicToolbar
    v-model:search="search"
    :search-placeholder="'Rechercher un utilisateur...'"
    :show-reset="true"
    @reset="reset()"
  />
  <BasicPagination
    :current-page="page"
    :nb-pages="nbPages"
    :nb-results="total"
    :nb-pages-max="5"
    :auto-fetch="fetchData"
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
              :item-class="(r: { id: string }) => getRoleClass(r.id)"
              @update:model-value="(v) => v && handleRoleChange(user, v as Role)"
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
  import { ROLES } from '@/features/admin/constants/users'
  import { deleteUser, updateUserRole } from '@/supabase/api/users'
  import type { Tables } from '@/supabase/types/supabase'
  import type { Role } from '@/supabase/types/supabase.types'
  import { formatDate } from '@/utils/index'
  import { getRoleClass } from '@/utils/roles'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { ref, watch } from 'vue'
  import BasicToolbar from '../BasicToolbar.vue'
  import AdminUserDetailsModal from '../users/AdminUserDetailsModal.vue'

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

  const localRoles = ref<Record<string, string>>({})

  watch(
    filteredData,
    (rows) => {
      const roles: Record<string, string> = {}
      for (const u of rows) roles[u.id] = u.role ?? 'user'
      localRoles.value = roles
    },
    { immediate: true },
  )

  async function handleRoleChange(user: UserRow, newRole: Role) {
    try {
      await updateUserRole(user.id, newRole)
      toast.show('Rôle mis à jour ✅', 'success')
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    }
  }

  async function handleDelete(user: UserRow) {
    if (!confirm(`Supprimer ${user.email} ?`)) return
    try {
      await deleteUser(user.id)
      toast.show('Utilisateur supprimé ✅', 'success')
      fetchData()
    } catch (err: any) {
      toast.show(`Erreur suppression : ${(err as Error).message}`, 'danger')
    }
  }

  /* Modal */
  const isModalVisible = ref(false)
  const selectedUserId = ref<string | null>(null)
  function openUserModal(id: string) {
    selectedUserId.value = id
    isModalVisible.value = true
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
