<template>
  <nav
    class="auth-navbar"
    v-responsive-animate.fade.once
  >
    <!-- 🧭 Gauche -->
    <div class="auth-navbar__left">
      <!-- 🍔 Burger menu -->
      <button
        class="burger-btn"
        v-feedback-animate.glow="{ color: 'rgba(255,255,255,0.6)', scale: 1.1 }"
        @click="toggleMobileMenu"
        aria-label="Ouvrir le menu"
      >
        <BasicIconNext
          :name="isMenuOpen ? 'X' : 'Menu'"
          :size="22"
        />
      </button>

      <!-- 🧬 Logo -->
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

    <!-- 📚 Liens Desktop -->
    <div class="auth-navbar__center">
      <MainNavLinks />
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

    <!-- 📱 Drawer mobile -->
    <transition name="slide-left">
      <div
        v-if="isMenuOpen"
        class="mobile-overlay"
        @click.self="closeMenu"
      >
        <aside
          class="mobile-drawer"
          v-responsive-animate.slide.once
        >
          <div class="drawer-header">
            <img
              src="@/assets/logo-app.png"
              class="drawer-logo"
            />
            <BasicText
              weight="bold"
              color="white"
            >
              Menu
            </BasicText>
          </div>

          <!-- ✅ Liens verticaux -->
          <div class="drawer-links">
            <MainNavLinks
              direction="column"
              @navigate="closeMenu"
            />
          </div>

          <div class="drawer-divider"></div>

          <template v-if="auth.user">
            <button
              class="drawer-link"
              @click="goTo('/profil')"
            >
              Mon profil
            </button>
            <button
              class="drawer-link"
              @click="goTo('/panier')"
            >
              Mon panier
            </button>
          </template>

          <template v-else>
            <div class="drawer-auth">
              <BasicButton
                label="Connexion"
                type="primary"
                full
                size="small"
                @click="goTo('/auth/login')"
              />
              <BasicButton
                label="Inscription"
                type="reverse"
                full
                size="small"
                @click="goTo('/auth/register')"
              />
            </div>
          </template>
        </aside>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
  import { vFeedbackAnimate } from '@/directives/vFeedbackAnimate'
  import { vResponsiveAnimate } from '@/directives/vResponsiveAnimate'
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import CartMenu from '@/features/catalogue/pop-up/CartMenu.vue'
  import UserMenu from '@/features/catalogue/pop-up/UserMenu.vue'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import MainNavLinks from './MainNavLinks.vue'

  defineOptions({
    directives: { feedbackAnimate: vFeedbackAnimate, responsiveAnimate: vResponsiveAnimate },
  })

  const router = useRouter()
  const auth = useAuthStore()
  const { isMobile } = useDeviceBreakpoint()
  const isMenuOpen = ref(false)

  function toggleMobileMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }
  function closeMenu() {
    isMenuOpen.value = false
  }
  function goTo(path: string) {
    closeMenu()
    router.push(path)
  }

  // 🔁 ferme à chaque changement de route
  router.afterEach(() => closeMenu())

  // 📏 ferme si retour en desktop
  const stopWatch = watch(isMobile, (mobile) => {
    if (!mobile) closeMenu()
  })
  onUnmounted(() => stopWatch())
</script>

<style scoped lang="less">
  /* --- STRUCTURE --- */
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
      gap: 10px;
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

  /* --- LOGO --- */
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

  /* --- BURGER --- */
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

  /* --- OVERLAY --- */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 2000;
    display: flex;
    justify-content: flex-start;
  }

  /* --- DRAWER --- */
  .mobile-drawer {
    position: relative;
    width: 270px;
    height: 100vh;
    background: fade(@neutral-800, 96%);
    color: white;
    box-shadow:
      2px 0 25px rgba(0, 0, 0, 0.45),
      inset -2px 0 8px rgba(255, 255, 255, 0.05);
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;

    /* 🌈 Glow vertical */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -1px;
      width: 6px;
      height: 100%;
      background: linear-gradient(to right, rgba(255, 255, 255, 0.08), transparent);
      border-radius: 0 12px 12px 0;
    }

    .drawer-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;

      .drawer-logo {
        width: 28px;
        height: 28px;
      }
    }

    .drawer-links {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .drawer-divider {
      height: 1px;
      background: fade(white, 12%);
      margin: 8px 0;
    }

    .drawer-link {
      background: none;
      border: none;
      color: white;
      text-align: left;
      padding: 8px 0;
      font-size: 16px;
      cursor: pointer;
      &:hover {
        color: @primary-400;
      }
    }

    .drawer-auth {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: auto;
    }
  }

  /* --- TRANSITION --- */
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
    transform: translateX(-100%);
  }

  /* --- RESPONSIVE --- */
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
        gap: 16px;
      }
    }
  }
</style>
