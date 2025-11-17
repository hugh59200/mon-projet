<template>
  <nav class="auth-nav">
    <!-- LEFT -->
    <div class="auth-nav__left">
      <BasicButton
        v-if="isMobile"
        @click="toggleMobileMenu"
        aria-label="Menu"
        :icon-name="isMenuOpen ? 'X' : 'Menu'"
        size="small"
        type="reverse"
        variant="ghost"
        class="auth-nav__burger"
      />

      <div
        class="auth-nav__logo"
        @click="router.push('/')"
      >
        <img
          src="@/assets/logo-app.png"
          alt="Logo"
          class="auth-nav__logo-img"
        />
        <BasicText
          size="body-l"
          weight="bold"
          class="auth-nav__logo-text"
        >
          Fast Peptides
        </BasicText>
      </div>
    </div>

    <!-- CENTER -->
    <div
      v-if="!isMobile"
      class="auth-nav__center"
    >
      <MainNavLinks />
    </div>

    <!-- RIGHT -->
    <div class="auth-nav__right">
      <CartMenu />

      <template v-if="auth.user">
        <UserMenu />
      </template>

      <template v-else-if="hasGuestCart">
        <div class="auth-nav__guest">
          <BasicText
            size="body-s"
            color="neutral-600"
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
          class="auth-nav__auth-buttons"
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

        <UserMenu v-else />
      </template>
    </div>

    <MobileDrawer v-model="isMenuOpen" />
  </nav>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { computed, onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import CartMenu from '@/features/catalogue/cart/pop-up/CartMenu.vue'
  import UserMenu from '@/features/interface/layout/header/pop-up/UserMenu.vue'
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
  .auth-nav {
    position: sticky;
    top: 0;
    z-index: 1000;

    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0 var(--spacing-20);

    /* === PRIMARY GLASS PREMIUM === */
    background: rgba(var(--primary-500-rgb), 0.18);
    backdrop-filter: blur(18px) saturate(180%);
    -webkit-backdrop-filter: blur(18px) saturate(180%);

    border-bottom: 1px solid rgba(var(--primary-500-rgb), 0.28);
    box-shadow: 0 6px 20px rgba(var(--primary-700-rgb), 0.15);

    transition:
      background 0.25s ease,
      backdrop-filter 0.25s ease,
      border-color 0.25s ease;

    &__left,
    &__right {
      display: flex;
      align-items: center;
      gap: var(--spacing-15);
    }

    /* ================= LOGO ================= */
    &__logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-10);
      cursor: pointer;

      &-img {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-s);
        transition: transform var(--transition-fast);

        &:hover {
          transform: scale(1.06);
        }
      }

      &-text {
        color: var(--neutral-0); /* blanc lisible */
        font-weight: var(--font-weight-bold);
      }
    }

    /* ================= CENTER NAV ================= */
    &__center {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    /* ================= GUEST BOX ================= */
    &__guest {
      background: rgba(var(--primary-300-rgb), 0.22);
      padding: 4px 12px;
      border-radius: var(--radius-m);
      display: flex;
      align-items: center;
      gap: var(--spacing-10);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(var(--primary-400-rgb), 0.25);
    }
  }

  /* 🌙 DARK MODE */
  [data-theme='dark'] .auth-nav {
    background: rgba(var(--primary-400-rgb), 0.14);
    border-bottom: 1px solid rgba(var(--primary-300-rgb), 0.3);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.55);
  }

  [data-theme='dark'] .auth-nav__logo-text {
    color: var(--neutral-0);
  }

  [data-theme='dark'] .auth-nav__guest {
    background: rgba(var(--primary-300-rgb), 0.18);
    border: 1px solid rgba(var(--primary-200-rgb), 0.25);
  }

  /* ================= RESPONSIVE ================= */
  @media (max-width: 900px) {
    .auth-nav {
      height: 58px;
      padding: 0 var(--spacing-15);

      &__right {
        gap: var(--spacing-15);
      }

      &__logo-img {
        width: 28px;
        height: 28px;
      }
    }
  }
</style>
