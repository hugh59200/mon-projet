<template>
  <div class="admin-users">
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher un utilisateur..."
      :show-reset="true"
      @reset="reset"
    >
      <template #filters>
        <div class="admin-users__filters">
          <PremiumButton
            :label="`Tous (${total})`"
            :type="userFilter === 'all' ? 'primary' : 'secondary'"
            size="sm"
            variant="ghost"
            @click="userFilter = 'all'"
          />
          <PremiumButton
            :label="`Clients (${userCount})`"
            :type="userFilter === 'user' ? 'primary' : 'secondary'"
            size="sm"
            variant="ghost"
            @click="userFilter = 'user'"
          />
          <PremiumButton
            :label="`Admins (${adminCount})`"
            :type="userFilter === 'admin' ? 'primary' : 'secondary'"
            size="sm"
            variant="ghost"
            @click="userFilter = 'admin'"
          />
        </div>
      </template>
      <template #pagination>
        <BasicPagination
          :current-page="page"
          :nb-pages="nbPages"
          :nb-results="displayedTotal"
          :nb-pages-max="5"
          :auto-fetch="fetchData"
          size="small"
          @change="page = $event"
        />
      </template>
    </BasicToolbar>

    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && displayedUsers.length === 0"
      message="Chargement des utilisateurs..."
      empty-message="Aucun utilisateur trouvé 😅"
    >
      <template v-if="isDesktop || isTablet">
        <div class="cardLayoutWrapper cardLayoutWrapper--header admin-users__header">
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
          v-for="user in displayedUsers"
          :key="user.id"
          class="gridElemWrapper admin-users__row"
        >
          <div
            class="cardLayoutWrapper admin-users__item"
            @click="openUserModal(user.id)"
          >
            <BasicCell
              :span="8"
              :text="user.email || '—'"
            />
            <BasicCell
              :span="10"
              :text="user.full_name || '—'"
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
              @click="deleteUser(user)"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <UserCardMobile
          v-for="user in displayedUsers"
          :key="user.id"
          :role="user.role as Role"
          :user="user"
          :format-date="formatDate"
          :open-user-modal="openUserModal"
          :handle-delete="deleteUser"
          class="gridElemWrapper admin-users__mobile-card"
        />
      </template>
    </WrapperLoader>

    <teleport to="#app">
      <AdminUserDetailsModal
        v-if="selectedUserId"
        v-model="isModalVisible"
        :user-id="selectedUserId"
        @refresh="fetchData"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import { useSortableTable } from '@/features/admin/shared/composables/useSortableTable'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { useUserActions } from './composables/useUserActions'
  import type { Tables } from '@/supabase/types/supabase'
  import type { Role } from '@/supabase/types/supabase.types'
  import { formatDate, getLabelBadge, getTypeBadge } from '@/utils'
  import { computed, ref, watch } from 'vue'
  import BasicToolbar from '@/features/admin/shared/components/BasicToolbar.vue'
  import UserCardMobile from './mobile/UserCardMobile.vue'
  import AdminUserDetailsModal from './modale/AdminUserDetailsModal.vue'

  // 1. Hook Admin Table avec persistance URL
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
    getInitialValue,
    route,
    router,
  } = useAdminTable<'profiles'>({
    table: 'profiles',
    orderBy: 'created_at',
    ascending: false,
    filters: { role: 'all' },
    searchFn: (u, q) =>
      (u.email?.toLowerCase()?.includes(q) ?? false) ||
      (u.full_name?.toLowerCase()?.includes(q) ?? false),
    persistInUrl: true,
  })

  const { isTablet, isDesktop } = useDeviceBreakpoint()
  const { deleteUser } = useUserActions(fetchData)
  const { toggleSort, getSortColor } = useSortableTable<Tables<'profiles'>>(
    sortKey,
    sortAsc,
    filteredData,
  )

  // Filtres Local (User/Admin) avec persistance URL
  type UserFilterType = 'all' | 'user' | 'admin'
  const userFilter = ref<UserFilterType>(getInitialValue('role', 'all') as UserFilterType)

  // Synchroniser le filtre avec l'URL
  watch(userFilter, (val) => {
    if (!router || !route) return
    const query = { ...route.query } as Record<string, string>
    if (val !== 'all') {
      query.role = val
    } else {
      delete query.role
    }
    router.replace({ query })
  })

  const displayedUsers = computed(() => {
    if (userFilter.value === 'all') return filteredData.value
    if (userFilter.value === 'admin') {
      return filteredData.value.filter((u) => u.role === 'admin')
    }
    return filteredData.value.filter((u) => u.role !== 'admin')
  })

  const userCount = computed(() => filteredData.value.filter((u) => u.role !== 'admin').length)
  const adminCount = computed(() => filteredData.value.filter((u) => u.role === 'admin').length)
  const displayedTotal = computed(() => displayedUsers.value.length)

  // Modale
  const isModalVisible = ref(false)
  const selectedUserId = ref<string | null>(null)

  function openUserModal(id: string) {
    selectedUserId.value = id
    isModalVisible.value = true
  }
</script>

<style scoped lang="less">
  @import '@designSystem/fondation/breakpoints/responsive-mixins.less';
  .admin-users {
    &__filters {
      display: flex;
      gap: 8px;
      margin-left: 16px;

      .respond-tablet({
        margin-left: 0;
        gap: 6px;
      });

      .respond-mobile({
        margin-left: 0;
        gap: 4px;
        flex-wrap: nowrap;

        :deep(.PremiumButton) {
          padding: 6px 10px;
          font-size: 12px;
          flex-shrink: 0;
        }
      });
    }

    &__item {
      cursor: pointer;
      transition: background-color 0.15s ease;

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.08);
      }
    }

    &__mobile-card {
      margin: 4px 0;
    }
  }
</style>
