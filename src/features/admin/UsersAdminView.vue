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
      v-model="search"
      placeholder="Rechercher par email ou nom..."
      input-type="form"
      size="medium"
      autocomplete="off"
      class="admin-users__search"
    />

    <!-- 📋 Tableau des utilisateurs -->
    <div class="admin-users__table">
      <div class="admin-users__header">
        <span>Email</span>
        <span>Nom</span>
        <span>Rôle</span>
        <span>Créé le</span>
        <span>Actions</span>
      </div>

      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="admin-users__row"
      >
        <span>{{ user.email }}</span>
        <span>{{ user.full_name ?? '—' }}</span>
        <span>
          <select
            v-model="user.role"
            @change="updateRole(user)"
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
            @click="deleteUser(user)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useToastStore } from '@/features/interface/toast/useToastStore'
  import { supabase } from '@/services/supabaseClient'
  import { computed, onMounted, ref } from 'vue'

  const users = ref<any[]>([])
  const search = ref('')
  const toast = useToastStore()

  async function loadUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.showToast('Erreur lors du chargement des utilisateurs', 'danger')
    } else {
      users.value = data
    }
  }

  async function updateRole(user: any) {
    const { error } = await supabase.from('profiles').update({ role: user.role }).eq('id', user.id)

    if (error) toast.showToast('Erreur mise à jour rôle', 'danger')
    else toast.showToast(`Rôle de ${user.email} mis à jour ✅`, 'success')
  }

  async function deleteUser(user: any) {
    if (!confirm(`Supprimer ${user.email} ?`)) return
    const { error } = await supabase.from('profiles').delete().eq('id', user.id)

    if (error) toast.showToast('Erreur suppression utilisateur', 'danger')
    else {
      users.value = users.value.filter((u) => u.id !== user.id)
      toast.showToast('Utilisateur supprimé ✅', 'success')
    }
  }

  const filteredUsers = computed(() => {
    const term = search.value.toLowerCase()
    return users.value.filter(
      (u) => u.email?.toLowerCase().includes(term) || u.full_name?.toLowerCase().includes(term),
    )
  })

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  onMounted(loadUsers)
</script>

<style scoped lang="less">
  .admin-users {
    max-width: 900px;
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

    &__actions {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
