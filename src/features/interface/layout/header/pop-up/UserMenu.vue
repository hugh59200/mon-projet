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
   👤 USER MENU — Neural Glass v2
   ========================================================== */

  .user-menu {
    /* -----------------------------
     🔵 AVATAR (trigger)
  ----------------------------- */
    &__avatar {
      position: relative;
      width: 36px;
      height: 36px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;
      cursor: pointer;

      background: color-mix(in srgb, var(--secondary-900) 55%, transparent);
      backdrop-filter: blur(6px);

      border: 1px solid color-mix(in srgb, @neutral-500 8%, transparent);

      transition: all 0.25s ease;

      /* ✨ Glow hover */
      &:hover {
        background: color-mix(in srgb, var(--secondary-900) 70%, transparent);
        box-shadow: 0 0 8px color-mix(in srgb, var(--primary-500) 25%, transparent);
        transform: translateY(-1px);
      }

      &-icon {
        color: white;
        transition: opacity 0.25s ease;
        opacity: 0.9;
      }

      /* 🔵 Badge messages non lus */
      &-badge {
        position: absolute;
        top: -2px;
        right: -2px;

        background: var(--primary-700);
        color: white;

        width: 15px;
        height: 15px;
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 11px;
        font-weight: bold;

        box-shadow: 0 0 0 2px color-mix(in srgb, var(--secondary-900) 80%, transparent);
      }
    }

    /* -----------------------------
     📋 CONTENU DU MENU
  ----------------------------- */
    &__content {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-bottom: 4px;

      /* -------------------------
       Dividers
    ------------------------- */
      &-divider {
        height: 1px;
        background: fade(white, 8%);
        margin: 8px 0;

        &--subtle {
          height: 1px;
          background: fade(white, 4%);
          margin: 4px 0 6px 0;
        }
      }

      /* -------------------------
       Listes (liens rapides)
    ------------------------- */
      &-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 2px 0;
      }

      /* -------------------------
       Bouton rouge (Déconnexion)
    ------------------------- */
      .text-red {
        color: @danger-400 !important;

        &:hover {
          background: color-mix(in srgb, @danger-400 10%, transparent);
        }
      }
    }
  }
</style>
