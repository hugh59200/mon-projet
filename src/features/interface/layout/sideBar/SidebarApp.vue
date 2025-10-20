<template>
  <aside
    class="sidebar"
    :class="{ open: sidebar.isOpen }"
  >
    <nav class="sidebar__links">
      <button
        class="sidebar__link"
        :class="{ active: $route.path === '/' }"
        @click="$router.push('/')"
      >
        <i class="pi pi-home"></i>
        Accueil
      </button>

      <button
        class="sidebar__link"
        :class="{ active: $route.path.includes('/catalogue') }"
        @click="$router.push('/catalogue')"
      >
        <i class="pi pi-list"></i>
        Catalogue
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import { useSidebarStore } from './useSidebarStore'
  const sidebar = useSidebarStore()
</script>

<style scoped lang="less">
  .sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    width: 60px; // largeur réduite par défaut
    height: calc(100vh - 60px);
    background: @secondary-800;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 24px 12px;
    overflow: hidden;
    z-index: 800;
    transition: all 0.3s ease;
    border-right: 1px solid fade(white, 10%);
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);

    &.open {
      width: 220px;
      padding: 24px 18px;
    }

    &__links {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 10px;
    }

    &__link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: fade(white, 80%);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.25s ease;
      text-align: left;
      white-space: nowrap;

      i {
        font-size: 16px;
        width: 20px;
        text-align: center;
      }

      &:hover {
        background: fade(white, 10%);
        color: white;
      }

      &.active {
        background: @primary-600;
        color: white;
        font-weight: bold;
      }
    }
  }

  /* 📱 Responsive : devient nav du bas */
  @media (max-width: 900px) {
    .sidebar {
      position: fixed;
      bottom: 0;
      top: auto;
      width: 100%;
      height: 60px;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      padding: 0 10px;
      border-right: none;
      border-top: 1px solid fade(white, 15%);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);

      &.open {
        width: 100%;
      }

      &__links {
        flex-direction: row;
        gap: 0;
        width: 100%;
        justify-content: space-evenly;
      }

      &__link {
        flex-direction: column;
        gap: 4px;
        font-size: 12px;
        background: none;
        padding: 6px 0;
      }
    }
  }
</style>
