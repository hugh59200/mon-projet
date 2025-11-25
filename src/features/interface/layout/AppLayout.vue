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

  // ✅ Détection intelligente : Est-ce une page "Standalone" (Auth, Paiement, etc.) ?
  const isAuthPage = computed(() => {
    // Vérifie si le chemin commence par /auth
    // OU si c'est une page de paiement (/paiement/success, /paiement/cancel)
    // OU si c'est la page de suivi de commande (/suivi-commande) si tu veux qu'elle soit aussi clean
    return route.path.startsWith('/auth') || route.path.startsWith('/paiement')
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) cart.items = []
  })

  // HEADER dynamique (Logique existante conservée)
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

  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(180deg, @neutral-200, @neutral-100);
    overflow-x: hidden;
    overflow-y: auto;
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

  /* ✅ Classe standard pour le contenu de l'app (avec padding) */
  .content {
    min-width: 250px;
    min-height: 60vh;
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

  /* ✅ NOUVELLE CLASSE : Mode Plein Écran pour Auth */
  /* Elle annule les styles de .content pour laisser AuthLayout gérer le layout */
  .auth-fullscreen {
    width: 100%;
    min-height: 100vh;
    padding: 0 !important;
    margin: 0 !important;
    background: white; /* Ou transparent si AuthLayout a son propre fond */
    display: flex;
    flex-direction: column;

    /* Important : S'assurer qu'il n'y a pas de marge héritée */
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

  .app-layout::-webkit-scrollbar {
    width: 8px;
  }
  .app-layout::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, @neutral-600 25%, transparent);
    border-radius: 8px;
  }
  .app-layout::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, @neutral-600 45%, transparent);
  }
</style>
