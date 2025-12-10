<template>
  <nav class="navbar">
    <div class="navbar__bg">
      <div class="navbar__bg-gradient"></div>
      <div class="navbar__bg-shine"></div>
    </div>

    <MobileDrawer v-model="isMenuOpen" />

    <div
      ref="containerRef"
      class="navbar__container"
    >
      <div
        ref="leftRef"
        class="navbar__left"
      >
        <button
          v-if="shouldShowMobileNav"
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

        <HeaderLogo :compact="useCompactLogo" />
      </div>

      <div
        v-if="!shouldHideNavLinks"
        ref="centerRef"
        class="navbar__center"
      >
        <MainNavLinks />
      </div>

      <div
        ref="rightRef"
        class="navbar__right"
      >
        <!-- Theme Toggle (desktop + mobile si assez d'espace) -->
        <BasicTooltip
          v-if="!isMobile || !hideThemeToggle"
          :label="theme === 'light' ? 'Dark mode' : 'Light mode'"
          position="bottom"
        >
          <button
            class="navbar__icon-btn navbar__theme-toggle"
            @click="toggleTheme"
          >
            <BasicIconNext
              :name="theme === 'light' ? 'Moon' : 'Sun'"
              :size="18"
              :color="theme === 'light' ? 'warning-500' : 'warning-400'"
            />
          </button>
        </BasicTooltip>

        <!-- Suivi commande (guests only - connectés ont accès via profil) -->
        <BasicTooltip
          v-if="showTrackingButton"
          :label="t('nav.tracking')"
          position="bottom"
        >
          <button
            class="navbar__icon-btn navbar__icon-btn--ghost"
            @click="$router.push('/suivi-commande')"
          >
            <BasicIconNext
              name="Package"
              :size="20"
              color="neutral-200"
            />
          </button>
        </BasicTooltip>

        <!-- Language (desktop only) -->
        <LanguageSelector v-if="!isMobile" />
        <WishlistIcon />
        <CartMenu />
        <HeaderActions />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { useNavOverflow } from '@/composables/useNavOverflow'
  import { useTheme } from '@/composables/useTheme'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import CartMenu from '@/features/catalogue/cart/pop-up/CartMenu.vue'
  import WishlistIcon from '@/features/catalogue/components/WishlistIcon.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { BasicIconNext } from '@designSystem/components/basic/icon'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import HeaderActions from './HeaderActions.vue'
  import HeaderLogo from './HeaderLogo.vue'
  import LanguageSelector from './LanguageSelector.vue'
  import MainNavLinks from './MainNavLinks.vue'
  import MobileDrawer from './MobileDrawer.vue'

  const router = useRouter()
  const { t } = useI18n()
  const { isMobile } = useDeviceBreakpoint()
  const { theme, toggleTheme } = useTheme()
  const auth = useAuthStore()

  // Suivi commande visible uniquement pour guests (connectés ont accès via profil)
  const showTrackingButton = computed(() => !auth.user)

  const containerRef = ref<HTMLElement | null>(null)
  const leftRef = ref<HTMLElement | null>(null)
  const centerRef = ref<HTMLElement | null>(null)
  const rightRef = ref<HTMLElement | null>(null)

  const { isOverflowing } = useNavOverflow(
    containerRef,
    leftRef,
    centerRef,
    rightRef,
    { minGap: 20 }
  )

  // Deux niveaux d'overflow sur mobile :
  // 1. Theme toggle disparaît en premier (seuil large)
  // 2. Logo passe aux initiales ensuite (seuil serré)
  const hideThemeToggle = ref(false)
  const useCompactLogo = ref(false)
  const THEME_GAP = 80 // Seuil pour masquer le theme toggle
  const LOGO_GAP = 16   // Seuil serré pour passer aux initiales

  const checkHeaderOverflow = () => {
    if (!isMobile.value) {
      hideThemeToggle.value = false
      useCompactLogo.value = false
      return
    }

    if (!leftRef.value || !rightRef.value) return

    const leftRect = leftRef.value.getBoundingClientRect()
    const rightRect = rightRef.value.getBoundingClientRect()
    const gap = rightRect.left - leftRect.right

    // D'abord le theme toggle disparaît
    hideThemeToggle.value = gap < THEME_GAP
    // Ensuite le logo passe aux initiales
    useCompactLogo.value = gap < LOGO_GAP
  }

  let headerObserver: ResizeObserver | null = null

  watch(isMobile, checkHeaderOverflow)

  onMounted(() => {
    setTimeout(checkHeaderOverflow, 50)
    headerObserver = new ResizeObserver(checkHeaderOverflow)
    if (containerRef.value) headerObserver.observe(containerRef.value)
    window.addEventListener('resize', checkHeaderOverflow)
  })

  onUnmounted(() => {
    if (headerObserver) headerObserver.disconnect()
    window.removeEventListener('resize', checkHeaderOverflow)
  })

  // Sur mobile, on cache la nav (bottom nav la remplace) mais on garde le burger si overflow sur tablet
  const shouldShowMobileNav = computed(() => isOverflowing.value && !isMobile.value)
  const shouldHideNavLinks = computed(() => isMobile.value || isOverflowing.value)

  const isMenuOpen = ref(false)

  const toggleMobileMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const closeMenu = () => {
    isMenuOpen.value = false
  }

  router.afterEach(() => closeMenu())

  const stopWatch = watch(shouldShowMobileNav, (mobile) => {
    if (!mobile) closeMenu()
  })

  onUnmounted(() => stopWatch())
</script>

<style scoped lang="less">
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .navbar {
    position: relative;
    z-index: 1000;
    height: 68px;

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
        var(--chrome-bg-gradient-end) 0%,
        var(--chrome-bg) 50%,
        var(--chrome-bg-gradient-end) 100%
      );
      transition: background 0.3s ease;
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
        var(--chrome-border-subtle) 20%,
        var(--chrome-border) 50%,
        var(--chrome-border-subtle) 80%,
        transparent 100%
      );
    }

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
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    &__icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      background: var(--chrome-hover);
      border: 1px solid var(--chrome-border);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: var(--chrome-active);
        border-color: var(--chrome-border);
      }

      &:active {
        opacity: 0.8;
      }

      // Mode ghost : uniquement l'icône visible
      &--ghost {
        background: transparent;
        border-color: transparent;

        &:hover {
          background: var(--chrome-hover);
          border-color: transparent;
        }
      }
    }

    &__theme-toggle {
      background: rgba(var(--warning-500-rgb), 0.15) !important;
      border-color: rgba(var(--warning-500-rgb), 0.3) !important;

      &:hover {
        background: rgba(var(--warning-500-rgb), 0.25) !important;
      }
    }

    &__burger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 36px;
      height: 36px;
      padding: 8px;
      background: var(--chrome-hover);
      border: 1px solid var(--chrome-border);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s @ease;

      &:hover {
        background: var(--chrome-active);
        border-color: var(--chrome-border);
      }

      &:active {
        opacity: 0.8;
      }

      &-line {
        width: 100%;
        height: 2px;
        background: var(--chrome-text);
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
  }


  @media (min-width: 1301px) {
    .navbar__container {
      padding: 0 32px;
      gap: 32px;
    }
  }

  .respond-tablet({
    .navbar__container {
      gap: 20px;
      padding: 0 20px;
    }
  });

  .respond-mobile({
    .navbar {
      height: 60px;
    }

    .navbar__container {
      padding: 0 16px;
      gap: 8px;
    }

    .navbar__icon-btn {
      width: 36px;
      height: 36px;
    }

    .navbar__burger {
      width: 40px;
      height: 40px;
    }

    .navbar__right {
      gap: 8px;
    }
  });

</style>
