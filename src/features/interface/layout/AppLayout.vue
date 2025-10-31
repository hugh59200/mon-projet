<template>
  <div class="app-layout">
    <!-- ✨ HEADER avec glassmorphism et animations directives -->
    <header
      class="header"
      v-responsive-animate.fade.once="{ speed: 600 }"
      :class="{ 'header--hidden': isHidden, 'header--scrolled': hasScrolled }"
      :style="{
        backdropFilter: `blur(${blurIntensity}px)`,
        background: `rgba(255, 255, 255, ${bgOpacity})`,
      }"
    >
      <div
        class="header__inner"
        v-feedback-animate.glow="{ color: 'rgba(255,255,255,0.35)', scale: 1.05 }"
      >
        <HeaderApp />
      </div>
    </header>

    <!-- 🌍 CONTENU PRINCIPAL -->
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
          <keep-alive include="Actualites">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </RouterView>

      <transition
        name="fade"
        appear
      >
        <SablierComponent v-if="sablier.estSablierVisible" />
      </transition>
    </main>

    <!-- 🦶 FOOTER -->
    <footer
      class="footer"
      v-responsive-animate.slide.once="{ speed: 700 }"
    >
      <FooterApp />
    </footer>

    <!-- Enregistrement global -->
    <AppRegisterGlobals />
  </div>
</template>

<script setup lang="ts">
  import AppRegisterGlobals from '@/AppRegisterGlobals.vue'
  import { vFeedbackAnimate } from '@/directives/vFeedbackAnimate'
  import { vFocusable } from '@/directives/vFocus'
  import { vResponsiveAnimate } from '@/directives/vResponsiveAnimate'
  import { useCartStore } from '@/features/catalogue/cart/useCartStore'
  import FooterApp from '@/features/interface/layout/footer/FooterApp.vue'
  import HeaderApp from '@/features/interface/layout/header/Header.vue'
  import SablierComponent from '@/features/interface/sablier/SablierComponent.vue'
  import { useSablierStore } from '@/features/interface/sablier/useSablierStore'
  import { supabase } from '@/supabase/supabaseClient'
  import { computed, onMounted, onUnmounted, ref } from 'vue'

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

  const blurIntensity = computed(() => Math.min(scrollY.value / 70, 16))
  const bgOpacity = computed(() => Math.min(0.65 + scrollY.value / 600, 0.92))

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

  /* ============================
   🧩 STRUCTURE
============================ */
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(180deg, #f9fafb, #f1f3f5);
    overflow-x: hidden;
    overflow-y: auto;
  }

  /* ============================
   🧭 HEADER GLASSMORPHISM
============================ */
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

    /* 👇 Apparence initiale */
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  }

  /* 🔽 Masqué quand on descend */
  .header--hidden {
    transform: translateY(-100%);
    opacity: 0;
    box-shadow: none;
  }

  /* 🔼 Revient en douceur + verre dépoli accentué */
  .header--scrolled:not(.header--hidden) {
    backdrop-filter: blur(14px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    opacity: 1;
  }

  /* ============================
   📄 CONTENU
============================ */
  .content {
    flex: 1;
    padding: 2.5vw 4vw;
    color: @neutral-900;
    transition: padding 0.3s ease;

    @media (max-width: 900px) {
      padding: 16px 20px;
    }
    @media (min-width: 1400px) {
      padding: 50px 80px;
    }
  }

  /* ============================
   🦶 FOOTER
============================ */
  .footer {
    z-index: 950;
    background: fade(@neutral-100, 60%);
    backdrop-filter: blur(10px);
    padding: 8px 0;
  }

  /* ============================
   ✨ TRANSITIONS
============================ */
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

  /* ============================
   🧠 SCROLLBAR CUSTOM
============================ */
  .app-layout::-webkit-scrollbar {
    width: 8px;
  }
  .app-layout::-webkit-scrollbar-thumb {
    background: fade(@neutral-600, 25%);
    border-radius: 8px;
  }
  .app-layout::-webkit-scrollbar-thumb:hover {
    background: fade(@neutral-600, 45%);
  }
</style>
