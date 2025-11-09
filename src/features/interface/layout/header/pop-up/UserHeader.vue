<template>
  <transition
    name="fade-slide"
    appear
  >
    <div class="user-header">
      <div class="user-avatar">
        <img
          v-if="avatarPreview"
          :src="avatarPreview"
          alt="Avatar"
          class="avatar-image"
        />
        <div
          v-else
          class="avatar-fallback"
        >
          <BasicText
            size="body-xl"
            weight="bold"
            color="white"
          >
            {{ initials }}
          </BasicText>
        </div>
      </div>
      <div class="user-texts">
        <BasicText
          size="body-m"
          weight="bold"
          color="white"
          class="user-email"
        >
          {{ user?.email || 'Utilisateur' }}
        </BasicText>
        <BasicBadge
          v-if="isAdmin"
          type="success"
          size="small"
          label="admin"
          class="user-badge"
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { supabase } from '@/supabase/supabaseClient'
  import { computed, onMounted, ref } from 'vue'

  const avatarPreview = ref<string | null>(null)
  const { user, isAdmin } = useAuthStore()

  async function loadProfile() {
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
    if (data) {
      avatarPreview.value = data.avatar_url ? getPublicUrl(data.avatar_url) : null
    }
  }

  function getPublicUrl(path: string) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  }

  const initials = computed(() => {
    const email = user?.email || ''
    const base = email.split('@')[0] || ''
    const parts = base.replace(/[^a-zA-Z0-9]/g, ' ').split(' ')
    if (parts.length >= 2) return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
    return base.slice(0, 2).toUpperCase()
  })

  onMounted(async () => {
    await loadProfile()
  })
</script>

<style scoped lang="less">
  .user-header {
    display: flex;
    align-items: center;
    padding: 8px 0;
    gap: 8px;

    .user-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .avatar-fallback {
        background: @primary-600;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .user-texts {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;

      .user-role {
        margin-top: 2px;
      }
    }
  }
</style>
