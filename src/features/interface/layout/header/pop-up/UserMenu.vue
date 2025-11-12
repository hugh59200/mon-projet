<template>
  <FloatingDropdownWrapper
    v-model="isOpen"
    :width="260"
    align="right"
    arrow-align="auto"
    :close-delay="800"
    trigger-mode="click"
  >
    <!-- 👤 Avatar utilisateur -->
    <template #trigger>
      <div class="user-menu__avatar">
        <BasicIconNext
          name="User"
          :size="22"
          class="user-menu__avatar-icon"
        />
        <div
          v-if="totalUnread > 0"
          class="user-menu__avatar-badge"
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

    <!-- 📋 Contenu du menu -->
    <div class="user-menu__content">
      <template v-if="user">
        <!-- 🧠 En-tête utilisateur -->
        <UserHeader />

        <div class="user-menu__content-divider user-menu__content-divider--subtle" />

        <!-- 🔗 Liens rapides -->
        <div class="user-menu__content-list">
          <NavButton
            label="Mon profil"
            iconName="UserCog"
            variant="ghost"
            @click="goTo('/profil')"
          />
          <NavButton
            label="Messagerie"
            iconName="MessageSquare"
            variant="ghost"
            @click="goTo('/admin/messagerie')"
          />
          <NavButton
            label="Statistiques"
            iconName="BarChart3"
            variant="ghost"
            @click="goTo('/admin/statistiques')"
          />
          <NavButton
            v-if="isAdmin"
            label="Espace Admin"
            iconName="Settings"
            variant="ghost"
            @click="goToAdmin"
          />
        </div>

        <div class="user-menu__content-divider" />

        <!-- 🚪 Déconnexion -->
        <NavButton
          label="Se déconnecter"
          iconName="LogOut"
          variant="ghost"
          class="text-red"
          @click="handleLogout"
        />
      </template>

      <!-- 🔒 Si non connecté -->
      <template v-else>
        <NavButton
          label="Connexion"
          iconName="LogIn"
          variant="ghost"
          @click="goTo('/auth/login')"
        />
        <NavButton
          label="Inscription"
          iconName="UserPlus"
          variant="ghost"
          @click="goTo('/auth/register')"
        />
      </template>
    </div>
  </FloatingDropdownWrapper>
</template>

<script setup lang="ts">
  import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useChatNotifStore } from '@/features/chat/shared/stores/useChatNotifStore'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import UserHeader from './UserHeader.vue'

  const router = useRouter()
  const { user, isAdmin, signOut } = useAuthStore()
  const notifStore = useChatNotifStore()
  const adminTabStore = useAdminTabStore()
  const isOpen = ref(false)

  const totalUnread = computed(() =>
    Object.values(notifStore.unreadByUser || {}).reduce((a, b) => a + (b || 0), 0),
  )

  function goTo(path: string) {
    isOpen.value = false
    router.push(path)
  }

  function goToAdmin() {
    isOpen.value = false
    const target = adminTabStore.getRedirectRoute(true)
    router.push(target)
  }

  async function handleLogout() {
    isOpen.value = false
    adminTabStore.clearLastTab()
    await signOut()
  }
</script>

<style scoped lang="less">
  /* ==========================================================
   👤 USER MENU
   ========================================================== */

  .user-menu {
    &__avatar {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: fade(white, 6%);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        background: fade(white, 10%);
      }

      &-icon {
        color: white;
      }

      &-badge {
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
        font-size: 11px;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &-divider {
        height: 1px;
        background: fade(white, 10%);
        margin: 6px 0;

        &--subtle {
          margin-top: 2px;
          margin-bottom: 4px;
          background: fade(white, 4%);
        }
      }

      &-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .text-red {
        color: @danger-400;

        &:hover {
          background: fade(@danger-400, 8%);
        }
      }
    }
  }
</style>
