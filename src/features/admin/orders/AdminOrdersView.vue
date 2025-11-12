<template>
  <div>
    <!-- 🔍 Barre de recherche -->
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher une commande..."
      :show-reset="true"
      @reset="reset"
    />

    <!-- 📄 Pagination -->
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
      <template v-if="isDesktop || isTablet">
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
            :span="8"
            text="Date"
          />
          <BasicCell
            center
            :span="8"
            text="Statut"
          />
          <BasicCell :span="3" />
        </div>
        <div
          v-for="order in filteredData"
          class="gridElemWrapper"
        >
          <div
            class="cardLayoutWrapper list"
            @click="openOrderModal(order.order_id!)"
          >
            <BasicCell :span="10">
              <div class="list__client-info">
                <span class="list__name">{{ order.customer_name }}</span>
                <span class="list__subtext">{{ order.customer_email }}</span>
              </div>
            </BasicCell>
            <BasicCell
              :span="6"
              center
            >
              <BasicText>{{ formatCurrency(order.total_amount!) }}</BasicText>
            </BasicCell>
            <BasicCell
              :span="8"
              center
            >
              <BasicText>{{ formatDate(order.created_at!) }}</BasicText>
            </BasicCell>
            <BasicCell
              :span="8"
              center
            >
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
              @click.stop="deleteOrder(order)"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <OrderCardMobile
          v-for="order in filteredData"
          v-model="localStatuses[order.order_id ?? '']"
          @update:modelValue="(v: string) => changeOrderStatus(order, v as OrderStatus)"
          :order="order"
          :statuses="STATUSES"
          :format-date="formatDate"
          :format-currency="formatCurrency"
          :open-order-modal="openOrderModal"
          :handle-delete="deleteOrder"
          class="gridElemWrapper list list--mobile"
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
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { useOrderActions } from '@/supabase/actions/useOrderActions'
  import { formatCurrency, formatDate, getLabelBadge, getTypeBadge } from '@/utils'
  import type { OrderStatus } from '@/utils/mappingBadge'
  import { STATUSES } from '@/utils/mappingBadge'
  import { ref, watchEffect } from 'vue'

  import BasicToolbar from '../shared/components/BasicToolbar.vue'
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

  const { isTablet, isDesktop } = useDeviceBreakpoint()
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
  @import '../shared/style/list-base.less';

  .list {
    &__client-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  }
</style>
