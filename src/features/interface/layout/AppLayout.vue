<template>
  <div class="app-layout">
    <HeaderApp v-if="!isAuthPage" />

    <main
      :class="['main-wrapper', { content: !isAuthPage, 'auth-fullscreen': isAuthPage }]"
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
      v-if="!isAuthPage"
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
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  defineOptions({
    directives: {
      responsiveAnimate: vResponsiveAnimate,
      feedbackAnimate: vFeedbackAnimate,
      focusable: vFocusable,
    },
  })

  const route = useRoute()
  const sablier = useSablierStore()
  const cart = useCartStore()

  const isAuthPage = computed(() => {
    return route.path.startsWith('/auth') || route.path.startsWith('/paiement')
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) cart.items = []
  })

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

  .breadcrumb-wrapper {
    position: relative;
    z-index: 900;
  }

  /* ═══════════════════════════════════════════════════════════════
     APP LAYOUT - Premium Background
     ═══════════════════════════════════════════════════════════════ */
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    background: linear-gradient(180deg, #f8f9fc 0%, #f1f4f9 40%, #e8edf5 100%);
  }

  /* Overlay décoratif subtil (optionnel) */
  .app-layout::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;

    /* Mesh gradient très subtil pour ajouter de la profondeur */
    background:
      radial-gradient(
        ellipse 60% 40% at 10% 0%,
        rgba(var(--primary-500-rgb), 0.02) 0%,
        transparent 50%
      ),
      radial-gradient(ellipse 50% 30% at 90% 100%, rgba(16, 185, 129, 0.015) 0%, transparent 50%);
  }

  /* Header existant */
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

    .header__inner {
      transition: all 0.3s ease;
    }

    background: rgba(var(--secondary-900-rgb), 0.65);
    backdrop-filter: blur(14px);
    box-shadow: 0 4px 20px fade(black, 20%);
  }

  .header--hidden {
    transform: translateY(-100%);
    opacity: 0;
    box-shadow: none;
  }

  .header--scrolled:not(.header--hidden) {
    backdrop-filter: blur(14px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    opacity: 1;
  }

  /* ✅ Contenu principal */
  .content {
    position: relative;
    z-index: 1;
    min-width: 250px;
    min-height: 60vh;

    /* Fond transparent pour laisser voir le gradient de l'app-layout */
    background: transparent;

    color: @neutral-900;
    transition: padding 0.3s ease;
  }

  /* Mode Auth plein écran */
  .auth-fullscreen {
    width: 100%;
    min-height: 100vh;
    padding: 0 !important;
    margin: 0 !important;
    background: white;
    display: flex;
    flex-direction: column;

    & > div {
      flex: 1;
    }
  }

  /* Transitions */
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

  /* Scrollbar */
  .app-layout::-webkit-scrollbar {
    width: 8px;
  }
  .app-layout::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.25);
    border-radius: 8px;
  }
  .app-layout::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.4);
  }
</style>
