<template>
  <nav class="main-nav">
    <RouterLink
      v-for="item in sidebarItems"
      :key="item.path"
      :to="item.path"
      class="main-nav__link"
      active-class="active"
    >
      <BasicIconNext
        :name="item.icon"
        :size="18"
      />
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import { storeToRefs } from 'pinia'

  const { sidebarItems } = storeToRefs(useSidebarStore())
</script>

<style scoped lang="less">
  .main-nav {
    display: flex;
    align-items: center;
    gap: 26px;

    .main-nav__link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: fade(white, 80%);
      font-weight: 500;
      text-decoration: none;
      transition: all 0.25s ease;
      padding: 6px 8px;
      border-radius: 6px;

      &:hover {
        color: white;
        background: fade(white, 10%);
      }

      &.active {
        color: white;
        background: fade(@primary-500, 25%);
        box-shadow: 0 0 0 1px fade(@primary-500, 25%);
      }

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
</style>
