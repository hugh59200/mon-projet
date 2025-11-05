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
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 2000;
    display: flex;
    justify-content: flex-start;
  }

  .mobile-drawer {
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
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: fade(white, 25%) transparent;
    position: relative;
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
    gap: 8px;
    width: 100%;
  }

  .drawer-divider {
    height: 1px;
    background: fade(white, 12%);
    margin: 12px 0;
  }

  .drawer-link {
    background: none;
    border: none;
    color: white;
    text-align: left;
    padding: 8px 0;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.25s ease;
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
    transform: translateX(-80%);
  }
</style>
