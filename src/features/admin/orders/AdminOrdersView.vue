<template>
  <div class="admin-orders">
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher une commande..."
      :show-reset="true"
      @reset="reset"
    >
      <!-- 🆕 Filtre Guest/User -->
      <template #filters>
        <div class="admin-orders__filters">
          <BasicButton
            :label="`Toutes (${total})`"
            :type="orderFilter === 'all' ? 'primary' : 'secondary'"
            size="small"
            variant="ghost"
            @click="orderFilter = 'all'"
          />
          <BasicButton
            :label="`Membres (${userOrdersCount})`"
            :type="orderFilter === 'user' ? 'primary' : 'secondary'"
            size="small"
            variant="ghost"
            @click="orderFilter = 'user'"
          />
          <BasicButton
            :label="`Invités (${guestOrdersCount})`"
            :type="orderFilter === 'guest' ? 'primary' : 'secondary'"
            size="small"
            variant="ghost"
            @click="orderFilter = 'guest'"
          />
        </div>
      </template>
    </BasicToolbar>

    <BasicPagination
      :current-page="page"
      :nb-pages="nbPages"
      :nb-results="displayedTotal"
      :nb-pages-max="5"
      :auto-fetch="fetchData"
      @change="page = $event"
    />

    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && displayedOrders.length === 0"
      message="Chargement des commandes..."
      empty-message="Aucune commande trouvée 😅"
    >
      <template v-if="isDesktop || isTablet">
        <div class="cardLayoutWrapper cardLayoutWrapper--header admin-orders__header">
          <BasicCell
            :span="8"
            text="Client"
            :is-active="sortKey === 'customer_name'"
            :icon-color="getSortColor('customer_name')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('customer_name')"
          />
          <BasicCell
            :span="6"
            center
            text="Total"
            :is-active="sortKey === 'total_amount'"
            :icon-color="getSortColor('total_amount')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('total_amount')"
          />
          <BasicCell
            :span="7"
            center
            text="Date"
            :is-active="sortKey === 'created_at'"
            :icon-color="getSortColor('created_at')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('created_at')"
          />
          <BasicCell
            :span="8"
            center
            text="Statut"
            :is-active="sortKey === 'status'"
            :icon-color="getSortColor('status')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('status')"
          />
          <BasicCell :span="3" />
        </div>
        <div
          v-for="order in displayedOrders"
          :key="order.order_id!"
          class="gridElemWrapper admin-orders__row"
        >
          <div
            class="cardLayoutWrapper admin-orders__item"
            @click="openOrderModal(order.order_id!)"
          >
            <BasicCell :span="10">
              <div class="admin-orders__client">
                <div class="admin-orders__client-header">
                  <span class="admin-orders__client-name">{{ order.customer_name || '—' }}</span>
                  <!-- 🆕 Badge Invité -->
                  <BasicBadge
                    v-if="order.is_guest_order"
                    label="Invité"
                    type="info"
                    size="small"
                    class="admin-orders__guest-badge"
                  />
                </div>
                <span class="admin-orders__client-subtext">{{ order.customer_email || '—' }}</span>
                <span class="admin-orders__client-subtext text-xs text-neutral-400">
                  {{ order.order_number }}
                </span>
              </div>
            </BasicCell>
            <BasicCell
              :span="6"
              :text="formatCurrency(order.total_amount ?? 0)"
            />
            <BasicCell
              :span="8"
              :text="formatDate(order.created_at)"
            />
            <BasicCell :span="8">
              <BasicBadge
                :label="getLabelBadge(order.status)"
                :type="getTypeBadge(order.status)"
                size="small"
              />
            </BasicCell>
            <BasicCellActionIcon
              icon-name="trash"
              tooltip="Supprimer"
              center
              danger
              :span="3"
              @click="deleteOrder(order)"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <OrderCardMobile
          v-for="order in displayedOrders"
          :key="order.order_id!"
          :order="order"
          :format-date="formatDate"
          :format-currency="formatCurrency"
          :open-order-modal="openOrderModal"
          :handle-delete="deleteOrder"
          class="gridElemWrapper admin-orders__mobile-card"
        />
      </template>
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
  import { useSortableTable } from '@/features/admin/shared/composables/useSortableTable'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { useOrderActions } from '@/features/order/composables/useOrderActions'
  import type { OrdersOverviewForAdmin } from '@/supabase/types/supabase.types'
  import { formatCurrency, formatDate, getLabelBadge, getTypeBadge } from '@/utils'
  import { computed, ref } from 'vue'
  import BasicToolbar from '../shared/components/BasicToolbar.vue'
  import OrderCardMobile from './mobile/OrderCardMobile.vue'
  import AdminOrderDetailsModal from './modale/AdminOrderDetailsModal.vue'

  // 1. Hook Admin Table
  const {
    filteredData,
    total,
    nbPages,
    page,
    search,
    sortKey,
    sortAsc,
    loading,
    hasLoaded,
    reset,
    fetchData,
  } = useAdminTable<'orders_overview_for_admin'>({
    table: 'orders_overview_for_admin',
    orderBy: 'created_at',
    ascending: false,
    searchFn: (o, q) =>
      (o.customer_name?.toLowerCase()?.includes(q) ?? false) ||
      (o.customer_email?.toLowerCase()?.includes(q) ?? false) ||
      (o.order_number?.toLowerCase()?.includes(q) ?? false),
  })

  const { isTablet, isDesktop } = useDeviceBreakpoint()
  const { deleteOrder } = useOrderActions(fetchData)
  const { toggleSort, getSortColor } = useSortableTable<OrdersOverviewForAdmin>(
    sortKey,
    sortAsc,
    filteredData,
  )

  // 🆕 Filtre Guest/User
  const orderFilter = ref<'all' | 'user' | 'guest'>('all')

  // 🆕 Computed: Filtrage par type
  const displayedOrders = computed(() => {
    if (orderFilter.value === 'all') return filteredData.value
    if (orderFilter.value === 'guest') {
      return filteredData.value.filter((o) => o.is_guest_order)
    }
    return filteredData.value.filter((o) => !o.is_guest_order)
  })

  // 🆕 Computed: Compteurs
  const guestOrdersCount = computed(() => filteredData.value.filter((o) => o.is_guest_order).length)
  const userOrdersCount = computed(() => filteredData.value.filter((o) => !o.is_guest_order).length)
  const displayedTotal = computed(() => displayedOrders.value.length)

  const isModalVisible = ref(false)
  const selectedOrderId = ref<string | null>(null)

  function openOrderModal(id: string) {
    selectedOrderId.value = id
    isModalVisible.value = true
  }
</script>

<style scoped lang="less">
  .admin-orders {
    &__filters {
      display: flex;
      gap: 8px;
      margin-left: 16px;
    }

    &__item {
      cursor: pointer;

      &:hover {
        background: var(--primary-0);
      }
    }

    &__mobile-card {
      margin: 4px 0;
    }

    &__client {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__client-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__client-name {
      font-weight: 500;
    }

    &__client-subtext {
      font-size: 13px;
      color: @neutral-500;
    }

    /* 🆕 Badge invité */
    &__guest-badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }
</style>
