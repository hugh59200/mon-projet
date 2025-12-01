<template>
  <nav class="navbar">
    <!-- Background Effects -->
    <div class="navbar__bg">
      <div class="navbar__bg-gradient"></div>
      <div class="navbar__bg-shine"></div>
    </div>

    <div class="navbar__container">
      <!-- ======================== -->
      <!-- LEFT SECTION            -->
      <!-- ======================== -->
      <div class="navbar__left">
        <!-- Mobile Menu Toggle -->
        <button
          v-if="isMobile"
          class="navbar__burger"
          :class="{ 'navbar__burger--open': isMenuOpen }"
          :aria-expanded="isMenuOpen"
          aria-label="Menu"
          @click="toggleMobileMenu"
        >
          <span class="navbar__burger-line"></span>
          <span class="navbar__burger-line"></span>
          <span class="navbar__burger-line"></span>
        </button>

        <!-- Logo -->
        <div
          class="navbar__logo"
          role="button"
          tabindex="0"
          @click="router.push('/')"
          @keypress.enter="router.push('/')"
        >
          <div class="navbar__logo-icon">
            <BasicIconNext
              name="fastPeptides"
              :size="28"
            />
          </div>
          <div class="navbar__logo-text">
            <span class="navbar__logo-fast">Fast</span>
            <span class="navbar__logo-peptides">Peptides</span>
          </div>
        </div>
      </div>

      <!-- ======================== -->
      <!-- CENTER SECTION          -->
      <!-- ======================== -->
      <div
        v-if="!isMobile"
        class="navbar__center"
      >
        <MainNavLinks />
      </div>

      <!-- ======================== -->
      <!-- RIGHT SECTION           -->
      <!-- ======================== -->
      <div class="navbar__right">
        <!-- Language Selector -->
        <LanguageSelector />

        <!-- Cart -->
        <CartMenu />

        <!-- Connected User -->
        <template v-if="auth.user">
          <UserMenu />
        </template>

        <!-- Guest with Cart Items -->
        <template v-else-if="hasGuestCart">
          <div class="navbar__guest">
            <div class="navbar__guest-indicator">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                />
              </svg>
              <span>{{ t('nav.guest') }}</span>
            </div>

            <button
              class="navbar__btn navbar__btn--ghost"
              @click="router.push('/suivi-commande')"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                />
              </svg>
              <span>{{ t('tracking.title') }}</span>
            </button>

            <button
              class="navbar__btn navbar__btn--primary"
              @click="router.push('/auth/login')"
            >
              {{ t('nav.login') }}
            </button>
          </div>
        </template>

        <!-- Visitor (not logged in, no cart) -->
        <template v-else>
          <!-- Desktop/Tablet: Boutons visibles -->
          <div
            v-if="!isMobile"
            class="navbar__actions"
          >
            <button
              class="navbar__btn navbar__btn--ghost"
              @click="router.push('/suivi-commande')"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                />
              </svg>
              <span>{{ t('tracking.title') }}</span>
            </button>

            <button
              class="navbar__btn navbar__btn--primary"
              @click="router.push('/auth/login')"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line
                  x1="15"
                  y1="12"
                  x2="3"
                  y2="12"
                />
              </svg>
              <span>{{ t('nav.login') }}</span>
            </button>
            <button
              class="navbar__btn navbar__btn--outline"
              @click="router.push('/auth/register')"
            >
              {{ t('nav.register') }}
            </button>
          </div>
          <UserMenu v-else />
        </template>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import CartMenu from '@/features/catalogue/cart/pop-up/CartMenu.vue'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { computed, onUnmounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import LanguageSelector from './LanguageSelector.vue'
  import MainNavLinks from './MainNavLinks.vue'
  import UserMenu from './pop-up/UserMenu.vue'

  const { t } = useI18n()
  const router = useRouter()
  const auth = useAuthStore()
  const cart = useCartStore()
  const { isMobile } = useDeviceBreakpoint()

  const isMenuOpen = ref(false)

  const hasGuestCart = computed(() => !auth.user && cart.items.length > 0)

  const toggleMobileMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const closeMenu = () => {
    isMenuOpen.value = false
  }

  router.afterEach(() => closeMenu())

  const stopWatch = watch(isMobile, (mobile) => {
    if (!mobile) closeMenu()
  })

  onUnmounted(() => stopWatch())
</script>
<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;
  @ease: cubic-bezier(0.4, 0, 0.2, 1);
  @bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  .navbar {
    position: relative;
    z-index: 1000;
    height: 68px;

    // ==========================================
    // BACKGROUND
    // ==========================================
    &__bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    &__bg-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        var(--secondary-900) 0%,
        color-mix(in srgb, var(--secondary-800), black 8%) 50%,
        var(--secondary-900) 100%
      );
    }

    &__bg-shine {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.06) 20%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0.06) 80%,
        transparent 100%
      );
    }

    // ==========================================
    // CONTAINER
    // ==========================================
    &__container {
      position: relative;
      z-index: 1;
      height: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    // ==========================================
    // LEFT SECTION
    // ==========================================
    &__left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    // ==========================================
    // BURGER MENU
    // ==========================================
    &__burger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 36px;
      height: 36px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.12);
      }

      &:active {
        transform: scale(0.95);
      }

      &-line {
        width: 100%;
        height: 2px;
        background: @neutral-200;
        border-radius: 1px;
        transition: all 0.3s @ease;
        transform-origin: center;
      }

      &--open &-line {
        &:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        &:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        &:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
      }
    }

    // ==========================================
    // LOGO
    // ==========================================
    &__logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      user-select: none;
      outline: none;
      text-decoration: none;

      &:focus-visible {
        outline: 2px solid var(--primary-500);
        outline-offset: 4px;
        border-radius: 8px;
      }

      &:hover {
        .navbar__logo-icon {
          transform: scale(1.08) rotate(3deg);
          box-shadow:
            0 0 20px rgba(var(--primary-500-rgb), 0.4),
            0 0 40px rgba(var(--primary-500-rgb), 0.2);
        }

        .navbar__logo-fast {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .navbar__logo-peptides {
          text-shadow: 0 0 20px rgba(var(--primary-400-rgb), 0.5);
        }
      }
    }

    &__logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.15) 0%,
        rgba(var(--primary-600-rgb), 0.1) 100%
      );
      border: 1px solid rgba(var(--primary-500-rgb), 0.2);
      border-radius: 12px;
      color: var(--primary-400);
      transition: all 0.3s @bounce;
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    &__logo-text {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    &__logo-fast {
      font-family: @font-display;
      font-size: 22px;
      font-weight: 800;
      font-style: italic;
      color: @neutral-50;
      letter-spacing: -0.5px;
      transition: text-shadow 0.3s @ease;
    }

    &__logo-peptides {
      font-family: @font-display;
      font-size: 22px;
      font-weight: 600;
      color: var(--primary-400);
      letter-spacing: 0.5px;
      transition: text-shadow 0.3s @ease;
    }

    // ==========================================
    // CENTER SECTION
    // ==========================================
    &__center {
      flex: 1;
      display: flex;
      justify-content: center;
      min-width: 0;
    }

    // ==========================================
    // RIGHT SECTION
    // ==========================================
    &__right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    // ==========================================
    // ACTIONS
    // ==========================================
    &__actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    // ==========================================
    // BUTTONS
    // ==========================================
    &__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 10px;
      font-family: @font-body;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s @ease;
      white-space: nowrap;

      svg {
        flex-shrink: 0;
      }

      &--primary {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        border: none;
        color: white;
        box-shadow:
          0 2px 8px rgba(var(--primary-500-rgb), 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);

        &:hover {
          transform: translateY(-2px);
          box-shadow:
            0 4px 16px rgba(var(--primary-500-rgb), 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        &:active {
          transform: translateY(0);
        }
      }

      &--outline {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: @neutral-200;

        &:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.25);
          color: white;
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
        }
      }

      &--ghost {
        background: transparent;
        border: 1px solid transparent;
        color: @neutral-400;
        padding: 10px 14px;

        &:hover {
          background: rgba(255, 255, 255, 0.06);
          color: @neutral-200;
        }
      }
    }

    // ==========================================
    // GUEST INDICATOR
    // ==========================================
    &__guest {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px 6px 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 50px;
      backdrop-filter: blur(12px);
      transition: all 0.3s @ease;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }

    &__guest-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-right: 8px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);

      svg {
        color: var(--primary-400);
      }

      span {
        font-family: @font-body;
        font-size: 13px;
        font-weight: 600;
        color: @neutral-300;
      }
    }

    // ==========================================
    // RESPONSIVE - XL (> 1300px)
    // ==========================================
    @media (min-width: 1301px) {
      &__container {
        padding: 0 32px;
        gap: 32px;
      }
    }

    // ==========================================
    // RESPONSIVE - L (1101-1300px)
    // ==========================================
    @media (max-width: 1300px) and (min-width: 1101px) {
      &__container {
        gap: 24px;
      }

      &__btn {
        padding: 9px 14px;
        font-size: 13px;
      }
    }

    // ==========================================
    // RESPONSIVE - M (1001-1100px)
    // ==========================================
    @media (max-width: 1100px) and (min-width: 1001px) {
      &__container {
        gap: 16px;
        padding: 0 20px;
      }

      &__logo-fast,
      &__logo-peptides {
        font-size: 20px;
      }

      &__actions {
        gap: 6px;
      }

      &__btn {
        padding: 8px 12px;
        font-size: 12px;
        gap: 6px;

        &--ghost span {
          display: none;
        }
      }
    }

    // ==========================================
    // RESPONSIVE - S (751-1000px)
    // ==========================================
    @media (max-width: 1000px) and (min-width: 751px) {
      &__container {
        gap: 12px;
        padding: 0 16px;
      }

      &__logo-fast,
      &__logo-peptides {
        font-size: 18px;
      }

      &__actions {
        gap: 6px;
      }

      &__btn {
        padding: 8px 10px;
        font-size: 12px;

        &--ghost span {
          display: none;
        }

        &--outline {
          display: none;
        }

        &--primary span {
          display: none;
        }
      }
    }

    // ==========================================
    // RESPONSIVE - Mobile (≤ 750px)
    // ==========================================
    @media (max-width: 750px) {
      height: 60px;

      &__container {
        padding: 0 16px;
        gap: 12px;
      }

      &__logo-icon {
        width: 36px;
        height: 36px;
      }

      &__logo-fast,
      &__logo-peptides {
        font-size: 18px;
      }

      &__guest {
        padding: 4px;
        background: transparent;
        border: none;
        backdrop-filter: none;
        gap: 6px;
      }

      &__guest-indicator {
        display: none;
      }

      &__btn {
        padding: 8px 14px;
        font-size: 13px;

        span {
          display: none;
        }

        svg {
          margin: 0;
        }

        &--primary span {
          display: inline;
        }
      }
    }

    // ==========================================
    // RESPONSIVE - XS (≤ 480px)
    // ==========================================
    @media (max-width: 480px) {
      &__logo-text {
        display: none;
      }

      &__logo-icon {
        width: 40px;
        height: 40px;
      }
    }
  }

  // ============================================
  // DEEP STYLES
  // ============================================
  .navbar :deep(.cart-menu),
  .navbar :deep(.user-menu) {
    button {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      transition: all 0.2s @ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }
  }
</style>
