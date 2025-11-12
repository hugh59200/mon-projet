<template>
  <div>
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un utilisateur..."
      :show-reset="true"
      @reset="reset"
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
      <template v-if="isDesktop || isTablet">
        <div class="cardLayoutWrapper cardLayoutWrapper--header">
          <BasicCell
            :span="8"
            text="Email"
            :is-active="sortKey === 'email'"
            :icon-color="getSortColor('email')"
            :on-icon-click="() => toggleSort('email')"
          />
          <BasicCell
            :span="10"
            text="Nom"
            :is-active="sortKey === 'full_name'"
            :icon-color="getSortColor('full_name')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('full_name')"
          />
          <BasicCell
            :span="6"
            text="Rôle"
            :is-active="sortKey === 'role'"
            :icon-color="getSortColor('role')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('role')"
          />
          <BasicCell
            :span="8"
            text="Créé le"
            :is-active="sortKey === 'created_at'"
            :icon-color="getSortColor('created_at')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('created_at')"
          />
          <BasicCell :span="4" />
        </div>
        <div
          v-for="user in filteredData"
          class="gridElemWrapper"
        >
          <div
            class="cardLayoutWrapper list"
            @click="openUserModal(user.id)"
          >
            <BasicCell
              :span="8"
              :text="user.full_name || '—'"
            />
            <BasicCell
              :span="10"
              :text="user.email || '—'"
            />
            <BasicCell :span="6">
              <BasicBadge
                :label="getLabelBadge(user.role as Role)"
                :type="getTypeBadge(user.role as Role)"
                size="small"
              />
            </BasicCell>
            <BasicCell
              :span="8"
              :text="formatDate(user.created_at)"
            />
            <BasicCellActionIcon
              icon-name="trash"
              tooltip="Supprimer"
              center
              danger
              :span="4"
              @click.stop="deleteUser(user)"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <UserCardMobile
          v-for="user in filteredData"
          :key="user.id"
          :role="localRoles[user.id] ?? 'user'"
          @update:role="(newRole: Role) => (localRoles[user.id] = newRole)"
          :user="user"
          :roles="ROLES"
          :format-date="formatDate"
          :handle-role-change="changeUserRole"
          :open-user-modal="openUserModal"
          :handle-delete="deleteUser"
          class="gridElemWrapper list list--mobile"
        />
      </template>
    </WrapperLoader>
    <teleport to="#app">
      <AdminUserDetailsModal
        v-if="selectedUserId"
        v-model="isModalVisible"
        :user-id="selectedUserId"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { ROLES } from '@/features/admin/constants/users'
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import { useSortableTable } from '@/features/admin/shared/composables/useSortableTable'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { useUserActions } from '@/supabase/actions/useUserActions'
  import type { Tables } from '@/supabase/types/supabase'
  import type { Role } from '@/supabase/types/supabase.types'
  import { formatDate, getLabelBadge, getTypeBadge } from '@/utils'
  import { ref, watch } from 'vue'
  import BasicToolbar from '../shared/components/BasicToolbar.vue'
  import UserCardMobile from './mobile/UserCardMobile.vue'
  import AdminUserDetailsModal from './modale/AdminUserDetailsModal.vue'

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

  const { isTablet, isDesktop } = useDeviceBreakpoint()

  const { deleteUser, changeUserRole } = useUserActions(fetchData)
  const { toggleSort, getSortColor } = useSortableTable<Tables<'profiles'>>(
    sortKey,
    sortAsc,
    filteredData,
  )

  const localRoles = ref<Record<string, Role>>({})

  watch(
    filteredData,
    (rows) => {
      const roles: Record<string, Role> = {}
      const validRoles: Role[] = ['user', 'admin']
      for (const u of rows) {
        const role = (u.role as Role) ?? 'user'
        roles[u.id] = validRoles.includes(role) ? role : 'user'
      }
      localRoles.value = roles
    },
    { immediate: true },
  )

  const isModalVisible = ref(false)
  const selectedUserId = ref<string | null>(null)

  function openUserModal(id: string) {
    selectedUserId.value = id
    isModalVisible.value = true
  }
</script>
<style scoped lang="less">
  @import '../shared/style/list-base.less';
</style>
