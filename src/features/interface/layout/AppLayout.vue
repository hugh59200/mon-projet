<template>
  <div class="app-layout">
    <HeaderApp class="header" />
    <main
      class="content"
      v-responsive-animate.fade.scroll.stagger.once="{ delay: 100, speed: 600 }"
    >
      <RouterView v-slot="{ Component }">
        <transition
          name="fade-slide"
          mode="out-in"
          appear
        >
          <component :is="Component" />
        </transition>
      </RouterView>
      <transition
        name="fade"
        appear
      >
        <SablierComponent v-if="sablier.estSablierVisible" />
      </transition>
    </main>
    <footer
      class="footer"
      v-responsive-animate.slide.once="{ speed: 700 }"
    >
      <FooterApp />
    </footer>

    <AppRegisterGlobals />
  </div>
</template>

<script setup lang="ts">
  import AppRegisterGlobals from '@/AppRegisterGlobals.vue'
  import { vFeedbackAnimate } from '@/directives/vFeedbackAnimate'
  import { vFocusable } from '@/directives/vFocus'
  import { vResponsiveAnimate } from '@/directives/vResponsiveAnimate'
  import { useCartStore } from '@/features/catalogue/cart/stores/useCartStore'
  import FooterApp from '@/features/interface/layout/footer/FooterApp.vue'
  import HeaderApp from '@/features/interface/layout/header/Header.vue'
  import SablierComponent from '@/features/interface/sablier/SablierComponent.vue'
  import { useSablierStore } from '@/features/interface/sablier/useSablierStore'
  import { supabase } from '@/supabase/supabaseClient'
  import { onMounted, onUnmounted, ref } from 'vue'

  defineOptions({
    directives: {
      responsiveAnimate: vResponsiveAnimate,
      feedbackAnimate: vFeedbackAnimate,
      focusable: vFocusable,
    },
  })

  const sablier = useSablierStore()
  const cart = useCartStore()

  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) cart.items = []
  })

  // 🧭 Gestion du header dynamique
  const lastScroll = ref(0)
  const scrollY = ref(0)
  const isHidden = ref(false)
  const hasScrolled = ref(false)

  const handleScroll = () => {
    scrollY.value = window.scrollY
    hasScrolled.value = scrollY.value > 60
    if (scrollY.value > lastScroll.value && scrollY.value > 120) {
      isHidden.value = true
    } else {
      isHidden.value = false
    }
    lastScroll.value = scrollY.value
  }

  onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped lang="less">
  @import '/src/assets/Mont/Mont.less';

  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(180deg, #f9fafb, #f1f3f5);
    overflow-x: hidden;
    overflow-y: auto;
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 1000;

    transition:
      transform 0.4s ease,
      opacity 0.35s ease,
      backdrop-filter 0.4s ease,
      background 0.4s ease,
      box-shadow 0.4s ease;

    will-change: transform, opacity, backdrop-filter;

    /* Base macOS Glass */
    background: rgba(var(--surface-2-rgb), 0.55);
    backdrop-filter: blur(14px) saturate(160%);
    border-bottom: 1px solid rgba(var(--surface-border-rgb), 0.35);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }

  .header--hidden {
    transform: translateY(-100%);
    opacity: 0;
    box-shadow: none;
  }

  .header--scrolled:not(.header--hidden) {
    backdrop-filter: blur(20px) saturate(180%);
    background: rgba(var(--surface-3-rgb), 0.55);
    box-shadow: var(--surface-elevated-shadow);
  }

  /* DARK MODE */
  [data-theme='dark'] .header {
    background: rgba(var(--surface-2-rgb), 0.35);
    border-bottom: 1px solid rgba(var(--neutral-500-rgb), 0.35);
    box-shadow: 0 6px 26px rgba(0, 0, 0, 0.55);
  }

  [data-theme='dark'] .header--scrolled:not(.header--hidden) {
    background: rgba(var(--surface-3-rgb), 0.45);
    backdrop-filter: blur(22px) saturate(180%);
  }

  .content {
    min-width: 250px;
    flex: 1;
    min-height: 100vh;
    padding: 2.5vw 4vw;
    background-color: @neutral-400;
    color: @neutral-900;
    transition: padding 0.3s ease;

    @media (max-width: 900px) {
      padding: 16px 20px;
    }
    @media (min-width: 1400px) {
      padding: 50px 80px;
    }
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .app-layout::-webkit-scrollbar {
    width: 8px;
  }
  .app-layout::-webkit-scrollbar-thumb {
    background: rgba(var(--neutral-600-rgb), 0.25);
    border-radius: 8px;
  }
  .app-layout::-webkit-scrollbar-thumb:hover {
    background: rgba(var(--neutral-600-rgb), 0.45);
  }
</style>
