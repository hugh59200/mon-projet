<template>
  <div>
    <BasicToolbar
      v-model:search="search"
      :search-placeholder="'Rechercher une commande...'"
      :show-reset="true"
      @reset="reset()"
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
      <!-- 💻 TABLEAU DESKTOP -->
      <div class="orders--desktop">
        <div class="cardLayoutWrapper cardLayoutWrapper--header">
          <BasicCell
            :span="10"
            text="Client"
            icon-name="ArrowUpDown"
            :is-active="sortKey === 'full_name'"
            :icon-color="getSortColor('full_name')"
            :on-icon-click="() => toggleSort('full_name')"
          />
          <BasicCell
            center
            :span="4"
            text="Total"
            icon-name="ArrowUpDown"
            :is-active="sortKey === 'total_amount'"
            :icon-color="getSortColor('total_amount')"
            :on-icon-click="() => toggleSort('total_amount')"
          />
          <BasicCell
            center
            :span="6"
            text="Date"
            icon-name="ArrowUpDown"
            :is-active="sortKey === 'created_at'"
            :icon-color="getSortColor('created_at')"
            :on-icon-click="() => toggleSort('created_at')"
          />
          <BasicCell
            center
            :span="8"
            text="Statut"
            icon-name="ArrowUpDown"
            :is-active="sortKey === 'status'"
            :icon-color="getSortColor('status')"
            :on-icon-click="() => toggleSort('status')"
          />
          <BasicCell
            center
            :span="6"
            text="Détails"
          />
        </div>

        <div
          v-for="order in filteredData"
          :key="order.id"
          class="gridElemWrapper"
        >
          <div class="cardLayoutWrapper">
            <BasicCell :span="10">
              <div class="client-info">
                <span class="client-name">{{ order.full_name }}</span>
                <span class="client-email">{{ order.email }}</span>
              </div>
            </BasicCell>

            <BasicCell
              center
              :span="4"
            >
              {{ formatCurrency(order.total_amount) }}
            </BasicCell>

            <BasicCell
              center
              :span="6"
            >
              {{ formatDate(order.created_at) }}
            </BasicCell>

            <BasicCell
              center
              :span="8"
            >
              <BasicDropdown
                v-model="localStatuses[order.id]"
                :items="STATUSES"
                size="small"
                dropdown-type="table"
                force-value
                :item-class="(s: { id: string }) => getStatusClass(s.id)"
                @update:model-value="(v) => v && handleStatusChange(order, v)"
              />
            </BasicCell>

            <BasicCellActionIcon
              icon-name="eye"
              tooltip="Voir la commande"
              center
              :span="6"
              @click="openOrderModal(order.id)"
            />
          </div>
        </div>
      </div>

      <!-- 📱 CARTES MOBILES -->
      <div class="mobile-cards-list">
        <OrderCardMobile
          v-for="order in filteredData"
          :key="order.id"
          v-model:status="localStatuses[order.id]!"
          :status-label="STATUSES.find((s) => s.id === localStatuses[order.id])?.label || '—'"
          :order="order"
          :statuses="STATUSES"
          :format-date="formatDate"
          :format-currency="formatCurrency"
          :handle-status-change="handleStatusChange"
          :open-order-modal="openOrderModal"
        />
      </div>
    </WrapperLoader>

    <!-- 🪟 MODAL -->
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
  import { STATUSES } from '@/features/admin/constants/orders'
  import { useAdminTable } from '@/features/admin/shared/useAdminTable'
  import { useSortableTable } from '@/features/admin/shared/useSortableTable'
  import { updateOrderStatus } from '@/supabase/api/orders'
  import type { Tables } from '@/supabase/types/supabase'
  import type { OrderStatus } from '@/supabase/types/supabase.types'
  import { formatCurrency, formatDate } from '@/utils/index'
  import { getStatusClass } from '@/utils/status'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { ref, watchEffect } from 'vue'
  import BasicToolbar from '../BasicToolbar.vue'
  import AdminOrderDetailsModal from './AdminOrderDetailsModal.vue'
  import OrderCardMobile from './OrderCardMobile.vue'

  type OrderRow = Pick<
    Tables<'orders'>,
    'id' | 'status' | 'full_name' | 'email' | 'total_amount' | 'created_at'
  >

  const toast = useToastStore()

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
  } = useAdminTable<'orders'>({
    table: 'orders',
    orderBy: 'created_at',
    ascending: false,
    filters: { status: 'all' },
    searchFn: (o, q) =>
      (o.full_name?.toLowerCase()?.includes(q) ?? false) ||
      (o.email?.toLowerCase()?.includes(q) ?? false),
  })

  const { toggleSort, getSortColor } = useSortableTable(sortKey, sortAsc)

  const localStatuses = ref<Record<string, OrderStatus>>({})

  watchEffect(() => {
    const statuses: Record<string, OrderStatus> = {}
    const validStatuses: OrderStatus[] = [
      'pending',
      'confirmed',
      'shipped',
      'completed',
      'canceled',
    ]

    for (const o of filteredData.value) {
      const status = (o.status as OrderStatus) ?? 'pending'
      statuses[o.id] = validStatuses.includes(status) ? status : 'pending'
    }

    localStatuses.value = statuses
  })

  async function handleStatusChange(order: OrderRow, newStatus: OrderStatus) {
    try {
      localStatuses.value[order.id] = newStatus
      await updateOrderStatus(order.id, newStatus)
      toast.show('Statut mis à jour ✅', 'success')
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    }
  }

  /* Modal */
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
