<template>
  <BasicToolbar
    v-model:search="search"
    v-model:models="models"
    v-model:sortAsc="sortAsc"
    :search-placeholder="'Rechercher une commande...'"
    :dropdowns="[
      { key: 'sortKey', label: 'Trier par', items: SORT_OPTIONS },
      { key: 'status', label: 'Statut', items: STATUS_FILTERS },
    ]"
    :show-reset="true"
    @reset="resetFilters"
  />

  <BasicPagination
    :current-page="page"
    :nb-pages="nbPages"
    :nb-pages-max="5"
    :nb-results="total"
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
      <!-- HEADER -->
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

      <!-- ROWS -->
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
              @update:model-value="(v) => updateStatus(order, v as OrderStatus)"
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
  </WrapperLoader>

  <teleport to="#app">
    <AdminOrderDetailsModal
      v-if="selectedOrderId"
      v-model="isModalVisible"
      :order-id="selectedOrderId"
    />
  </teleport>
</template>

<script setup lang="ts">
  import { useAdminTable } from '@/features/admin/composables/useAdminTable'
  import { useSortableTable } from '@/features/admin/composables/useSortableTable'
  import { SORT_OPTIONS, STATUSES, STATUS_FILTERS } from '@/features/admin/constants/orders'
  import { updateOrderStatus } from '@/supabase/api/orders'
  import type { Tables } from '@/supabase/types/supabase'
  import type { OrderStatus } from '@/supabase/types/supabase.types'
  import { formatCurrency, formatDate } from '@/utils/index'
  import { getStatusClass } from '@/utils/status'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { ref, watchEffect } from 'vue'
  import BasicToolbar from '../BasicToolbar.vue'
  import AdminOrderDetailsModal from './AdminOrderDetailsModal.vue'

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

  const models = ref<{ sortKey: string; status: string }>({
    sortKey: 'created_at',
    status: 'all',
  })

  function resetFilters() {
    models.value.status = 'all'
    models.value.sortKey = 'created_at'
    reset()
  }

  const localStatuses = ref<Record<string, string>>({})

  watchEffect(() => {
    const statuses: Record<string, string> = {}
    for (const o of filteredData.value) statuses[o.id] = o.status ?? 'pending'
    localStatuses.value = statuses
  })

  async function updateStatus(order: OrderRow, newStatus: OrderStatus) {
    try {
      localStatuses.value[order.id] = newStatus
      await updateOrderStatus(order.id, newStatus)
      toast.show('Statut mis à jour ✅', 'success')
    } catch (err: any) {
      toast.show(`Erreur : ${(err as Error).message}`, 'danger')
    }
  }

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

  @media (max-width: 1000px) {
    .orders--desktop {
      display: none;
    }
    .orders--mobile {
      display: block;
    }
  }
</style>
