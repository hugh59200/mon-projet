<template>
  <div class="admin-users">
    <BasicText
      size="h4"
      weight="bold"
      class="admin-users__title"
    >
      Gestion des utilisateurs
    </BasicText>

    <!-- 🔍 Barre de recherche -->
    <BasicInput
      v-model="store.search"
      placeholder="Rechercher par email ou nom..."
      input-type="form"
      size="medium"
      autocomplete="off"
      class="admin-users__search"
      @input="handleSearch"
    />
    <!-- 📄 Pagination -->
    <BasicPagination
      v-if="store.totalPages > 1"
      :nb-pages="store.totalPages"
      :current-page="store.page"
      :nb-pages-max="5"
      :nb-results="store.totalResults"
      @change="handlePageChange"
    />

    <!-- 📊 Tableau des utilisateurs -->
    <div
      v-if="store.loading"
      class="admin-users__loading"
    >
      Chargement des utilisateurs...
    </div>

    <div
      v-else
      class="admin-users__table"
    >
      <div class="admin-users__header">
        <span>Email</span>
        <span>Nom</span>
        <span>Rôle</span>
        <span>Créé le</span>
        <span>Actions</span>
      </div>

      <div
        v-for="user in store.users"
        :key="user.id"
        class="admin-users__row"
      >
        <span>{{ user.email }}</span>
        <span>{{ user.full_name ?? '—' }}</span>
        <span>
          <select
            v-model="user.role"
            @change="store.changeRole(user)"
            class="admin-users__role"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </span>
        <span>{{ formatDate(user.created_at) }}</span>
        <div class="admin-users__actions">
          <BasicButton
            type="danger"
            variant="ghost"
            size="small"
            label="Supprimer"
            @click="store.deleteUser(user)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BasicButton, BasicInput, BasicText } from '@designSystem/components'
  import { onMounted } from 'vue'
  import { useUsersAdminStore } from './useUsersAdminStore'

  const store = useUsersAdminStore()

  function handlePageChange(page: number) {
    store.page = page
    store.loadUsers()
  }

  function handleSearch() {
    store.page = 1
    store.loadUsers()
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  onMounted(store.loadUsers)
</script>

<style scoped lang="less">
  .admin-users {
    width: 900px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__title {
      text-align: center;
    }

    &__search {
      width: 100%;
      margin-bottom: 10px;
    }

    &__table {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px solid @neutral-200;
    }

    &__header,
    &__row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 1.5fr 1fr;
      align-items: center;
      padding: 10px;
    }

    &__header {
      background: @neutral-100;
      font-weight: bold;
      border-bottom: 1px solid @neutral-200;
    }

    &__row {
      background: white;
      border: 1px solid @neutral-100;
      border-radius: 6px;
      transition: background 0.2s;

      &:hover {
        background: @neutral-50;
      }
    }

    &__role {
      border-radius: 6px;
      padding: 4px;
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
    }

    &__loading {
      text-align: center;
      color: @neutral-600;
    }
  }
</style>
