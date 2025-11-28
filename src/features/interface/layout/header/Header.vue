<template>
  <nav class="navbar">
    <!-- Left -->
    <div class="navbar__left">
      <BasicButton
        v-if="isMobile"
        @click="toggleMobileMenu"
        :icon-name="isMenuOpen ? 'X' : 'Menu'"
        size="small"
        type="reverse"
        variant="ghost"
        class="navbar__burger"
      />
      <div
        class="navbar__logo"
        @click="router.push('/')"
        role="button"
        tabindex="0"
        @keypress.enter="router.push('/')"
      >
        <BasicIconNext
          name="fastPeptides"
          :size="32"
          class="navbar__logo-icon"
        />
        <div class="navbar__logo-text">
          <span class="navbar__logo-fast">Fast</span>
          <span class="navbar__logo-peptides">Peptides</span>
        </div>
      </div>
    </div>

    <!-- Center -->
    <div
      v-if="!isMobile"
      class="navbar__center"
    >
      <MainNavLinks />
    </div>

    <!-- Right -->
    <div class="navbar__right">
      <CartMenu />

      <!-- Connected User -->
      <UserMenu v-if="auth.user" />

      <!-- Guest with Cart -->
      <div
        v-else-if="hasGuestCart"
        class="navbar__guest"
      >
        <div class="navbar__guest-badge">
          <BasicIconNext
            name="ShoppingBag"
            :size="16"
          />
          <span>Mode Invité</span>
        </div>
        <BasicButton
          label="Suivre"
          icon-name="PackageSearch"
          type="secondary"
          variant="ghost"
          size="small"
          @click="router.push('/suivi-commande')"
        />
        <BasicButton
          label="Connexion"
          type="primary"
          size="small"
          @click="router.push('/auth/login')"
        />
      </div>

      <!-- Visitor -->
      <template v-else>
        <div
          v-if="isDesktop"
          class="navbar__actions"
        >
          <BasicButton
            label="Suivre"
            icon-name="PackageSearch"
            type="secondary"
            variant="ghost"
            size="small"
            @click="router.push('/suivi-commande')"
          />
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
        <div v-else><UserMenu /></div>
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
  import { BasicButton } from '@designSystem/components/basic/button'
  import { BasicIconNext } from '@designSystem/components/basic/icon'
  import { computed, onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import MainNavLinks from './MainNavLinks.vue'
  import MobileDrawer from './MobileDrawer.vue'

  const router = useRouter()
  const auth = useAuthStore()
  const cart = useCartStore()
  const { isMobile, isDesktop } = useDeviceBreakpoint()
  const isMenuOpen = ref(false)

  const hasGuestCart = computed(() => !auth.user && cart.items.length > 0)
  const toggleMobileMenu = () => (isMenuOpen.value = !isMenuOpen.value)
  const closeMenu = () => (isMenuOpen.value = false)

  router.afterEach(() => closeMenu())
  const stopWatch = watch(isMobile, (m) => {
    if (!m) closeMenu()
  })
  onUnmounted(() => stopWatch())
</script>

<style scoped lang="less">
  .navbar {
    position: relative;
    z-index: 1000;
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    background: linear-gradient(
      90deg,
      var(--secondary-900),
      color-mix(in srgb, black 4%, var(--secondary-800))
    );
    border-bottom: 1px solid rgba(var(--neutral-100-rgb), 0.06);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

    &__left,
    &__right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    &__center {
      flex: 1;
      display: flex;
      justify-content: center;
      min-width: 0;
      padding: 0 24px;
    }

    // Logo
    &__logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      user-select: none;
      outline: none;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      &:hover,
      &:focus {
        .navbar__logo-icon {
          transform: scale(1.1) rotate(5deg);
          filter: drop-shadow(0 0 12px rgba(var(--primary-500-rgb), 0.5));
        }
      }

      &-icon {
        color: var(--primary-500);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      &-text {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 22px;
        line-height: 1;
      }

      &-fast {
        color: @neutral-50;
        font-weight: 900;
        font-style: italic;
        letter-spacing: -0.5px;
      }

      &-peptides {
        color: var(--primary-400);
        font-weight: 600;
        letter-spacing: 0.5px;
      }
    }

    // Actions
    &__actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    // Guest Badge
    &__guest {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 6px 6px 16px;
      background: rgba(var(--neutral-100-rgb), 0.04);
      border: 1px solid rgba(var(--neutral-100-rgb), 0.08);
      border-radius: 100px;
      backdrop-filter: blur(12px);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.06);
        border-color: rgba(var(--neutral-100-rgb), 0.12);
        box-shadow: 0 0 20px rgba(var(--primary-500-rgb), 0.1);
      }

      &-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--primary-400);

        span {
          font-size: 13px;
          font-weight: 600;
          color: @neutral-200;
        }
      }
    }

    &__burger {
      color: @neutral-200;
    }
  }

  // Responsive
  @media (max-width: 900px) {
    .navbar {
      padding: 0 16px;
      height: 58px;

      &__logo-text {
        font-size: 18px;
      }

      &__guest {
        padding: 4px;
        background: transparent;
        border: none;
        backdrop-filter: none;

        &-badge {
          display: none;
        }
      }
    }
  }

  // Button animations
  .navbar :deep(button) {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
</style>
