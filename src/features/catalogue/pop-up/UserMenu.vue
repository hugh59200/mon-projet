<template>
  <BasicTooltip
    label="Mon compte"
    position="bottom"
    :visible="!menuOpen"
  >
    <div
      class="user-menu"
      ref="menuRef"
    >
      <!-- 👤 Icône profil + badge -->
      <div
        class="user-avatar"
        @click="toggleMenu"
      >
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

      <!-- 📋 Dropdown -->
      <transition name="fade-slide">
        <div
          v-if="menuOpen"
          class="user-dropdown"
          v-click-outside="{ callback: () => (menuOpen = false), exclude: [menuRef] }"
        >
          <template v-if="auth.user">
            <div class="user-header">
              <BasicText
                weight="bold"
                size="body-m"
              >
                {{ auth.user.fullName || 'Utilisateur' }}
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
      </transition>
    </div>
  </BasicTooltip>
</template>

<script setup lang="ts">
  import { vClickOutside } from '@/directives/vClickOutside'
  import { useChatNotifStore } from '@/features/admin/chat/shared/stores/useChatNotifStore'
  import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore'
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  defineOptions({ directives: { clickOutside: vClickOutside } })

  const auth = useAuthStore()
  const adminTabStore = useAdminTabStore()
  const notifStore = useChatNotifStore()
  const router = useRouter()

  const menuOpen = ref(false)
  const menuRef = ref<HTMLElement | null>(null)

  const totalUnread = computed(() =>
    Object.values(notifStore.unreadByUser || {}).reduce((a, b) => a + (b || 0), 0),
  )

  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  function goToProfile() {
    menuOpen.value = false
    router.push('/profil')
  }

  function goToAdmin() {
    menuOpen.value = false
    const target = adminTabStore.getRedirectRoute()
    router.push(target)
  }

  async function handleLogout() {
    menuOpen.value = false
    adminTabStore.clearLastTab()
    await auth.signOut()
  }
</script>

<style scoped lang="less">
  .user-menu {
    position: relative;
    cursor: pointer;
    color: white;
  }

  /* 🌟 Avatar glow effect */
  .user-avatar {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: fade(white, 6%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.25s ease,
      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.25s ease;

    &:hover {
      background: fade(white, 10%);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
      animation: pulseGlow 1.6s infinite ease-in-out;
    }

    &:active {
      transform: scale(0.97);
    }

    .avatar-icon {
      color: white;
      opacity: 0.9;
      transition: opacity 0.25s ease;
    }

    &:hover .avatar-icon {
      opacity: 1;
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
      font-weight: 600;
      transition: transform 0.25s ease;

      &:hover {
        transform: scale(1.12);
      }
    }
  }

  @keyframes pulseGlow {
    0%,
    100% {
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
    }
    50% {
      box-shadow: 0 0 14px rgba(255, 255, 255, 0.4);
    }
  }

  /* 🔽 Dropdown */
  .user-dropdown {
    position: absolute;
    top: 44px;
    right: 0;
    background: @neutral-800;
    border-radius: 10px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
    min-width: 190px;
    display: flex;
    flex-direction: column;
    color: white;
    padding: 10px 12px;
    gap: 6px;
    z-index: 2000;
    animation: bounceIn 0.4s ease;

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

  @keyframes bounceIn {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    60% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.25s ease;
  }
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }
</style>
