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
  import AdminChatView from './chat/AdminChatView.vue'
  import AdminOrdersView from './orders/AdminOrdersView.vue'
  import AdminStatsView from './stats/AdminStatsView.vue'
  import AdminUsersView from './users/AdminUsersView.vue'

  withDefaults(defineProps<{ tabsPlacement?: 'center' | 'start'; tabsTitle?: string[] }>(), {
    tabsPlacement: 'center',
  })

  const tabs = [
    { tabKey: 'Messagerie' },
    { tabKey: 'Statistiques' },
    { tabKey: 'Utilisateurs' },
    { tabKey: 'Commandes' },
  ]

  const tabComponents = {
    Messagerie: AdminChatView,
    Statistiques: AdminStatsView,
    Utilisateurs: AdminUsersView,
    Commandes: AdminOrdersView,
  } as const

  const selectedTab = ref<keyof typeof tabComponents>('Messagerie')
</script>

<style scoped lang="less">
  .tabs-view {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
</style>
