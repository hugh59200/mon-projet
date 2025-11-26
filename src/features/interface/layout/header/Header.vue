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
        <BasicIconNext
          name="fastPeptides"
          :size="32"
          class="logo-img"
        />
        <div class="logo-text-container">
          <span class="brand-fast">Fast</span>
          <span class="brand-peptides">Peptides</span>
        </div>
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
      
      <!-- USER CONNECTÉ -->
      <UserMenu v-if="auth.user" />

      <!-- 🆕 INVITÉ AVEC PANIER -->
      <div
        v-else-if="hasGuestCart"
        class="guest-info"
      >
        <div class="guest-label">
          <BasicIconNext
            name="ShoppingBag"
            :size="16"
            color="primary-400"
          />
          <BasicText
            size="body-s"
            color="neutral-200"
            weight="semibold"
          >
            Mode Invité
          </BasicText>
        </div>
        <BasicButton
          label="Connexion"
          type="primary"
          size="small"
          class="guest-login-btn"
          @click="router.push('/auth/login')"
        />
      </div>

      <!-- VISITEUR (pas de panier) -->
      <template v-else>
        <div
          v-if="isDesktop"
          class="auth-navbar__buttons"
        >
          <!-- 🆕 Bouton Tracking toujours visible -->
          <BasicButton
            label="Suivre"
            aria-label="Suivre ma commande"
            icon-name="PackageSearch"
            type="secondary"
            variant="ghost"
            size="small"
            class="tracking-btn"
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
  import { BasicButton } from '@designSystem/components/basic/button'
  import { BasicIconNext } from '@designSystem/components/basic/icon'
  import { BasicText } from '@designSystem/components/basic/text'
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

  // 🆕 Détection invité avec panier
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
    padding: 0 20px;
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
      flex-shrink: 0;
    }

    &__center {
      flex: 1;
      display: flex;
      justify-content: center;
      min-width: 0;
      padding: 0 20px;
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
      justify-content: flex-end;
    }

    &__buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  /* --- Logo --- */
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;

    .logo-img {
      color: var(--primary-500);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    &:hover .logo-img {
      transform: scale(1.1) rotate(5deg);
    }
  }

  .logo-text-container {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 22px;
    line-height: 1;
  }

  .brand-fast {
    color: white;
    font-weight: 900;
    font-style: italic;
    letter-spacing: -0.5px;
  }

  .brand-peptides {
    color: var(--primary-400);
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* --- Bouton Tracking --- */
  .tracking-btn {
    color: @neutral-300;

    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }
  }

  /* --- 🆕 Guest Info Card --- */
  .guest-info {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.06);
    padding: 6px 6px 6px 14px;
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }
  }

  .guest-label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .guest-login-btn {
    font-size: 0.8rem;
    padding: 6px 16px;
    height: 32px;
    border-radius: 50px;
    font-weight: 600;
    white-space: nowrap;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.3);
    }
  }

  @media (max-width: 900px) {
    .auth-navbar {
      padding: 0 16px;
      height: 58px;

      &__right {
        gap: 12px;
      }
    }

    .logo-text-container {
      font-size: 18px;
    }

    /* Mobile : Version compacte du guest-info */
    .guest-info {
      padding: 4px;
      background: transparent;
      border: none;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .guest-label {
        display: none;
      }
    }

    .guest-login-btn {
      padding: 4px 12px;
      height: 28px;
      font-size: 0.75rem;
    }
  }
</style>