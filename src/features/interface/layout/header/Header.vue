<template>
  <nav class="auth-navbar">
    <div class="auth-navbar__left">
      <BasicButton
        @click="toggleMobileMenu"
        aria-label="Ouvrir le menu"
        :icon-name="isMenuOpen ? 'X' : 'Menu'"
        size="small"
        type="reverse"
        variant="ghost"
        class="burder"
      />
      <div
        class="logo"
        @click="router.push('/')"
      >
        <img
          src="@/assets/logo-app.png"
          alt="Logo Fast Peptides"
          class="logo-img"
        />
        <BasicText
          size="body-l"
          weight="bold"
          class="auth-navbar__logo"
        >
          Fast Peptides
        </BasicText>
      </div>
    </div>
    <div class="auth-navbar__center">
      <MainNavLinks />
    </div>
    <div class="auth-navbar__right">
      <CartMenu />
      <template v-if="auth.user">
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
    <MobileDrawer v-model="isMenuOpen" />
  </nav>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import CartMenu from '@/features/catalogue/pop-up/CartMenu.vue'
  import UserMenu from '@/features/catalogue/pop-up/UserMenu.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import MainNavLinks from './MainNavLinks.vue'
  import MobileDrawer from './MobileDrawer.vue'

  const router = useRouter()
  const auth = useAuthStore()
  const { isMobile } = useDeviceBreakpoint()
  const isMenuOpen = ref(false)

  const toggleMobileMenu = () => (isMenuOpen.value = !isMenuOpen.value)
  const closeMenu = () => (isMenuOpen.value = false)

  router.afterEach(() => closeMenu())

  const stopWatch = watch(isMobile, (mobile) => {
    if (!mobile) closeMenu()
  })
  onUnmounted(() => stopWatch())
</script>

<style scoped lang="less">
  .auth-navbar {
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
      gap: 16px;

      .btn {
        gap: 6px;

        &:hover {
          background: fade(white, 10%);
          color: @white;
        }

        &.is-active {
          background: fade(@primary-500, 25%);
          color: @white;
        }
      }
    }

    &__center {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 24px;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    caret-color: transparent;
    .logo-img {
      width: 38px;
      height: 38px;
      transition: transform 0.25s ease;
      caret-color: transparent;
      &:hover {
        transform: scale(1.08);
      }
    }
  }

  /* --- Burger button --- */
  .burger-btn {
    display: none;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    transition: transform 0.2s ease;
    &:hover {
      transform: scale(1.1);
    }
  }

  /* --- Animation slide --- */
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .slide-left-enter-from {
    opacity: 0;
    transform: translateX(-100%);
  }
  .slide-left-leave-to {
    opacity: 0;
    transform: translateX(-80%); /* ✅ effet fermeture plus fluide */
  }

  /* --- Responsive --- */
  @media (max-width: 900px) {
    .auth-navbar {
      padding: 0 16px;
      height: 58px;

      &__center {
        display: none;
      }

      .burger-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .logo-img {
        width: 30px;
        height: 30px;
      }

      &__right {
        gap: 20px;
      }
    }
  }
</style>
