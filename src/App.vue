<template>
  <div class="app-grid" :class="{ 'sidebar-reduced': sidebar.isReduced }">
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
import SablierComponent from '@/features/interface/sablier/SablierComponent.vue'
import { supabase } from '@/services/supabaseClient'
import ToastContainer from '@designSystem/components/basic/toast/ToastContainer.vue'
import SidebarApp from './features/interface/layout/sideBar/SidebarApp.vue'
import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'

const cart = useCartStore()
const sidebar = useSidebarStore()

supabase.auth.onAuthStateChange((_event, session) => {
  if (!session) cart.items = []
})
</script>

<style scoped lang="less">
@import '/src/assets/Mont/Mont.less';

/* 🔧 Réinitialisation du spacing global */
:global(html, body) {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: @neutral-0;
}

/* 🎯 GRID PRINCIPALE — sans espaces */
.app-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar content"
    "sidebar footer";
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: @neutral-0;
  gap: 0; // ✅ enlève les petits espaces de séparation
}

/* 🔝 Header */
.header {
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 📚 Sidebar */
.sidebar {
  grid-area: sidebar;
  background-color: @secondary-800;
  color: white;
  height: 100%;
  z-index: 9;
  border-right: 0; // ✅ pas de bordure parasite
}

/* 📄 Contenu principal */
.content {
  grid-area: content;
  background-color: @neutral-0;
  padding: 40px 60px 60px;
  overflow-y: auto;
  height: 100%;
}

/* 🦶 Footer */
.footer {
  grid-area: footer;
  background-color: @secondary-700;
  color: white;
  text-align: center;
  padding: 12px;
  margin: 0;
  border-top: none;
}

/* 📏 Mode réduit */
.app-grid.sidebar-reduced {
  grid-template-columns: 80px 1fr;
  transition: grid-template-columns 0.3s ease;
}

/* 📱 Responsive */
@media (max-width: 900px) {
  .app-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr auto;
    grid-template-areas:
      "header"
      "content"
      "footer";
  }

  .sidebar {
    display: none;
  }

  .content {
    padding: 80px 16px 40px;
  }
}
</style>
