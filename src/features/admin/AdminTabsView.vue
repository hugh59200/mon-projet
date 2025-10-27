<template>
  <div class="admin-tabs-view">
    <WrapperForm
      v-model="selectedTab"
      :tabs="tabs"
      show-stepper
      tabs-placement="center"
      :key="selectedTab"
    >
      <router-view />
    </WrapperForm>
  </div>
</template>

<script setup lang="ts">
  import type { RouteName } from '@/router/route-name'
  import { useNavigationTabs } from '@designSystem/components/wrapper/form/useNavigationTabs'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const props = withDefaults(
    defineProps<{
      tabsPlacement?: 'center' | 'start'
      tabsTitle?: string[]
    }>(),
    { tabsPlacement: 'center' },
  )

  const { tabs, goToTab, getTabsTitle } = useNavigationTabs(props.tabsTitle)

  const route = useRoute()

  const selectedTab = computed({
    get: () => getTabsTitle(route.name as RouteName),
    set: (routeName: RouteName) => {
      goToTab(routeName)
    },
  })
</script>

<style scoped>
  .admin-tabs-view {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
