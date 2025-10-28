<template>
  <!-- 🧭 BARRE D’ACTIONS -->
  <div class="orders-toolbar cardLayoutWrapper">
    <div class="elem elem--span-12">
      <BasicInput
        v-model="search"
        placeholder="Rechercher une commande..."
        icon-name="search"
        clearable
      />
    </div>

    <div class="elem elem--center elem--span-8">
      <BasicDropdown
        v-model="sortKey"
        :items="SORT_OPTIONS"
        size="small"
        label="Trier par"
        dropdown-type="table"
        force-value
      />
    </div>

    <div class="elem elem--center elem--span-8">
      <BasicDropdown
        v-model="statusFilter"
        :items="STATUSES_WITH_ALL"
        size="small"
        label="Statut"
        dropdown-type="table"
        force-value
      />
    </div>

    <div class="elem elem--center elem--span-6 justify-end">
      <BasicButton
        label="Réinitialiser"
        type="secondary"
        size="small"
        variant="outlined"
        @click="resetFilters"
      />
    </div>
  </div>

  <!-- 📄 PAGINATION -->
  <BasicPagination
    :current-page="page"
    :nb-pages="nbPages"
    :nb-pages-max="5"
    :nb-results="total"
    @change="page = $event"
  />

  <!-- 🧱 WRAPPER PRINCIPAL -->
  <WrapperLoader
    :loading="loading"
    :has-loaded="orders.length > 0"
    :is-empty="!loading && filteredOrders.length === 0"
    message="Chargement des commandes..."
    empty-message="Aucune commande trouvée 😅"
  >
    <!-- TABLEAU DESKTOP -->
    <div class="orders-table-wrapper orders--desktop">
      <div class="orders-table-header cardLayoutWrapper">
        <div class="elem elem--span-10"><span>Client</span></div>
        <div class="elem elem--center elem--span-4"><span>Total</span></div>
        <div class="elem elem--center elem--span-6"><span>Date</span></div>
        <div class="elem elem--center elem--span-10"><span>Statut</span></div>
        <div class="elem elem--center elem--span-6"><span>Détails</span></div>
      </div>

      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="gridElemWrapper"
      >
        <div class="cardLayoutWrapper orders-row">
          <BasicCell :span="10">
            <div class="client">
              <strong>{{ order.full_name }}</strong>
              <div class="sous-titre">{{ order.email }}</div>
            </div>
          </BasicCell>

          <BasicCell
            :text="formatCurrency(order.total_amount)"
            center
            :span="4"
          />

          <BasicCell
            center
            :span="6"
          >
            {{ formatDate(order.created_at) }}
          </BasicCell>

          <BasicCell
            center
            :span="10"
          >
            <BasicDropdown
              v-model="localStatuses[order.id]"
              :items="STATUSES"
              size="small"
              dropdown-type="table"
              force-value
              @update:model-value="(v) => handleStatusChange(order, v as string)"
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

    <!-- VERSION MOBILE -->
    <div class="orders--mobile">
      <div class="mobile-cards-list">
        <OrderCardMobile
          v-for="order in filteredOrders"
          :key="order.id"
          v-model:status="localStatuses[order.id]"
          :status-label="STATUSES.find((s) => s.id === localStatuses[order.id])?.label || '—'"
          :order="order"
          :statuses="STATUSES"
          :format-date="formatDate"
          :format-currency="formatCurrency"
          :handle-status-change="handleStatusChange"
          :open-order-modal="openOrderModal"
        />
      </div>
    </div>
  </WrapperLoader>

  <!-- 🪟 MODALE -->
  <teleport to="#app">
    <AdminOrderDetailsModal
      v-if="selectedOrderId"
      v-model="isModalVisible"
      :order-id="selectedOrderId"
    />
  </teleport>
</template>

<script setup lang="ts">
  import { OrderCardMobile } from '@/features/admin/sections/mobile'
  import { supabase } from '@/services/supabaseClient'
  import type { Tables } from '@/types/supabase'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, onMounted, ref, shallowRef, watch } from 'vue'
  import AdminOrderDetailsModal from './AdminOrderDetailsModal.vue'

  type OrderRow = Tables<'orders'>
  const toast = useToastStore()

  const orders = shallowRef<OrderRow[]>([])
  const localStatuses = ref<Record<string, string>>({})
  const page = ref(1)
  const perPage = 8
  const total = ref(0)
  const search = ref('')
  const sortKey = ref('created_at_desc')
  const statusFilter = ref('all')
  const loading = ref(false)

  const STATUSES = [
    { id: 'pending', label: 'En attente' },
    { id: 'confirmed', label: 'Confirmée' },
    { id: 'shipped', label: 'Expédiée' },
    { id: 'completed', label: 'Terminée' },
    { id: 'canceled', label: 'Annulée' },
  ]
  const STATUSES_WITH_ALL = [{ id: 'all', label: 'Tous' }, ...STATUSES]
  const SORT_OPTIONS = [
    { id: 'created_at_desc', label: 'Plus récentes' },
    { id: 'created_at_asc', label: 'Plus anciennes' },
    { id: 'amount_desc', label: 'Montant décroissant' },
    { id: 'amount_asc', label: 'Montant croissant' },
  ]
  const nbPages = computed(() => Math.ceil(total.value / perPage))

  const filteredOrders = computed(() => {
    let list = [...orders.value]
    if (statusFilter.value !== 'all') list = list.filter((o) => o.status === statusFilter.value)
    if (search.value.trim())
      list = list.filter((o) => o.full_name.toLowerCase().includes(search.value.toLowerCase()))
    switch (sortKey.value) {
      case 'created_at_asc':
        list.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime())
        break
      case 'amount_desc':
        list.sort((a, b) => (b.total_amount ?? 0) - (a.total_amount ?? 0))
        break
      case 'amount_asc':
        list.sort((a, b) => (a.total_amount ?? 0) - (b.total_amount ?? 0))
        break
      default:
        list.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    }
    return list
  })

  function resetFilters() {
    search.value = ''
    sortKey.value = 'created_at_desc'
    statusFilter.value = 'all'
  }

  async function loadOrders() {
    loading.value = true
    const from = (page.value - 1) * perPage
    const to = from + perPage - 1
    const { data, count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .range(from, to)
    loading.value = false
    if (error) toast.show('Erreur lors du chargement', 'danger')
    else {
      orders.value = data ?? []
      total.value = count ?? 0
      localStatuses.value = Object.fromEntries(
        orders.value.map((o) => [o.id, o.status || 'pending']),
      )
    }
  }

  async function handleStatusChange(order: OrderRow, newValue: string) {
    localStatuses.value[order.id] = newValue
    const { error } = await supabase.from('orders').update({ status: newValue }).eq('id', order.id)
    if (error) toast.show('Erreur de mise à jour', 'danger')
    else toast.show('Statut mis à jour ✅', 'success')
  }

  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  function formatCurrency(amount: number | null) {
    if (amount == null) return '-'
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
  }

  /* --- Modale --- */
  const isModalVisible = ref(false)
  const selectedOrderId = ref<string | null>(null)
  function openOrderModal(id: string) {
    selectedOrderId.value = id
    isModalVisible.value = true
  }

  watch(page, loadOrders)
  onMounted(loadOrders)
</script>

<style scoped lang="less">
  .orders-toolbar {
    border: 1px solid @neutral-200;
    border-radius: 8px;
    background-color: @neutral-50;
    margin-bottom: 16px;
    padding: 10px 14px;
    grid-template-columns: repeat(36, 1fr);
    gap: 12px;

    .elem {
      display: flex;
      align-items: center;
    }

    .justify-end {
      justify-content: flex-end;
    }

    @media (max-width: 900px) {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .elem {
        flex: 1 1 calc(50% - 10px);
        min-width: 160px;
      }

      .elem--span-12 {
        flex: 1 1 100%;
      }

      .justify-end {
        flex: 1 1 100%;
        justify-content: flex-end;
      }
    }
  }

  .orders-table-wrapper {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px fade(@neutral-900, 10%);
    background: @white;

    .orders-table-header {
      background: @primary-900;
      color: @white;
      font-weight: 600;
      border-radius: 12px 12px 0 0;
      padding: 12px 16px;
    }

    .orders-row {
      padding: 12px 16px;
      border-bottom: 1px solid @neutral-200;
      &:last-child {
        border-bottom: none;
      }

      .client {
        display: flex;
        flex-direction: column;
        strong {
          color: @primary-950;
        }
        .sous-titre {
          font-size: 13px;
          color: @neutral-500;
        }
      }
    }
  }

  .orders--desktop {
    display: block;
  }
  .orders--mobile {
    display: none;
  }
  @media (max-width: 1000px) {
    .orders--desktop {
      display: none;
    }
    .orders--mobile {
      display: block;
    }
  }

  .mobile-cards-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
</style>
