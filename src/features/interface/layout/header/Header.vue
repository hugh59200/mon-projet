<template>
  <nav class="auth-navbar">
    <!-- 🧭 Gauche -->
    <div class="auth-navbar__left">
      <BasicTooltip
        label="Ouvrir le menu"
        position="bottom"
      >
        <BasicIconNext
          :name="isReduced ? 'LayoutGrid' : 'Menu'"
          pointer
          @click="toggle"
          class="icon-animated"
        />
      </BasicTooltip>

      <div
        class="logo-icon"
        @click="router.push('/')"
      >
        <img
          src="@/assets/logo-app.png"
          alt="Logo Fast Peptides"
          class="logo-img"
        />
      </div>

      <BasicText
        size="body-l"
        weight="bold"
        class="auth-navbar__logo"
        @click="router.push('/')"
      >
        Fast Peptides
      </BasicText>
    </div>

    <!-- 🧩 Droite -->
    <div class="auth-navbar__right">
      <template v-if="auth.user">
        <CartMenu />
        <UserMenu />
      </template>

      <template v-else>
        <BasicButton
          label="Connexion"
          type="primary"
          size="small"
          @click="router.push('/auth/login')"
        />
        <BasicButton
          label="Inscription"
          type="reverse"
          variant="outlined"
          size="small"
          @click="router.push('/auth/register')"
        />
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import CartMenu from '@/features/catalogue/pop-up/CartMenu.vue'
  import UserMenu from '@/features/catalogue/pop-up/UserMenu.vue'
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'

  const auth = useAuthStore()
  const router = useRouter()
  const sidebar = useSidebarStore()
  const { isReduced } = storeToRefs(sidebar)
  const { toggle } = sidebar
</script>

<style scoped lang="less">
  .auth-navbar {
    grid-area: header;
    z-index: 1000;
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 28px;
    color: white;
    background: linear-gradient(90deg, @neutral-900, darken(@neutral-900, 5%));
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

    &__left {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    &__logo {
      cursor: pointer;
      color: white;
      transition: opacity 0.2s ease;
      &:hover {
        opacity: 0.85;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 32px;
    }
  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.25s ease;
    &:hover {
      transform: scale(1.08);
    }
    .logo-img {
      width: 100%;
      height: 100%;
    }
  }

  .icon-animated {
    transition:
      transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
      filter 0.25s ease;
    &:hover {
      transform: scale(1.2);
      filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.35));
    }
  }
</style>
