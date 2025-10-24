import { deleteUserById, updateUserRole, type UserProfile } from '@/services/userService'
import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersAdminStore = defineStore('users-admin', () => {
  const users = ref<UserProfile[]>([])
  const loading = ref(false)
  const search = ref('')
  const page = ref(1)
  const limit = 10
  const totalResults = ref(0)
  const totalPages = ref(1)
  const toast = useToastStore()

  async function loadUsers() {
    loading.value = true
    try {
      const offset = (page.value - 1) * limit
      const { data, count, error } = await fetchUsersWithCount(search.value, limit, offset)
      if (error) throw error

      users.value =
        data?.map((user) => ({
          id: user.id,
          email: user.email ?? '',
          full_name: user.full_name,
          role: user.role as 'admin' | 'user',
          created_at: user.created_at ?? '',
          avatar_url: user.avatar_url,
        })) ?? []
      totalResults.value = count ?? 0
      totalPages.value = Math.ceil(totalResults.value / limit)
    } catch (err) {
      toast.show('Erreur lors du chargement des utilisateurs', 'danger')
    } finally {
      loading.value = false
    }
  }

  async function changeRole(user: UserProfile) {
    try {
      await updateUserRole(user.id, user.role)
      toast.show(`Rôle de ${user.email} mis à jour ✅`, 'success')
    } catch {
      toast.show('Erreur lors de la mise à jour du rôle', 'danger')
    }
  }

  async function deleteUser(user: UserProfile) {
    if (!confirm(`Supprimer ${user.email} ?`)) return
    try {
      await deleteUserById(user.id)
      users.value = users.value.filter((u) => u.id !== user.id)
      toast.show('Utilisateur supprimé ✅', 'success')
    } catch {
      toast.show('Erreur lors de la suppression', 'danger')
    }
  }

  return {
    users,
    loading,
    search,
    page,
    limit,
    totalResults,
    totalPages,
    loadUsers,
    changeRole,
    deleteUser,
  }
})

// helper (ajoute dans le même fichier ou dans ton service)
import { supabase } from '@/services/supabaseClient'

async function fetchUsersWithCount(search = '', limit = 10, offset = 0) {
  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  return query
}
