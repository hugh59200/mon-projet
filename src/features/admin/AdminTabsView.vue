<template>
  <WrapperForm
    v-model="selectedTab"
    :tabs="tabs"
    show-stepper
    :tabs-placement="tabsPlacement"
    class="tabs-view"
  >
    <!-- ✅ Passe automatiquement la prop readonly à tous les sous-composants -->
    <component
      :is="tabComponents[selectedTab]"
      v-bind="{ readonly: !isAdmin }"
    />
  </WrapperForm>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { computed, ref } from 'vue'

  import AdminChatView from './chat/AdminChatView.vue'
  import AdminOrdersView from './orders/AdminOrdersView.vue'
  import AdminProductsTable from './products/AdminProductsTable.vue'
  import AdminStatsView from './stats/AdminStatsView.vue'
  import AdminUsersView from './users/AdminUsersView.vue'

  withDefaults(
    defineProps<{
      tabsPlacement?: 'center' | 'start'
    }>(),
    {
      tabsPlacement: 'center',
    },
  )

  const auth = useAuthStore()
  const isAdmin = computed(() => auth.isAdmin)

  const tabs = [
    { tabKey: 'Messagerie' },
    { tabKey: 'Statistiques' },
    { tabKey: 'Utilisateurs' },
    { tabKey: 'Commandes' },
    { tabKey: 'Produits' },
  ]

  const tabComponents = {
    Messagerie: AdminChatView,
    Statistiques: AdminStatsView,
    Utilisateurs: AdminUsersView,
    Commandes: AdminOrdersView,
    Produits: AdminProductsTable,
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
