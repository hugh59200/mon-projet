<template>
  <aside
    class="sidebar"
    :class="[{ reduced: isReduced }, { 'sidebar--open': isMobileOpen }]"
  >
    <nav class="sidebar__items">
      <RouterLink
        v-for="item in sidebarItems"
        :key="item.path"
        :to="item.path"
        class="sidebar__item"
        active-class="active"
        v-slot="{ isActive }"
        @click="isMobileOpen = false"
      >
        <div class="sidebar__icon">
          <BasicIconNext
            :name="item.icon"
            :active="isActive"
          />
        </div>

        <transition name="fade-slide">
          <div
            v-if="!isReduced"
            class="sidebar__label"
          >
            <BasicText
              wrap
              nb-max-lines="2"
              color="white"
            >
              {{ item.label }}
            </BasicText>
          </div>
        </transition>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { ref, watch } from 'vue'
  import { useSidebarStore } from './useSidebarStore'

  const sidebar = useSidebarStore()
  const { sidebarItems, isReduced } = storeToRefs(sidebar)

  const isMobileOpen = ref(false)
  watch(isReduced, () => {
    if (window.innerWidth < 900) isMobileOpen.value = false
  })
</script>

<style scoped lang="less">
  .sidebar {
    position: relative;
    height: 100%;
    width: 100%;
    background: @secondary-800;
    color: @neutral-100;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 20px 0;
    transition:
      width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.3s ease;
    box-shadow: inset -1px 0 0 fade(white, 10%);
    box-sizing: border-box;

    /* Mode réduit */
    &.reduced {
      width: 80px;

      .sidebar__label {
        display: none;
      }
    }

    &__items {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 6px;
      padding: 0 12px;
      width: 100%;
      box-sizing: border-box;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      color: fade(@neutral-100, 80%);
      text-decoration: none;
      transition:
        background-color 0.25s ease,
        color 0.25s ease,
        transform 0.2s ease;
      min-height: 42px;
      background: transparent;
      box-sizing: border-box;

      &:hover {
        background: fade(@neutral-100, 10%);
        color: white;
      }

      &.active {
        background: @primary-600;
        color: white;
        font-weight: bold;
        box-shadow: 0 0 0 1px fade(white, 8%);
      }
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      min-width: 26px;
      height: 26px;

      svg {
        fill: @neutral-100;
        transition: fill 0.3s ease;
      }
    }

    &__label {
      margin-left: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* ✨ Animation fluide du label */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.25s ease;
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-6px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-6px);
  }
</style>
