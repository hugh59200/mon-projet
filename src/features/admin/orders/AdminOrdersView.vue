<template>
  <div>
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher une commande..."
      :show-reset="true"
      @reset="reset"
    />
    <BasicPagination
      :current-page="page"
      :nb-pages="nbPages"
      :nb-results="total"
      :nb-pages-max="5"
      :auto-fetch="fetchData"
      @change="page = $event"
    />
    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && filteredData.length === 0"
      message="Chargement des commandes..."
      empty-message="Aucune commande trouvée 😅"
    >
      <div class="orders--desktop">
        <div class="cardLayoutWrapper cardLayoutWrapper--header">
          <BasicCell
            :span="10"
            text="Client"
          />
          <BasicCell
            center
            :span="6"
            text="Total"
          />
          <BasicCell
            center
            :span="6"
            text="Date"
          />
          <BasicCell
            center
            :span="8"
            text="Statut"
          />
          <BasicCell
            center
            :span="6"
            text="Détails"
          />
        </div>
        <OrderRow
          v-for="o in filteredData"
          :order="o"
          :status="localStatuses[o.order_id ?? ''] ?? 'pending'"
          @update:status="(v) => changeOrderStatus(o, v)"
          :statuses="STATUSES"
          :format-date="formatDate"
          :format-currency="formatCurrency"
          :handle-status="changeOrderStatus"
          :remove="deleteOrder"
          :open="openOrderModal"
        />
      </div>
      <div class="mobile-cards-list">
        <OrderCardMobile
          v-for="o in filteredData"
          :order="o"
          :status="localStatuses[o.order_id ?? ''] ?? 'pending'"
          @update:status="(v) => changeOrderStatus(o, v)"
          :statuses="STATUSES"
          :format-date="formatDate"
          :format-currency="formatCurrency"
          :handle-status-change="changeOrderStatus"
          :open-order-modal="openOrderModal"
          :handle-delete="deleteOrder"
        />
      </div>
    </WrapperLoader>
    <teleport to="#app">
      <AdminOrderDetailsModal
        v-if="selectedOrderId"
        v-model="isModalVisible"
        :order-id="selectedOrderId"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import { useOrderActions } from '@/supabase/actions/useOrderActions'
  import { formatCurrency, formatDate } from '@/utils'
  import type { OrderStatus } from '@/utils/status'
  import { STATUSES } from '@/utils/status'
  import { ref, watchEffect } from 'vue'

  import BasicToolbar from '../shared/components/BasicToolbar.vue'
  import OrderRow from './OrderRow.vue'
  import OrderCardMobile from './mobile/OrderCardMobile.vue'
  import AdminOrderDetailsModal from './modale/AdminOrderDetailsModal.vue'

  const { filteredData, total, nbPages, page, search, loading, hasLoaded, reset, fetchData } =
    useAdminTable<'orders_overview_for_admin'>({
      table: 'orders_overview_for_admin',
      orderBy: 'created_at',
      ascending: false,
      searchFn: (o, q) =>
        (o.customer_name?.toLowerCase()?.includes(q) ?? false) ||
        (o.customer_email?.toLowerCase()?.includes(q) ?? false),
    })

  const { deleteOrder, changeOrderStatus } = useOrderActions(fetchData)

  const localStatuses = ref<Record<string, OrderStatus>>({})

  watchEffect(() => {
    const map: Record<string, OrderStatus> = {}
    for (const o of filteredData.value) {
      if (o.order_id && o.status) map[o.order_id] = o.status as OrderStatus
    }
    localStatuses.value = map
  })

  const isModalVisible = ref(false)
  const selectedOrderId = ref<string | null>(null)

  function openOrderModal(id: string) {
    selectedOrderId.value = id
    isModalVisible.value = true
  }
</script>

<style scoped lang="less">
  .client-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .client-name {
    font-weight: 600;
    color: @neutral-900;
  }

  .client-email {
    color: @neutral-600;
    font-size: 0.85rem;
    word-break: break-word;
  }

  .mobile-cards-list {
    display: none;
  }

  @media (max-width: 1000px) {
    .orders--desktop {
      display: none;
    }

    .mobile-cards-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
