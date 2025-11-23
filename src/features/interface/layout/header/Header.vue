<template>
  <nav class="auth-navbar">
    <div class="auth-navbar__left">
      <BasicButton
        v-if="isMobile"
        @click="toggleMobileMenu"
        aria-label="Ouvrir le menu"
        :icon-name="isMenuOpen ? 'X' : 'Menu'"
        size="small"
        type="reverse"
        variant="ghost"
        class="burger"
      />
      <div
        class="logo"
        @click="router.push('/')"
      >
        <svg
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(5, 5)">
            <path
              d="M25 0 C 25 13.8 13.8 25 0 25 C 13.8 25 25 36.2 25 50 C 25 36.2 36.2 25 50 25 C 36.2 25 25 13.8 25 0 Z"
              fill="#ff9900"
            />
            <circle
              cx="12"
              cy="12"
              r="14"
              fill="#FFFFFF"
            />
            <circle
              cx="38"
              cy="12"
              r="14"
              fill="#FFFFFF"
            />
            <circle
              cx="12"
              cy="38"
              r="14"
              fill="#FFFFFF"
            />
            <circle
              cx="38"
              cy="38"
              r="14"
              fill="#FFFFFF"
            />
          </g>
        </svg>
        <BasicText
          size="body-l"
          weight="bold"
          color="white"
          class="auth-navbar__logo"
        >
          Fast Peptides
        </BasicText>
      </div>
    </div>
    <div
      v-if="!isMobile"
      class="auth-navbar__center"
    >
      <MainNavLinks />
    </div>
    <div class="auth-navbar__right">
      <CartMenu />
      <template v-if="auth.user">
        <UserMenu />
      </template>
      <template v-else-if="hasGuestCart">
        <div class="guest-info">
          <BasicText
            size="body-s"
            color="neutral-300"
          >
            Invité
          </BasicText>
          <BasicButton
            label="Se connecter"
            type="primary"
            size="small"
            @click="router.push('/auth/login')"
          />
        </div>
      </template>
      <template v-else>
        <div
          v-if="isDesktop"
          class="auth-navbar__buttons"
        >
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
        </div>
        <div v-else>
          <UserMenu />
        </div>
      </template>
    </div>
    <MobileDrawer v-model="isMenuOpen" />
  </nav>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import CartMenu from '@/features/catalogue/cart/pop-up/CartMenu.vue'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import UserMenu from '@/features/interface/layout/header/pop-up/UserMenu.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { computed, onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import MainNavLinks from './MainNavLinks.vue'
  import MobileDrawer from './MobileDrawer.vue'

  const router = useRouter()
  const auth = useAuthStore()
  const cart = useCartStore()
  const { isMobile, isDesktop } = useDeviceBreakpoint()
  const isMenuOpen = ref(false)

  const toggleMobileMenu = () => (isMenuOpen.value = !isMenuOpen.value)
  const closeMenu = () => (isMenuOpen.value = false)
  router.afterEach(() => closeMenu())

  const hasGuestCart = computed(() => !auth.user && cart.items.length > 0)

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
    background: linear-gradient(
      90deg,
      var(--secondary-900),
      color-mix(in srgb, black 4%, var(--secondary-900))
    );
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

    &__left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__center {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 20px;
      overflow: visible;
    }

    &__buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    .logo-img {
      width: 38px;
      height: 38px;
      transition: transform 0.25s ease;
      &:hover {
        transform: scale(1.08);
      }
    }
  }

  .guest-info {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.08);
    padding: 4px 10px;
    border-radius: 8px;
  }

  @media (max-width: 900px) {
    .auth-navbar {
      padding: 0 16px;
      height: 58px;

      &__right {
        gap: 14px;
      }
    }

    .logo {
      .logo-img {
        width: 30px;
        height: 30px;
      }
    }
  }
</style>
