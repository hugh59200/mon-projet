<template>
  <FloatingDropdownWrapper
    v-model="isOpen"
    :width="220"
    align="right"
    arrow-align="auto"
    :close-delay="1000"
  >
    <template #trigger>
      <div class="user-avatar">
        <BasicIconNext
          name="User"
          :size="22"
          class="avatar-icon"
        />
        <div
          v-if="totalUnread > 0"
          class="user-badge"
        >
          <BasicText
            size="body-s"
            weight="bold"
          >
            {{ totalUnread }}
          </BasicText>
        </div>
      </div>
    </template>
    <div class="user-menu-content">
      <template v-if="auth.user">
        <div class="user-header">
          <BasicText
            weight="bold"
            size="body-m"
          >
            {{ auth.user.email || 'Utilisateur' }}
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-300"
          >
            {{ auth.user.email }}
          </BasicText>
        </div>

        <div class="divider" />
        <div @click="goToProfile">Mon profil</div>
        <div
          v-if="auth.isAdmin"
          @click="goToAdmin"
        >
          Espace Admin
        </div>
        <div class="divider" />
        <div @click="handleLogout">Se déconnecter</div>
      </template>

      <template v-else>
        <div @click="router.push('/auth/login')">Connexion</div>
        <div @click="router.push('/auth/register')">Inscription</div>
      </template>
    </div>
  </FloatingDropdownWrapper>
</template>

<script setup lang="ts">
  import { useChatNotifStore } from '@/features/admin/chat/shared/stores/useChatNotifStore'
  import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore'
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const auth = useAuthStore()
  const adminTabStore = useAdminTabStore()
  const notifStore = useChatNotifStore()
  const isOpen = ref(false)

  const totalUnread = computed(() =>
    Object.values(notifStore.unreadByUser || {}).reduce((a, b) => a + (b || 0), 0),
  )

  function goToProfile() {
    isOpen.value = false
    router.push('/profil')
  }

  function goToAdmin() {
    isOpen.value = false
    const target = adminTabStore.getRedirectRoute()
    router.push(target)
  }

  async function handleLogout() {
    isOpen.value = false
    adminTabStore.clearLastTab()
    await auth.signOut()
  }
</script>

<style scoped lang="less">
  .user-avatar {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: fade(white, 6%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition:
      background 0.25s ease,
      box-shadow 0.25s ease;

    &:hover {
      background: fade(white, 10%);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
    }

    .avatar-icon {
      color: white;
      opacity: 0.9;
    }

    .user-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: @primary-500;
      color: white;
      border-radius: 50%;
      height: 14px;
      width: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 2px @neutral-900;
      font-size: 11px;
    }
  }

  .user-menu-content {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .divider {
      height: 1px;
      background: fade(white, 10%);
      margin: 4px 0;
    }

    div {
      cursor: pointer;
      padding: 6px 4px;
      border-radius: 6px;
      transition: background 0.2s ease;
      &:hover {
        background: fade(white, 6%);
      }
    }

    .user-header {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding-bottom: 6px;
    }
  }
</style>
