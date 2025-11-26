<template>
  <nav class="auth-navbar">
    <!-- ========================================= -->
    <!-- LEFT SECTION : Logo + Mobile Menu Toggle -->
    <!-- ========================================= -->
    <div class="auth-navbar__left">
      <!-- Mobile Burger Menu -->
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

      <!-- Logo cliquable -->
      <div
        class="logo"
        @click="router.push('/')"
        role="button"
        tabindex="0"
        @keypress.enter="router.push('/')"
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

    <!-- ========================================= -->
    <!-- CENTER SECTION : Main Navigation (Desktop) -->
    <!-- ========================================= -->
    <div
      v-if="!isMobile"
      class="auth-navbar__center"
    >
      <MainNavLinks />
    </div>

    <!-- ========================================= -->
    <!-- RIGHT SECTION : Cart + Auth/Guest Actions -->
    <!-- ========================================= -->
    <div class="auth-navbar__right">
      <!-- Panier (toujours visible) -->
      <CartMenu />

      <!-- ===================== -->
      <!-- ÉTAT 1 : USER CONNECTÉ -->
      <!-- ===================== -->
      <UserMenu v-if="auth.user" />

      <!-- ========================== -->
      <!-- ÉTAT 2 : INVITÉ AVEC PANIER -->
      <!-- ========================== -->
      <div
        v-else-if="hasGuestCart"
        class="guest-info"
        role="group"
        aria-label="Actions invité"
      >
        <!-- Badge "Mode Invité" -->
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

        <!-- 🆕 Bouton Suivi (pour retrouver ses commandes) -->
        <BasicButton
          label="Suivre"
          aria-label="Suivre ma commande"
          icon-name="PackageSearch"
          type="secondary"
          variant="ghost"
          size="small"
          class="guest-track-btn"
          @click="router.push('/suivi-commande')"
        />

        <!-- CTA Connexion principale -->
        <BasicButton
          label="Connexion"
          type="primary"
          size="small"
          class="guest-login-btn"
          @click="router.push('/auth/login')"
        />
      </div>

      <!-- ================================ -->
      <!-- ÉTAT 3 : VISITEUR (sans panier) -->
      <!-- ================================ -->
      <template v-else>
        <!-- Desktop : Tous les boutons visibles -->
        <div
          v-if="isDesktop"
          class="auth-navbar__buttons"
        >
          <!-- 🆕 Bouton Tracking (accessible à tous) -->
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

          <!-- Connexion -->
          <BasicButton
            label="Connexion"
            type="primary"
            size="small"
            @click="router.push('/auth/login')"
          />

          <!-- Inscription -->
          <BasicButton
            label="Inscription"
            type="reverse"
            variant="outlined"
            size="small"
            @click="router.push('/auth/register')"
          />
        </div>

        <!-- Mobile : Menu dans drawer -->
        <div v-else>
          <UserMenu />
        </div>
      </template>
    </div>

    <!-- Mobile Navigation Drawer -->
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

  // ============================================================
  // SETUP & STORES
  // ============================================================
  const router = useRouter()
  const auth = useAuthStore()
  const cart = useCartStore()
  const { isMobile, isDesktop } = useDeviceBreakpoint()
  const isMenuOpen = ref(false)

  // ============================================================
  // COMPUTED PROPERTIES
  // ============================================================

  /**
   * 🆕 Détection invité avec panier
   * Utilisé pour afficher le badge "Mode Invité" avec actions dédiées
   */
  const hasGuestCart = computed(() => !auth.user && cart.items.length > 0)

  // ============================================================
  // METHODS
  // ============================================================

  /**
   * Toggle du menu mobile
   */
  const toggleMobileMenu = () => (isMenuOpen.value = !isMenuOpen.value)

  /**
   * Fermeture du menu mobile
   */
  const closeMenu = () => (isMenuOpen.value = false)

  // ============================================================
  // LIFECYCLE & WATCHERS
  // ============================================================

  /**
   * Ferme automatiquement le menu après navigation
   */
  router.afterEach(() => closeMenu())

  /**
   * Ferme le menu si on passe en mode desktop
   */
  const stopWatch = watch(isMobile, (mobile) => {
    if (!mobile) closeMenu()
  })

  /**
   * Nettoyage du watcher au unmount
   */
  onUnmounted(() => stopWatch())
</script>

<style scoped lang="less">
  /* ============================================================
     NAVBAR PRINCIPALE
     ============================================================ */
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

    /* Layout des sections */
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

  /* ============================================================
     LOGO
     ============================================================ */
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
    outline: none; /* Pour accessibilité clavier */

    .logo-img {
      color: var(--primary-500);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* Animation playful au hover */
    &:hover .logo-img,
    &:focus .logo-img {
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

  /* ============================================================
     BOUTON TRACKING (VISITEURS)
     ============================================================ */
  .tracking-btn {
    color: @neutral-300;
    transition: all 0.2s ease;

    &:hover,
    &:focus {
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }
  }

  /* ============================================================
     GUEST INFO CARD
     ============================================================ */
  .guest-info {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.06);
    padding: 6px 6px 6px 14px;
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease;

    /* Glassmorphism subtil */
    backdrop-filter: blur(8px);

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

  /* Bouton Suivi dans guest-info */
  .guest-track-btn {
    color: @neutral-300;
    height: 32px;
    padding: 0 12px;
    font-size: 0.8rem;
    border-radius: 50px;
    white-space: nowrap;
    transition: all 0.2s ease;

    &:hover,
    &:focus {
      color: white;
      background: rgba(255, 255, 255, 0.12);
    }
  }

  /* Bouton Connexion principal (CTA) */
  .guest-login-btn {
    font-size: 0.8rem;
    padding: 6px 16px;
    height: 32px;
    border-radius: 50px;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.2s ease;

    &:hover,
    &:focus {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.3);
    }
  }

  /* ============================================================
     RESPONSIVE : MOBILE & TABLET
     ============================================================ */
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

    /* Mobile : Version ultra-compacte du guest-info */
    .guest-info {
      padding: 4px;
      background: transparent;
      border: none;
      gap: 6px;
      backdrop-filter: none;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      /* Masque le label "Mode Invité" sur mobile */
      .guest-label {
        display: none;
      }
    }

    /* Boutons réduits en mobile */
    .guest-track-btn {
      padding: 4px 10px;
      height: 28px;
      font-size: 0.7rem;
    }

    .guest-login-btn {
      padding: 4px 12px;
      height: 28px;
      font-size: 0.75rem;
    }
  }

  /* ============================================================
     MICRO-ANIMATIONS & TRANSITIONS
     ============================================================ */

  /* Transition fluide pour tous les boutons */
  .auth-navbar button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Animation de pulsation subtile pour le badge guest */
  @keyframes subtle-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(var(--primary-400-rgb), 0);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(var(--primary-400-rgb), 0.1);
    }
  }

  .guest-info:hover {
    animation: subtle-pulse 2s infinite;
  }
</style>
