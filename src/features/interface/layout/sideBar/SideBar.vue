<template>
  <aside
    v-if="appState.estUtilisateurAuthentifie"
    ref="sidebar"
    :class="['sidebar', { reduced: isSidebarReduced }]"
  >
    <SidebarLogo
      :reduced="isSidebarReduced"
      @toggleSidebar="toggleSidebar"
    />

    <div class="sidebar__content">
      <SidebarItems
        :reduced="isSidebarReduced"
        :items="sidebarItems"
      />
      <SidebarQuickAccess
        :reduced="isSidebarReduced"
        :favoris="storeFavoris.favoris ?? []"
        @deleteFavorite="deleteFavorite"
        @navigateToFavori="storeFavoris.navigateToFavori"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useAppStateStore } from '@/features/application'
  import { useSidebarState } from './useSidebarState'
  import SidebarLogo from './SidebarLogo.vue'
  import SidebarItems from './SidebarItems.vue'
  import SidebarQuickAccess from './SidebarQuickAccess.vue'

  const sidebar = ref<HTMLElement | null>(null)

  const { isSidebarReduced, toggleSidebar, sidebarItems, deleteFavorite, storeFavoris } = useSidebarState(sidebar)

  const appState = useAppStateStore()
</script>

<style lang="less">
  @import 'SideBar.less';
</style>
