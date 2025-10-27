<template>
  <div class="users-toolbar users-toolbar--desktop cardLayoutWrapper">
    <div class="elem elem--span-12">
      <BasicInput
        v-model="search"
        placeholder="Rechercher un utilisateur..."
        icon-name="search"
        clearable
      />
    </div>
    <div class="elem elem--center elem--span-8">
      <BasicDropdown
        v-model="sortKey"
        :items="SORT_OPTIONS"
        size="small"
        label="Trier par"
        dropdown-type="table"
        force-value
      />
    </div>
    <div class="elem elem--center elem--span-8">
      <BasicDropdown
        v-model="selectedRole"
        :items="ROLE_FILTERS"
        size="small"
        label="Rôle"
        dropdown-type="table"
        force-value
      />
    </div>
    <div class="elem elem--center elem--span-6 justify-end">
      <BasicButton
        label="Réinitialiser"
        type="secondary"
        size="small"
        variant="outlined"
        @click="resetFilters"
      />
    </div>
  </div>
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
        <div class="elem elem--span-10"><span>Email</span></div>
        <div class="elem elem--span-8"><span>Nom</span></div>
        <div class="elem elem--center elem--span-6"><span>Rôle</span></div>
        <div class="elem elem--center elem--span-6"><span>Créé le</span></div>
        <div class="elem elem--center elem--span-6"><span>Actions</span></div>
      </div>
      <div
        class="gridElemWrapper"
        v-for="user in filteredData"
        :key="user.id"
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
    <div class="users--mobile">
      <div class="mobile-cards-list">
        <UserCardMobile
          v-for="user in filteredData"
          :key="user.id"
          v-model:role="localRoles[user.id]!"
          :user="user"
          :roles="ROLES"
          :format-date="formatDate"
          :handle-role-change="handleRoleChange"
          :open-user-modal="openUserModal"
          :handle-delete="handleDelete"
        />
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
  import { UserCardMobile } from '@/features/admin/sections/mobile'
  import { supabase } from '@/services/supabaseClient'
  import type { Tables } from '@/types/supabase'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { ref, watchEffect } from 'vue'
  import { usePaginatedSupabaseTable } from '../composables/usePaginatedSupabaseTable'
  import AdminUserDetailsModal from './AdminUserDetailsModal.vue'

  type UserRow = Tables<'profiles'>
  const toast = useToastStore()

  /* --- Composable --- */
  const {
    filteredData,
    total,
    nbPages,
    loading,
    page,
    search,
    sortKey,
    hasLoaded,
    fetchData,
    reset,
  } = usePaginatedSupabaseTable<UserRow>({
    table: 'profiles',
    orderBy: 'created_at',
    ascending: false,
    searchFn: (u, q) =>
      (u.email?.toLowerCase()?.includes(q) ?? false) ||
      (u.full_name?.toLowerCase()?.includes(q) ?? false),
  })

  /* --- Filtres supplémentaires --- */
  const selectedRole = ref<'all' | 'user' | 'admin'>('all')
  const localRoles = ref<Record<string, string>>({})
  const ROLES = [
    { id: 'user', label: 'Utilisateur' },
    { id: 'admin', label: 'Administrateur' },
  ]
  const ROLE_FILTERS = [{ id: 'all', label: 'Tous' }, ...ROLES]
  const SORT_OPTIONS = [
    { id: 'created_at', label: 'Plus récents' },
    { id: 'email', label: 'Email' },
  ]

  /* --- Actions --- */
  function resetFilters() {
    selectedRole.value = 'all'
    reset()
  }

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

  /* --- Modale --- */
  const isModalVisible = ref(false)
  const selectedUserId = ref<string | null>(null)
  function openUserModal(id: string) {
    selectedUserId.value = id
    isModalVisible.value = true
  }

  /* --- Utils --- */
  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  watchEffect(() => {
    if (filteredData.value.length > 0) {
      const newRoles: Record<string, string> = {}
      for (const u of filteredData.value) {
        newRoles[u.id] = u.role ?? 'user' // ou 'user' par défaut
      }
      localRoles.value = newRoles
    }
  })
</script>

<style scoped lang="less">
  .users-toolbar {
    border: 1px solid @neutral-200;
    border-radius: 8px;
    background: @neutral-50;
    margin-bottom: 16px;
    padding: 10px 14px;
    grid-template-columns: repeat(36, 1fr);
    gap: 12px;
    .elem {
      display: flex;
      align-items: center;
    }
    .justify-end {
      justify-content: flex-end;
    }
  }
  .users-toolbar-mobile {
    background: @neutral-50;
    border: 1px solid @neutral-200;
    border-radius: 8px;
    margin-bottom: 14px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    .row {
      display: flex;
      gap: 10px;
    }
  }
  .users--desktop {
    display: block;
  }
  .users--mobile {
    display: none;
  }
  .mobile-cards-list {
    display: flex;
    flex-direction: column;
    gap: 14px; // <-- l'espacement magique
  }
  .user-card {
    background: @white;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 14px;
    box-shadow: 0 1px 3px fade(@neutral-900, 6%);
    transition:
      box-shadow 0.2s ease,
      transform 0.2s ease;
    &:hover {
      box-shadow: 0 3px 8px fade(@neutral-900, 8%);
      transform: translateY(-2px);
    }
    &__header {
      display: flex;
      justify-content: space-between;
    }
    &__info {
      display: flex;
      flex-direction: column;
    }
    &__email {
      font-weight: 600;
      color: @primary-950;
    }
    &__name {
      font-size: @font-size-body-m;
      color: @neutral-500;
    }
    &__role {
      .role-chip {
        padding: 3px 8px;
        border-radius: 6px;
        font-size: @font-size-body-s;
        font-weight: 600;
        &--user {
          background: fade(@neutral-400, 15%);
          color: @neutral-700;
        }
        &--admin {
          background: fade(@primary-400, 15%);
          color: @primary-700;
        }
      }
    }
    &__infos {
      border-top: 1px solid @neutral-100;
      padding-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      .label {
        color: @neutral-500;
      }
      .value {
        color: @primary-900;
      }
    }
    &__actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
  .users__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;
    gap: 12px;
    padding: 60px 20px;
    color: @neutral-600;
    min-height: 200px;
  }
  @media (max-width: 1000px) {
    .users-toolbar--desktop,
    .users--desktop {
      display: none;
    }
    .users--mobile {
      display: block;
    }
  }
</style>
