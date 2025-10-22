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
          />
        </transition>
      </RouterView>
    </main>
    <FooterApp class="footer" />
    <ToastContainer />
    <SablierComponent />
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/features/cart/useCartStore'
  import FooterApp from '@/features/interface/layout/footer/FooterApp.vue'
  import HeaderApp from '@/features/interface/layout/header/Header.vue'
  import SidebarApp from '@/features/interface/layout/sideBar/SidebarApp.vue'
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import SablierComponent from '@/features/interface/sablier/SablierComponent.vue'
  import { supabase } from '@/services/supabaseClient'
  import ToastContainer from '@designSystem/components/basic/toast/ToastContainer.vue'

  const cart = useCartStore()
  const sidebar = useSidebarStore()

  // 🔁 Vide le panier à la déconnexion
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
    transition: grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1); // 🧠 fluide
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
    z-index: 999;
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
  }

  /* --- FOOTER --- */
  .footer {
    position: fixed;
    bottom: 0;
    left: 240px;
    right: 0;
    z-index: 950;
    height: 30px;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .app-grid.sidebar-reduced .footer {
    left: 80px;
  }

  /* ✨ TRANSITION entre pages */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.1s cubic-bezier(0.25, 1, 0.5, 1); // 200ms
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
</style>
