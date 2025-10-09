<template>
  <aside
    v-if="true"
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
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useSidebarState } from './useSidebarState'
  import SidebarLogo from './SidebarLogo.vue'
  import SidebarItems from './SidebarItems.vue'

  const sidebar = ref<HTMLElement | null>(null)

  const { isSidebarReduced, toggleSidebar, sidebarItems } = useSidebarState(sidebar)

</script>

<style lang="less">
  @import 'SideBar.less';
</style>
