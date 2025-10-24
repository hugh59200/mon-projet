<template>
  <div
    class="app-grid"
    :class="{ 'sidebar-reduced': sidebar.isReduced }"
  >
    <HeaderApp class="header" />
    <SidebarApp class="sidebar" />
    <main class="content">
      <RouterView v-slot="{ Component }">
        <transition
          name="fade-slide"
          mode="out-in"
          appear
        >
          <component
            :is="Component"
            :key="$route.fullPath"
            @vue:beforeMount="sablier.debutSablier"
            @vue:mounted="sablier.finSablier"
          />
        </transition>
      </RouterView>
      <transition
        name="fade"
        appear
      >
        <SablierComponent v-if="sablier.estSablierVisible" />
      </transition>
    </main>
    <FooterApp class="footer" />
    <AppRegisterGlobals />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
  import AppRegisterGlobals from '@/AppRegisterGlobals.vue'
  import { useCartStore } from '@/features/cart/useCartStore'
  import FooterApp from '@/features/interface/layout/footer/FooterApp.vue'
  import HeaderApp from '@/features/interface/layout/header/Header.vue'
  import SidebarApp from '@/features/interface/layout/sideBar/SidebarApp.vue'
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import SablierComponent from '@/features/interface/sablier/SablierComponent.vue'
  import { useSablierStore } from '@/features/interface/sablier/useSablierStore'
  import { supabase } from '@/services/supabaseClient'
  import ToastContainer from '@designSystem/components/basic/toast/ToastContainer.vue'

  const cart = useCartStore()
  const sidebar = useSidebarStore()
  const sablier = useSablierStore()

  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) cart.items = []
  })
</script>

<style scoped lang="less">
  @import '/src/assets/Mont/Mont.less';

  /* --- STRUCTURE GRID --- */
  .app-grid {
    display: grid;
    grid-template-columns: 240px 1fr;
    grid-template-rows: 60px 1fr auto;
    grid-template-areas:
      'header header'
      'sidebar content'
      'sidebar footer';
    height: 100vh;
    width: 100vw;
    background-color: @neutral-0;
    overflow: hidden;
    transition: grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* --- HEADER --- */
  .header {
    grid-area: header;
    position: sticky;
    top: 0;
    z-index: 1000;
    height: 60px;
    background-color: @secondary-800;
  }

  /* --- SIDEBAR --- */
  .sidebar {
    grid-area: sidebar;
    background-color: @secondary-800;
    color: white;
    height: 100%;
    z-index: 9;
  }

  /* --- CONTENU --- */
  .content {
    grid-area: content;
    background-color: @neutral-0;
    padding: 40px 60px 80px;
    overflow-y: auto;
    height: 100%;
    min-height: 0;
    scroll-behavior: smooth;
    position: relative;
  }

  /* --- FOOTER --- */
  .footer {
    position: fixed;
    bottom: 0;
    left: 240px;
    right: 0;
    z-index: 950;
    height: 40px;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .app-grid.sidebar-reduced .footer {
    left: 80px;
  }

  /* ✨ TRANSITION entre pages */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  /* Effet doux sur le sablier */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
