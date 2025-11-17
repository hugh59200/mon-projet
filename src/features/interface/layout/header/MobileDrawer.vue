<template>
  <transition name="slide-left">
    <div
      v-if="modelValue"
      class="mobile-overlay"
      @click.self="closeDrawer"
    >
      <aside
        class="mobile-drawer"
        v-click-outside="{ callback: closeDrawer }"
        v-responsive-animate.slide.stagger.once="{ delay: 70 }"
      >
        <div class="drawer-header">
          <img
            src="@/assets/logo-app.png"
            class="drawer-logo"
            alt="logo"
          />
          <BasicText
            weight="bold"
            color="white"
          >
            Menu
          </BasicText>
        </div>

        <div
          class="drawer-links"
          v-responsive-animate.slide.stagger.once="{ delay: 50 }"
        >
          <MainNavLinks
            direction="column"
            @navigate="closeDrawer"
          />
        </div>

        <div class="drawer-divider"></div>

        <template v-if="auth.user">
          <div class="drawer-links">
            <button
              class="drawer-link"
              @click="goTo('/profil')"
            >
              Mon profil
            </button>
          </div>
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
</template>

<script setup lang="ts">
  import { vClickOutside } from '@/directives/vClickOutside'
  import { vResponsiveAnimate } from '@/directives/vResponsiveAnimate'
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import { useRouter } from 'vue-router'
  import MainNavLinks from './MainNavLinks.vue'

  defineOptions({
    directives: {
      clickOutside: vClickOutside,
      responsiveAnimate: vResponsiveAnimate,
    },
  })

  const modelValue = defineModel<boolean>({ required: true })
  const auth = useAuthStore()
  const router = useRouter()

  function closeDrawer() {
    modelValue.value = false
  }

  function goTo(path: string) {
    closeDrawer()
    router.push(path)
  }

  router.afterEach(() => closeDrawer())
</script>

<style scoped lang="less">
  /* ============================
     🔵 OVERLAY (fond sombre Neural)
     ============================ */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: fade(@secondary-900, 65%); // bleu-noir Neural
    backdrop-filter: blur(6px);
    z-index: 2000;
    display: flex;
    justify-content: flex-start;
  }

  /* ============================
     🔵 DRAWER (glass panel Neural)
     ============================ */
  .mobile-drawer {
    width: 270px;
    height: 100vh;

    /* Fond en verre bleu sombre */
    background: fade(@secondary-900, 92%);
    backdrop-filter: blur(12px);

    color: white;

    /* Ombres plus propres, moins noires */
    box-shadow:
      3px 0 22px fade(@primary-950, 45%),
      inset -3px 0 10px fade(white, 4%);

    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;

    padding: 26px;
    display: flex;
    flex-direction: column;

    overflow-y: auto;
    overflow-x: hidden;

    scrollbar-width: thin;
    scrollbar-color: fade(@neutral-500, 30%) transparent;
  }

  /* ============================
     HEADER
     ============================ */
  .drawer-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;

    .drawer-logo {
      width: 30px;
      height: 30px;
      filter: drop-shadow(0 0 4px fade(@primary-700, 40%));
    }
  }

  /* ============================
     LINKS
     ============================ */
  .drawer-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  /* Ligne séparatrice Neural */
  .drawer-divider {
    height: 1px;
    background: fade(@neutral-500, 25%);
    margin: 16px 0;
  }

  .drawer-link {
    background: none;
    border: none;
    color: @neutral-0;
    text-align: left;
    padding: 8px 0;
    font-size: 16px;
    cursor: pointer;

    transition: all 0.25s ease;

    &:hover {
      color: @primary-300;
      transform: translateX(4px);
    }
  }

  /* ============================
     AUTH BUTTONS AREA
     ============================ */
  .drawer-auth {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: auto;
  }

  /* ============================
     TRANSITIONS
     ============================ */
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .slide-left-enter-from {
    opacity: 0;
    transform: translateX(-20%);
    filter: blur(8px);
  }

  .slide-left-leave-to {
    opacity: 0;
    transform: translateX(-16%);
    filter: blur(6px);
  }
</style>
