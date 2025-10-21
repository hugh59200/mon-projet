<template>
  <div
    class="app-grid"
    :class="{ 'sidebar-reduced': sidebar.isReduced }"
  >
    <HeaderApp class="header" />
    <SidebarApp class="sidebar" />
    <main class="content">
      <RouterView />
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

  // 🔁 Vider le panier si l’utilisateur se déconnecte
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
    grid-template-rows: 60px auto auto; // ✅ l’auto au centre permet d’adapter la hauteur du contenu
    grid-template-areas:
      'header header'
      'sidebar content'
      'sidebar footer';
    min-height: 100vh; // ✅ remplace height par min-height
    width: 100vw;
    overflow: hidden;
    background-color: @neutral-0;
    gap: 0;
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
    padding: 40px 60px 80px; // ✅ ajout du padding bas
    overflow-y: auto;
    height: 100%;
  }
  /* --- FOOTER --- */
  .footer {
    position: fixed;
    bottom: 0;
    left: 240px; // largeur sidebar
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: @secondary-700;
    color: white;
    text-align: center;
    z-index: 950; // sous le header
    padding: 0 16px;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  }

  /* 🧩 Si sidebar réduite */
  .app-grid.sidebar-reduced .footer {
    left: 80px;
    transition: left 0.3s ease;
  }
  /* --- SIDEBAR RÉDUITE --- */
  .app-grid.sidebar-reduced {
    grid-template-columns: 80px 1fr;
    transition: grid-template-columns 0.3s ease;
  }
</style>
