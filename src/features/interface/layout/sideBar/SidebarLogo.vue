<template>
  <div class="sidebar__logo">
    <BasicIcon
      :class="['sidebar__logo--reducer-icon', { reduced }]"
      :name="reduced ? 'menu-grid-reduced' : 'menu-grid'"
      active
      pointer
      @click="$emit('toggleSidebar')"
    />
    <div class="sidebar__logo-container">
      <img
        src="@/assets/logo-monespace-vert.png"
        alt="Logo AKTO"
        :class="['sidebar__logo--akto-logo', { reduced }]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  type SidebarLogoProps = {
    reduced?: boolean
  }

  withDefaults(defineProps<SidebarLogoProps>(), {
    reduced: false,
  })
</script>
<style lang="less">
  @import 'SidebarLogo.less';
</style>
