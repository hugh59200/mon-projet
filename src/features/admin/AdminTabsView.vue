<template>
  <WrapperForm
    v-model="selectedTab"
    :tabs="tabs"
    class="tabs-view"
  >
    <router-view v-slot="{ Component }">
      <transition
        name="fade-slide"
        mode="out-in"
        appear
      >
        <keep-alive include="Actualites">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </WrapperForm>
</template>

<script setup lang="ts">
  import type { RouteName } from '@/router/route-name'
  import { useNavigationTabs } from '@designSystem/components/wrapper/form/useNavigationTabs'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { tabs, goToTab } = useNavigationTabs()

  // ✅ Corrigé : on travaille avec les noms de routes, pas les labels
  const selectedTab = computed({
    get: () => route.name as RouteName,
    set: (routeName: RouteName) => goToTab(routeName),
  })
</script>

<style scoped lang="less">
  .tabs-view {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
</style>
