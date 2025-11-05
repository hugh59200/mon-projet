<template>
  <FloatingDropdownWrapper
    v-model="isOpen"
    :width="260"
    align="right"
    arrow-align="auto"
    :close-delay="800"
  >
    <!-- ✅ Avatar utilisateur dans la barre -->
    <template #trigger>
      <div class="user-avatar">
        <BasicIconNext
          name="User"
          :size="22"
          class="avatar-icon"
        />
        <div v-if="totalUnread > 0" class="user-badge">
          <BasicText size="body-s" weight="bold">{{ totalUnread }}</BasicText>
        </div>
      </div>
    </template>

    <!-- ✅ Contenu du menu déroulant -->
    <div class="user-menu-content">
      <template v-if="auth.user">
        <!-- 👤 En-tête utilisateur -->
        <UserHeader />

        <div class="divider" />

        <!-- ✅ Liens rapides -->
        <div class="menu-list">
          <BasicButton
            label="Mon profil"
            iconName="UserCircle2"
            variant="ghost"
            type="reverse"
            size="small"
            class="menu-btn"
            @click="goToProfile"
          />

          <BasicButton
            label="Messagerie"
            iconName="MessageSquare"
            variant="ghost"
            type="reverse"
            size="small"
            class="menu-btn"
            @click="router.push('/admin/messagerie')"
          />

          <BasicButton
            label="Statistiques"
            iconName="BarChart3"
            variant="ghost"
            type="reverse"
            size="small"
            class="menu-btn"
            @click="router.push('/admin/statistiques')"
          />

          <BasicButton
            v-if="auth.isAdmin"
            label="Espace Admin"
            iconName="Settings"
            variant="ghost"
            type="reverse"
            size="small"
            class="menu-btn"
            @click="goToAdmin"
          />
        </div>

        <div class="divider" />

        <!-- 🚪 Déconnexion -->
        <BasicButton
          label="Se déconnecter"
          iconName="LogOut"
          variant="ghost"
          type="reverse"
          size="small"
          class="menu-btn text-red"
          @click="handleLogout"
        />
      </template>

      <!-- 🔒 Si non connecté -->
      <template v-else>
        <BasicButton
          label="Connexion"
          iconName="LogIn"
          variant="ghost"
          type="reverse"
          size="small"
          class="menu-btn"
          @click="router.push('/auth/login')"
        />
        <BasicButton
          label="Inscription"
          iconName="UserPlus"
          variant="ghost"
          type="reverse"
          size="small"
          class="menu-btn"
          @click="router.push('/auth/register')"
        />
      </template>
    </div>
  </FloatingDropdownWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { useChatNotifStore } from '@/features/chat/shared/stores/useChatNotifStore'
import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore'
import UserHeader from './UserHeader.vue'

const router = useRouter()
const auth = useAuthStore()
const notifStore = useChatNotifStore()
const adminTabStore = useAdminTabStore()
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
  const target = adminTabStore.getRedirectRoute(true)
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
  gap: 8px;

  .divider {
    height: 1px;
    background: fade(white, 10%);
    margin: 6px 0;
  }

  .menu-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .menu-btn {
    justify-content: flex-start;
    text-align: left;
    width: 100%;
    color: white;
    opacity: 0.9;
    border-radius: 6px;
    padding: 6px 8px;
    transition: all 0.2s ease;

    &:hover {
      background: fade(white, 6%);
      transform: translateY(-1px);
    }

    &.text-red {
      color: @danger-400;

      &:hover {
        background: fade(@danger-400, 8%);
      }
    }
  }
}
</style>
