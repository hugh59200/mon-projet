<template>
  <div class="app-layout">
    <!-- 🔝 Header global -->
    <HeaderApp class="header" />

    <!-- 🧩 Contenu principal -->
    <main class="content">
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

    <!-- 🔻 Footer -->
    <FooterApp class="footer" />

    <AppRegisterGlobals />
  </div>
</template>

<script setup lang="ts">
  import AppRegisterGlobals from '@/AppRegisterGlobals.vue'
  import { useCartStore } from '@/features/catalogue/cart/useCartStore'
  import FooterApp from '@/features/interface/layout/footer/FooterApp.vue'
  import HeaderApp from '@/features/interface/layout/header/Header.vue'
  import { useSablierStore } from '@/features/interface/sablier/useSablierStore'
  import { supabase } from '@/supabase/supabaseClient'

  const cart = useCartStore()
  const sablier = useSablierStore()

  // 🧠 Déconnexion auto du panier à la déconnexion
  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) cart.items = []
  })
</script>

<style scoped lang="less">
  @import '/src/assets/Mont/Mont.less';

  /* --- STRUCTURE --- */
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    background: @neutral-0;
    overflow: hidden;
  }

  /* --- HEADER --- */
  .header {
    position: sticky;
    top: 0;
    z-index: 1000;
    height: 64px;
    background-color: @secondary-800;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  /* --- CONTENU --- */
  .content {
    flex: 1;
    padding: 2.5vw 4vw;
    overflow-y: auto;
    background: @neutral-0;
    position: relative;
    transition: padding 0.3s ease;

    @media (max-width: 900px) {
      padding: 16px 20px;
    }

    @media (min-width: 1400px) {
      padding: 50px 80px;
    }
  }

  /* --- FOOTER --- */
  .footer {
    flex-shrink: 0;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    z-index: 950;
    background: @secondary-900;
  }

  /* ✨ TRANSITIONS entre pages */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  /* ✨ Sablier */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
