import { useUserActions } from '../composables/useUserActions'
import { supabaseSilent as supabase } from '@/supabase/supabaseClient'
import type { Profiles } from '@/supabase/types/supabase.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersAdminStore = defineStore('users-admin', () => {
  const users = ref<Profiles[]>([])
  const loading = ref(false)

  async function loadUsers() {
    loading.value = true
    const { data } = await supabase.from('profiles').select('*')
    users.value = data ?? []
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
