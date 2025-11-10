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

    <!-- 🌀 Loader + Données -->
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

        <div
          v-for="order in filteredData"
          class="gridElemWrapper"
        >
          <div class="cardLayoutWrapper">
            <!-- 🧍 Client -->
            <BasicCell :span="10">
              <div class="client-info">
                <span class="client-name">{{ order.customer_name }}</span>
                <span class="client-email">{{ order.customer_email }}</span>
              </div>
            </BasicCell>

            <!-- 💰 Total -->
            <BasicCell
              center
              :span="6"
            >
              {{ formatCurrency(order.total_amount) }}
            </BasicCell>

            <!-- 🕒 Date -->
            <BasicCell
              center
              :span="6"
            >
              {{ formatDate(order.created_at) }}
            </BasicCell>

            <BasicCellDropdown
              v-model="localStatuses[order.order_id!]"
              :items="[...STATUSES]"
              center
              :span="8"
              dropdown-type="table"
              size="small"
              @update:model-value="(v) => changeOrderStatus(order, v as OrderStatus)"
            />

            <!-- 👁️ Détails -->
            <BasicCellActionIcon
              icon-name="eye"
              tooltip="Voir la commande"
              center
              :span="3"
              @click="openOrderModal(order.order_id || '')"
            />
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
      </div>

      <!-- 📱 CARTES MOBILES -->
      <div class="mobile-cards-list">
        <OrderCardMobile
          v-for="order in filteredData"
          :status="localStatuses[order.order_id || ''] || 'pending'"
          @update:status="(newStatus) => changeOrderStatus(order, newStatus)"
          :status-label="
            STATUSES.find((s) => s.id === localStatuses[order.order_id || ''])?.label || '—'
          "
          :order="order"
          :statuses="STATUSES"
          :format-date="formatDate"
          :format-currency="formatCurrency"
          :handle-status-change="changeOrderStatus"
          :open-order-modal="openOrderModal"
          :handle-delete="deleteOrder"
        />
      </div>
    </WrapperLoader>

    <!-- 🪟 MODAL DÉTAIL -->
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
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import { useOrderActions } from '@/supabase/actions/useOrderActions'
  import type { OrderStatus } from '@/supabase/types/supabase.types'
  import { formatCurrency, formatDate } from '@/utils'
  import { ref, watchEffect } from 'vue'
  import OrderCardMobile from './mobile/OrderCardMobile.vue'
  import AdminOrderDetailsModal from './modale/AdminOrderDetailsModal.vue'
import BasicToolbar from '../shared/components/BasicToolbar.vue'

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
      if (o.order_id) {
        map[o.order_id] = (o.status as OrderStatus) ?? 'pending'
      }
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
