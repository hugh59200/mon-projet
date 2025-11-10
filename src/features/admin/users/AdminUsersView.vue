<template>
  <div>
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
      <!-- 💻 TABLEAU DESKTOP -->
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
            <BasicCellDropdown
              v-model="localRoles[user.id]"
              :items="ROLES"
              center
              :span="6"
              dropdown-type="table"
              size="small"
            />
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
              danger
              :span="3"
              @click="deleteUser(user)"
            />
          </div>
        </div>
      </div>

      <!-- 📱 CARTES MOBILES -->
      <div class="mobile-cards-list">
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
        />
      </div>
    </WrapperLoader>

    <!-- 🪟 MODAL -->
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
  import { useUserActions } from '@/supabase/actions/useUserActions'
  import type { Role } from '@/supabase/types/supabase.types'
  import { formatDate } from '@/utils'
  import { ref, watch } from 'vue'
  import UserCardMobile from './mobile/UserCardMobile.vue'
  import AdminUserDetailsModal from './modale/AdminUserDetailsModal.vue'
import BasicToolbar from '../shared/components/BasicToolbar.vue'

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

  const { deleteUser, changeUserRole } = useUserActions(fetchData)

  const { toggleSort, getSortColor } = useSortableTable(sortKey, sortAsc)

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

  function openUserModal(id: string) {
    selectedUserId.value = id
    isModalVisible.value = true
  }

  const isModalVisible = ref(false)
  const selectedUserId = ref<string | null>(null)
</script>

<style scoped lang="less">
  .users--mobile {
    display: none;
  }
  .mobile-cards-list {
    display: none;
  }

  @media (max-width: 1000px) {
    .users--desktop {
      display: none;
    }
    .mobile-cards-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
