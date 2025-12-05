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

        <HeaderLogo />
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
        <BasicTooltip
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
        <LanguageSelector />
        <WishlistIcon />
        <CartMenu />
        <HeaderActions />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { useNavOverflow } from '@/composables/useNavOverflow'
  import CartMenu from '@/features/catalogue/cart/pop-up/CartMenu.vue'
  import WishlistIcon from '@/features/catalogue/components/WishlistIcon.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { BasicIconNext } from '@designSystem/components/basic/icon'
  import { computed, onUnmounted, ref, watch } from 'vue'
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
        opacity: 0.8;
      }

      // Mode ghost : uniquement l'icône visible
      &--ghost {
        background: transparent;
        border-color: transparent;

        &:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: transparent;
        }
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
        opacity: 0.8;
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
