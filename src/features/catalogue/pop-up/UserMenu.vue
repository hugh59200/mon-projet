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
      <!-- 👤 Icône profil dans un cercle -->
      <div
        class="user-avatar"
        @click="toggleMenu"
      >
        <BasicIconNext
          name="User"
          :size="22"
          class="avatar-icon"
        />
      </div>

      <!-- 📋 Menu déroulant -->
      <transition name="fade-slide">
        <div
          v-if="menuOpen"
          class="user-dropdown"
          v-click-outside="{ callback: () => (menuOpen = false), exclude: [menuRef] }"
        >
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

          <div class="divider"></div>
          <div @click="goToProfile">Mon profil</div>
          <div
            v-if="auth.isAdmin"
            @click="goToAdmin"
          >
            Espace Admin
          </div>
          <div class="divider"></div>
          <div @click="handleLogout">Se déconnecter</div>
        </div>
      </transition>
    </div>
  </BasicTooltip>
</template>

<script setup lang="ts">
  import { vClickOutside } from '@/directives/vClickOutside'
  import { useAdminTabStore } from '@/features/admin/stores/useAdminTabStore'
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  defineOptions({ directives: { clickOutside: vClickOutside } })

  const auth = useAuthStore()
  const adminTabStore = useAdminTabStore()
  const router = useRouter()
  const menuOpen = ref(false)
  const menuRef = ref<HTMLElement | null>(null)

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

  /* 🌟 Cercle autour de l’icône */
  .user-avatar {
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
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);

    &:hover {
      background: fade(white, 10%);
      transform: scale(1.1);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
    }

    &:active {
      transform: scale(0.97);
    }

    .avatar-icon {
      color: white;
      transition: opacity 0.25s ease;
      opacity: 0.9;
    }

    &:hover .avatar-icon {
      opacity: 1;
    }
  }

  /* 🔽 Menu déroulant */
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

  /* ✨ Animation rebond */
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

  /* 🌀 Transition d’apparition douce */
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
