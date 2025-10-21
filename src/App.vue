<template>
  <div class="app-layout">
    <Header />
    <div
      class="app-body"
      :class="{ 'sidebar-reduced': sidebar.isReduced }"
    >
      <SidebarApp />

      <main class="app-main">
        <RouterView />
      </main>
    </div>
    <FooterApp />
    <ToastContainer />
    <SablierComponent />
  </div>
</template>

<script setup lang="ts">
  import FooterApp from '@/features/interface/layout/footer/FooterApp.vue'
  import Header from '@/features/interface/layout/header/Header.vue'
  import SidebarApp from '@/features/interface/layout/sideBar/SidebarApp.vue'
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import SablierComponent from '@/features/interface/sablier/SablierComponent.vue'
  import ToastContainer from '@designSystem/components/basic/toast/ToastContainer.vue'
  import { useCartStore } from './features/cart/useCartStore'
  import { supabase } from './services/supabaseClient'

  const sidebar = useSidebarStore()
  const cart = useCartStore()

  // Vider le panier si déconnexion
  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) cart.items = []
  })
</script>

<style scoped lang="less">
  @import '/src/assets/Mont/Mont.less';

  /* 🧱 Layout général */
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
  }

  /* ⚙️ Conteneur principal */
  .app-body {
    display: flex;
    flex: 1;
    transition: margin-left 0.3s ease;
    margin-left: 240px; // largeur sidebar
    position: relative;
  }

  /* 📱 Mode réduit */
  .app-body.sidebar-reduced {
    margin-left: 80px;
  }

  /* 📜 Contenu scrollable */
  .app-main {
    flex: 1;
    background: white;
    transition: all 0.3s ease;
    height: calc(100vh - 60px); // ⚡ occupe l’espace sous le header
    overflow: hidden;
  }

  /* 🧍 Responsif mobile */
  @media (max-width: 900px) {
    .app-body {
      margin-left: 0;
    }

    .app-main {
      padding: 16px;
    }
  }
</style>
