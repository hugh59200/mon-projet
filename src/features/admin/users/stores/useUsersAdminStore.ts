import { useUserActions } from '../composables/useUserActions'
import { fetchAllProfiles } from '@/api/supabase/users'
import type { Profiles } from '@/supabase/types/supabase.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersAdminStore = defineStore('users-admin', () => {
  const users = ref<Profiles[]>([])
  const loading = ref(false)

  async function loadUsers() {
    loading.value = true
    users.value = await fetchAllProfiles()
    loading.value = false
  }

  const { deleteUser, changeUserRole } = useUserActions(loadUsers)

  return {
    users,
    loading,
    loadUsers,
    deleteUser,
    changeUserRole,
  }
})
