<template>
  <transition name="slide">
    <aside
      v-if="sidebar.isOpen"
      class="sidebar"
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
  </transition>
</template>

<script setup lang="ts">
  import { useSidebarStore } from './useSidebarStore' // ✅

  const sidebar = useSidebarStore() // ✅
</script>

<style scoped lang="less">
  .sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    width: 220px;
    height: calc(100vh - 60px);
    background: @secondary-800;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 24px 18px;
    z-index: 900;
    border-right: 1px solid fade(white, 10%);
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &__header {
      margin-bottom: 28px;
      text-align: left;
      color: fade(white, 85%);
    }

    &__links {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: fade(white, 80%);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.25s ease;
      text-align: left;

      &:hover {
        background: fade(white, 10%);
        color: white;
      }

      &.active {
        background: @primary-600;
        color: white;
        font-weight: bold;
      }

      i {
        font-size: 16px;
      }
    }
  }

  /* 📱 Responsive : sidebar devient nav du bas */
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

      &__header {
        display: none;
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
