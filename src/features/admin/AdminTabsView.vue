<template>
  <WrapperForm
    v-model="selectedTab"
    :tabs="tabs"
    show-stepper
    :tabs-placement="tabsPlacement"
    class="tabs-view"
  >
    <component :is="tabComponents[selectedTab]" />
  </WrapperForm>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import AdminChatView from './sections/AdminChatView.vue'
  import AdminOrdersView from './sections/AdminOrdersView.vue'
  import AdminStatsView from './sections/AdminStatsView.vue'
  import AdminUsersView from './sections/AdminUsersView.vue'

  withDefaults(defineProps<{ tabsPlacement?: 'center' | 'start'; tabsTitle?: string[] }>(), {
    tabsPlacement: 'center',
  })

  const tabs = [
    { tabKey: '💬 Messages clients' },
    { tabKey: '📊 Tableau de bord' },
    { tabKey: '👤 Utilisateurs' },
    { tabKey: '📦 Commandes' },
  ]

  const tabComponents = {
    '💬 Messages clients': AdminChatView,
    '📊 Tableau de bord': AdminStatsView,
    '👤 Utilisateurs': AdminUsersView,
    '📦 Commandes': AdminOrdersView,
  } as const

  const selectedTab = ref<keyof typeof tabComponents>('💬 Messages clients')
</script>

<style scoped lang="less">
  .tabs-view {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
</style>
