<template>
  <!-- 🔍 Toolbar (desktop) -->
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

  <!-- 📄 Pagination -->
  <BasicPagination
    :current-page="page"
    :nb-pages="nbPages"
    :nb-pages-max="5"
    :nb-results="total"
    @change="page = $event"
  />

  <!-- 🌐 Wrapper global -->
  <WrapperLoader
    :loading="loading"
    :is-empty="!loading && filteredUsers.length === 0"
    message="Chargement des utilisateurs..."
    empty-message="Aucun utilisateur trouvé 😅"
  >
    <!-- 🧱 Desktop -->
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
        v-for="user in filteredUsers"
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

    <!-- 📱 Mobile -->
    <div class="users--mobile">
      <div class="users-toolbar-mobile">
        <BasicInput
          v-model="search"
          placeholder="Rechercher..."
          icon-name="search"
          clearable
        />

        <div class="row">
          <BasicDropdown
            v-model="sortKey"
            :items="SORT_OPTIONS"
            size="small"
            label="Trier"
            dropdown-type="table"
            force-value
          />
          <BasicDropdown
            v-model="selectedRole"
            :items="ROLE_FILTERS"
            size="small"
            label="Rôle"
            dropdown-type="table"
            force-value
          />
        </div>

        <BasicButton
          label="Réinitialiser les filtres"
          type="secondary"
          size="small"
          variant="outlined"
          block
          @click="resetFilters"
        />
      </div>

      <div class="mobile-cards-list">
        <UserCardMobile
          v-for="user in filteredUsers"
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

  <!-- 🪟 Modal -->
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
  import { computed, onMounted, ref, watch } from 'vue'
  import AdminUserDetailsModal from './AdminUserDetailsModal.vue'

  type UserRow = Tables<'profiles'>
  const toast = useToastStore()

  const users = ref<UserRow[]>([])
  const localRoles = ref<Record<string, string>>({})
  const loading = ref(false)
  const page = ref(1)
  const perPage = 8
  const total = ref(0)
  const search = ref('')
  const sortKey = ref('created_at_desc')
  const selectedRole = ref('all')

  const ROLES = [
    { id: 'user', label: 'Utilisateur' },
    { id: 'admin', label: 'Administrateur' },
  ]
  const ROLE_FILTERS = [{ id: 'all', label: 'Tous' }, ...ROLES]
  const SORT_OPTIONS = [
    { id: 'created_at_desc', label: 'Plus récents' },
    { id: 'created_at_asc', label: 'Plus anciens' },
    { id: 'email_asc', label: 'Email A-Z' },
    { id: 'email_desc', label: 'Email Z-A' },
  ]

  const nbPages = computed(() => Math.ceil(total.value / perPage))

  const filteredUsers = computed(() => {
    let list = [...users.value]
    if (selectedRole.value !== 'all') list = list.filter((u) => u.role === selectedRole.value)
    if (search.value.trim()) {
      const q = search.value.toLowerCase()
      list = list.filter(
        (u) =>
          u.email?.toLowerCase().includes(q) ||
          (u.full_name && u.full_name.toLowerCase().includes(q)),
      )
    }
    switch (sortKey.value) {
      case 'created_at_asc':
        list.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime())
        break
      case 'email_asc':
        list.sort((a, b) => (a.email ?? '').localeCompare(b.email ?? ''))
        break
      case 'email_desc':
        list.sort((a, b) => (b.email ?? '').localeCompare(a.email ?? ''))
        break
      default:
        list.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    }
    return list
  })

  function resetFilters() {
    search.value = ''
    sortKey.value = 'created_at_desc'
    selectedRole.value = 'all'
  }

  async function loadUsers() {
    loading.value = true
    const from = (page.value - 1) * perPage
    const to = from + perPage - 1

    const { data, count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    loading.value = false

    if (error) toast.show('Erreur de chargement', 'danger')
    else {
      users.value = data || []
      total.value = count || 0
      localRoles.value = Object.fromEntries(users.value.map((u) => [u.id, u.role || 'user']))
    }
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
      loadUsers()
    }
  }

  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  /* --- Modale utilisateur --- */
  const isModalVisible = ref(false)
  const selectedUserId = ref<string | null>(null)

  function openUserModal(id: string) {
    selectedUserId.value = id
    isModalVisible.value = true
  }

  watch(page, loadUsers)
  onMounted(loadUsers)
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
