<template>
  <div class="admin-orders">
    <BasicToolbar
      v-model:search="search"
      search-placeholder="Rechercher une commande..."
      :show-reset="true"
      @reset="reset"
    >
      <template #filters>
        <div class="admin-orders__tabs">
          <button
            v-for="tab in statusTabs"
            :key="tab.id"
            class="admin-orders__tab"
            :class="{
              'admin-orders__tab--active': statusFilter === tab.id,
              'admin-orders__tab--priority': tab.id === 'pending',
            }"
            :title="tab.label"
            @click="statusFilter = tab.id"
          >
            <component :is="tab.icon" class="admin-orders__tab-icon" />
            <span class="admin-orders__tab-label">{{ tab.label }}</span>
            <span
              class="admin-orders__tab-count"
              :class="{ 'admin-orders__tab-count--alert': tab.id === 'pending' && tab.count > 0 }"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>
      </template>
      <template #pagination>
        <BasicPagination
          :current-page="page"
          :nb-pages="nbPages"
          :nb-results="displayedTotal"
          :nb-pages-max="5"
          :auto-fetch="fetchData"
          size="small"
          @change="page = $event"
        />
      </template>
    </BasicToolbar>

    <WrapperLoader
      :loading="loading"
      :has-loaded="hasLoaded"
      :is-empty="hasLoaded && displayedOrders.length === 0"
      message="Chargement des commandes..."
      empty-message="Aucune commande trouvee"
    >
      <template v-if="isDesktop || isTablet">
        <!-- Colonnes: 5 + 5 + 7 + 4 + 5 + 5 + 5 = 36 -->
        <div class="cardLayoutWrapper cardLayoutWrapper--header admin-orders__header">
          <BasicCell
            :span="5"
            text="Ref"
            :is-active="sortKey === 'order_number'"
            :icon-color="getSortColor('order_number')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('order_number')"
          />
          <BasicCell
            :span="5"
            center
            text="Date"
            :is-active="sortKey === 'created_at'"
            :icon-color="getSortColor('created_at')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('created_at')"
          />
          <BasicCell
            :span="7"
            text="Client"
            :is-active="sortKey === 'customer_name'"
            :icon-color="getSortColor('customer_name')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('customer_name')"
          />
          <BasicCell
            :span="4"
            center
            text="Total"
            :is-active="sortKey === 'total_amount'"
            :icon-color="getSortColor('total_amount')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('total_amount')"
          />
          <BasicCell :span="5" center text="Paiement" />
          <BasicCell
            :span="5"
            center
            text="Statut"
            :is-active="sortKey === 'status'"
            :icon-color="getSortColor('status')"
            :sort-asc="sortAsc"
            :on-icon-click="() => toggleSort('status')"
          />
          <BasicCell :span="5" />
        </div>

        <div
          v-for="order in displayedOrders"
          :key="order.order_id!"
          class="gridElemWrapper admin-orders__row"
          :class="{ 'admin-orders__row--pending': order.status === 'pending' }"
        >
          <!-- Colonnes: 5 + 5 + 7 + 4 + 5 + 5 + 5 = 36 -->
          <div class="cardLayoutWrapper admin-orders__item">
            <BasicCell :span="5">
              <span class="admin-orders__ref">{{ order.order_number || '---' }}</span>
            </BasicCell>

            <BasicCell :span="5" center>
              <span class="admin-orders__date">{{ formatDate(order.created_at) }}</span>
            </BasicCell>

            <BasicCell :span="7">
              <div class="admin-orders__client">
                <span class="admin-orders__client-name">{{ order.customer_name || '---' }}</span>
                <span class="admin-orders__client-email">{{ order.customer_email || '---' }}</span>
              </div>
            </BasicCell>

            <BasicCell :span="4" center>
              <span class="admin-orders__amount">{{ formatCurrency(order.total_amount ?? 0) }}</span>
            </BasicCell>

            <BasicCell :span="5" center>
              <div
                class="admin-orders__payment-method"
                :class="getPaymentMethodClass(order.payment_method)"
              >
                <component :is="getPaymentIcon(order.payment_method)" class="admin-orders__payment-icon" />
                <span class="admin-orders__payment-label">{{ getPaymentLabel(order.payment_method) }}</span>
              </div>
            </BasicCell>

            <BasicCell :span="5" center>
              <BasicBadge
                :label="getLabelBadge(order.status)"
                :type="getTypeBadge(order.status)"
                size="small"
              />
            </BasicCell>

            <BasicCell :span="5" class="admin-orders__actions">
              <button
                v-if="order.status === 'pending'"
                class="admin-orders__validate-btn"
                title="Valider le paiement"
                @click.stop="openValidationModal(order)"
              >
                <IconCheck class="admin-orders__validate-icon" />
              </button>
              <button
                class="admin-orders__details-btn"
                title="Voir details"
                @click.stop="openOrderModal(order.order_id!)"
              >
                <IconEye class="admin-orders__details-icon" />
              </button>
              <button
                class="admin-orders__delete-btn"
                title="Supprimer"
                @click.stop="deleteOrder(order)"
              >
                <IconTrash class="admin-orders__delete-icon" />
              </button>
            </BasicCell>
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
          :get-payment-label="getPaymentLabel"
          :get-payment-class="getPaymentMethodClass"
          :open-order-modal="openOrderModal"
          :open-validation-modal="openValidationModal"
          :handle-delete="deleteOrder"
          class="gridElemWrapper admin-orders__mobile-card"
        />
      </template>
    </WrapperLoader>

    <!-- Modale Details Commande -->
    <teleport to="#app">
      <AdminOrderDetailsModal
        v-if="selectedOrderId"
        v-model="isModalVisible"
        :order-id="selectedOrderId"
      />
    </teleport>

    <!-- Modale Validation Paiement -->
    <teleport to="#app">
      <ModalComponent
        v-model="isValidationModalVisible"
        :closable="true"
        size="small"
      >
        <template #header>
          <BasicText size="h4" weight="bold">Valider le paiement</BasicText>
        </template>
        <template #content>
          <div class="validation-modal" v-if="orderToValidate">
            <div class="validation-modal__icon-wrapper">
              <component
                :is="getPaymentIcon(orderToValidate.payment_method)"
                class="validation-modal__icon"
                :class="getPaymentMethodClass(orderToValidate.payment_method)"
              />
            </div>

            <p class="validation-modal__question">
              Avez-vous bien recu le paiement de
              <strong>{{ formatCurrency(orderToValidate.total_amount ?? 0) }}</strong>
              via <strong>{{ getPaymentLabel(orderToValidate.payment_method) }}</strong> ?
            </p>

            <div class="validation-modal__details">
              <div class="validation-modal__detail-row">
                <span class="validation-modal__detail-label">Commande</span>
                <span class="validation-modal__detail-value">{{ orderToValidate.order_number }}</span>
              </div>
              <div class="validation-modal__detail-row">
                <span class="validation-modal__detail-label">Client</span>
                <span class="validation-modal__detail-value">{{ orderToValidate.customer_name }}</span>
              </div>
              <div class="validation-modal__detail-row">
                <span class="validation-modal__detail-label">Email</span>
                <span class="validation-modal__detail-value">{{ orderToValidate.customer_email }}</span>
              </div>
            </div>

            <div class="validation-modal__warning">
              <IconWarning class="validation-modal__warning-icon" />
              <span>Cette action passera la commande en statut "En preparation"</span>
            </div>

            <div class="validation-modal__actions">
              <PremiumButton
                label="Annuler"
                type="secondary"
                variant="outline"
                :disabled="isValidating"
                @click="closeValidationModal"
              />
              <PremiumButton
                label="Confirmer le paiement"
                type="primary"
                :loading="isValidating"
                @click="confirmPayment"
              />
            </div>
          </div>
        </template>
      </ModalComponent>
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { useAdminTable } from '@/features/admin/shared/composables/useAdminTable'
  import { useSortableTable } from '@/features/admin/shared/composables/useSortableTable'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { useOrderActions } from '@/features/order/composables/useOrderActions'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import type { OrdersOverviewForAdmin } from '@/supabase/types/supabase.types'
  import { formatCurrency, formatDate, getLabelBadge, getTypeBadge } from '@/utils'
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import { computed, ref, watch, h, type FunctionalComponent } from 'vue'
  import BasicToolbar from '../shared/components/BasicToolbar.vue'
  import OrderCardMobile from './mobile/OrderCardMobile.vue'
  import AdminOrderDetailsModal from './modale/AdminOrderDetailsModal.vue'

  // Icones inline SVG pour les methodes de paiement
  const IconBank: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '18', height: '18' }, [
      h('path', { d: 'M4 10h16v2H4v-2zm0 4h16v2H4v-2zm0 4h4v2H4v-2zm6 0h4v2h-4v-2zm6 0h4v2h-4v-2zM2 8l10-6 10 6v2H2V8z' }),
    ])

  const IconBitcoin: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '18', height: '18' }, [
      h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 15.5h-1v1.5h-1v-1.5h-1v1.5h-1v-1.5H8v-1h1v-8H8v-1h1.5V5.5h1V7h1V5.5h1V7c1.38 0 2.5 1.12 2.5 2.5 0 .69-.28 1.31-.73 1.76.73.44 1.23 1.24 1.23 2.14 0 1.38-1.12 2.6-2.5 2.6zm-.5-8h-2v2.5h2c.69 0 1.25-.56 1.25-1.25S13.69 9.5 13 9.5zm.5 4h-2.5v2.5h2.5c.69 0 1.25-.56 1.25-1.25S14.19 13.5 13.5 13.5z' }),
    ])

  const IconCard: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '18', height: '18' }, [
      h('path', { d: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' }),
    ])

  const IconCheck: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
      h('path', { d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' }),
    ])

  const IconEye: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
      h('path', { d: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' }),
    ])

  const IconTrash: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
      h('path', { d: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' }),
    ])

  const IconWarning: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '18', height: '18' }, [
      h('path', { d: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' }),
    ])

  // Icones pour les onglets
  const IconClock: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
      h('path', { d: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z' }),
    ])

  const IconBox: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
      h('path', { d: 'M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14zm-8-2h2v-2h-2v2zm0-4h2V7h-2v6z' }),
    ])

  const IconTruck: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
      h('path', { d: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' }),
    ])

  const IconList: FunctionalComponent = () =>
    h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', width: '16', height: '16' }, [
      h('path', { d: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z' }),
    ])

  // Onglets de statut
  type StatusFilterType = 'all' | 'pending' | 'processing' | 'shipped'

  const statusTabs = computed(() => [
    { id: 'pending' as const, label: 'A Valider', count: pendingCount.value, icon: IconClock },
    { id: 'processing' as const, label: 'En preparation', count: processingCount.value, icon: IconBox },
    { id: 'shipped' as const, label: 'Expedie', count: shippedCount.value, icon: IconTruck },
    { id: 'all' as const, label: 'Tout', count: total.value, icon: IconList },
  ])

  // Hook Admin Table avec persistance URL
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
    getInitialValue,
    route,
    router,
  } = useAdminTable<'orders_overview_for_admin'>({
    table: 'orders_overview_for_admin',
    orderBy: 'created_at',
    ascending: false,
    searchFn: (o, q) =>
      (o.customer_name?.toLowerCase()?.includes(q) ?? false) ||
      (o.customer_email?.toLowerCase()?.includes(q) ?? false) ||
      (o.order_number?.toLowerCase()?.includes(q) ?? false),
    persistInUrl: true,
  })

  const { isTablet, isDesktop } = useDeviceBreakpoint()
  const { deleteOrder, changeOrderStatus } = useOrderActions(fetchData)
  const { toggleSort, getSortColor } = useSortableTable<OrdersOverviewForAdmin>(
    sortKey,
    sortAsc,
    filteredData,
  )
  const toast = useToastStore()

  // Filtre par statut avec persistance URL
  const statusFilter = ref<StatusFilterType>(getInitialValue('status', 'pending') as StatusFilterType)

  // Synchroniser le filtre avec l'URL
  watch(statusFilter, (val) => {
    if (!router || !route) return
    const query = { ...route.query } as Record<string, string>
    if (val !== 'all') {
      query.status = val
    } else {
      delete query.status
    }
    router.replace({ query })
  })

  // Compteurs par statut
  const pendingCount = computed(() => filteredData.value.filter((o) => o.status === 'pending').length)
  const processingCount = computed(() => filteredData.value.filter((o) => o.status === 'processing').length)
  const shippedCount = computed(() => filteredData.value.filter((o) => o.status === 'shipped').length)

  // Filtrage par statut
  const displayedOrders = computed(() => {
    if (statusFilter.value === 'all') return filteredData.value
    return filteredData.value.filter((o) => o.status === statusFilter.value)
  })

  const displayedTotal = computed(() => displayedOrders.value.length)

  // Modale details
  const isModalVisible = ref(false)
  const selectedOrderId = ref<string | null>(null)

  function openOrderModal(id: string) {
    selectedOrderId.value = id
    isModalVisible.value = true
  }

  // Modale validation paiement
  const isValidationModalVisible = ref(false)
  const orderToValidate = ref<OrdersOverviewForAdmin | null>(null)
  const isValidating = ref(false)

  function openValidationModal(order: OrdersOverviewForAdmin) {
    orderToValidate.value = order
    isValidationModalVisible.value = true
  }

  function closeValidationModal() {
    isValidationModalVisible.value = false
    orderToValidate.value = null
  }

  async function confirmPayment() {
    if (!orderToValidate.value) return

    isValidating.value = true
    try {
      await changeOrderStatus(
        { order_id: orderToValidate.value.order_id },
        'processing',
      )
      toast.show('Paiement valide - Commande en preparation', 'success')
      closeValidationModal()
    } catch (err: any) {
      console.error(err)
      toast.show(`Erreur validation : ${err.message}`, 'danger')
    } finally {
      isValidating.value = false
    }
  }

  // Helpers methodes de paiement
  function getPaymentIcon(method: string | null | undefined) {
    const m = method?.toLowerCase() || ''
    if (m.includes('crypto') || m.includes('bitcoin') || m.includes('btc') || m.includes('eth') || m.includes('usdt')) {
      return IconBitcoin
    }
    if (m.includes('virement') || m.includes('bank') || m.includes('transfer') || m.includes('wire')) {
      return IconBank
    }
    return IconCard
  }

  function getPaymentLabel(method: string | null | undefined): string {
    const m = method?.toLowerCase() || ''
    if (m.includes('crypto') || m.includes('bitcoin') || m.includes('btc') || m.includes('eth') || m.includes('usdt')) {
      return 'Crypto'
    }
    if (m.includes('virement') || m.includes('bank') || m.includes('transfer') || m.includes('wire')) {
      return 'Virement'
    }
    if (m.includes('card') || m.includes('cb') || m.includes('carte')) {
      return 'Carte'
    }
    return method || 'Inconnu'
  }

  function getPaymentMethodClass(method: string | null | undefined): string {
    const m = method?.toLowerCase() || ''
    if (m.includes('crypto') || m.includes('bitcoin') || m.includes('btc') || m.includes('eth') || m.includes('usdt')) {
      return 'payment--crypto'
    }
    if (m.includes('virement') || m.includes('bank') || m.includes('transfer') || m.includes('wire')) {
      return 'payment--bank'
    }
    return 'payment--card'
  }
</script>

<style scoped lang="less">
  .admin-orders {
    // Onglets de statut
    &__tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-left: 16px;
      background: rgba(0, 0, 0, 0.05);
      padding: 4px;
      border-radius: 8px;
    }

    &__tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: @neutral-600;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: @neutral-800;
      }

      &--active {
        background: @white;
        color: @neutral-900;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      &--priority {
        .admin-orders__tab-label {
          color: var(--warning-700);
          font-weight: 600;
        }
      }

      &--priority.admin-orders__tab--active {
        background: var(--warning-50);
        border: 1px solid var(--warning-200);
      }
    }

    &__tab-icon {
      display: none;
      flex-shrink: 0;
    }

    &__tab-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 10px;
      background: @neutral-200;
      color: @neutral-700;

      &--alert {
        background: var(--warning-500);
        color: @white;
        animation: pulse 2s infinite;
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    // Responsive - Tablette
    @media (max-width: 1024px) {
      &__tabs {
        margin-left: 0;
        margin-top: 8px;
        width: 100%;
        order: 10;
      }

      &__tab {
        padding: 6px 10px;
        font-size: 12px;
      }
    }

    // Responsive - Mobile
    @media (max-width: 768px) {
      &__tabs {
        justify-content: center;
      }

      &__tab {
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        min-width: 60px;
        padding: 8px 6px;
      }

      &__tab-icon {
        display: block;
      }

      &__tab-label {
        display: none;
      }

      &__tab-count {
        min-width: 22px;
        height: 18px;
        font-size: 10px;
      }
    }

    // Ligne commande
    &__row {
      transition: all 0.15s ease;

      &--pending {
        border-left: 3px solid var(--warning-500);
        background: linear-gradient(90deg, var(--warning-50) 0%, transparent 10%);
      }
    }

    &__item {
      cursor: default;
      transition: background-color 0.15s ease;

      &:hover {
        background: var(--admin-bg-card-hover, var(--primary-0));
      }
    }

    &__ref {
      font-family: monospace;
      font-size: 12px;
      font-weight: 600;
      color: @neutral-700;
      background: @neutral-100;
      padding: 4px 8px;
      border-radius: 4px;
    }

    &__date {
      font-size: 13px;
      color: @neutral-600;
    }

    &__client {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__client-name {
      font-weight: 500;
      color: @neutral-900;
      font-size: 14px;
    }

    &__client-email {
      font-size: 12px;
      color: @neutral-500;
    }

    &__amount {
      font-weight: 600;
      font-size: 14px;
      color: @neutral-900;
      font-variant-numeric: tabular-nums;
    }

    // Badge methode de paiement
    &__payment-method {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;

      &.payment--crypto {
        background: linear-gradient(135deg, #f7931a20 0%, #f7931a10 100%);
        color: #f7931a;
        border: 1px solid #f7931a40;
      }

      &.payment--bank {
        background: linear-gradient(135deg, #1a73e820 0%, #1a73e810 100%);
        color: #1a73e8;
        border: 1px solid #1a73e840;
      }

      &.payment--card {
        background: linear-gradient(135deg, #6772e520 0%, #6772e510 100%);
        color: #6772e5;
        border: 1px solid #6772e540;
      }
    }

    &__payment-icon {
      flex-shrink: 0;
    }

    // Actions
    &__actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
    }

    &__validate-btn,
    &__details-btn,
    &__delete-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    &__validate-btn {
      background: var(--success-100);
      color: var(--success-700);

      &:hover {
        background: var(--success-500);
        color: @white;
        transform: scale(1.05);
      }
    }

    &__details-btn {
      background: @neutral-100;
      color: @neutral-600;

      &:hover {
        background: var(--primary-100);
        color: var(--primary-700);
      }
    }

    &__delete-btn {
      background: transparent;
      color: @neutral-400;

      &:hover {
        background: var(--danger-100);
        color: var(--danger-600);
      }
    }

    &__mobile-card {
      margin: 4px 0;
    }
  }

  // Modale validation
  .validation-modal {
    padding: 16px;
    text-align: center;

    &__icon-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    &__icon {
      width: 64px;
      height: 64px;
      padding: 16px;
      border-radius: 50%;

      &.payment--crypto {
        background: #f7931a15;
        color: #f7931a;
      }

      &.payment--bank {
        background: #1a73e815;
        color: #1a73e8;
      }

      &.payment--card {
        background: #6772e515;
        color: #6772e5;
      }
    }

    &__question {
      font-size: 16px;
      color: @neutral-800;
      margin-bottom: 24px;
      line-height: 1.5;

      strong {
        color: @neutral-900;
      }
    }

    &__details {
      background: @neutral-50;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      text-align: left;
    }

    &__detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid @neutral-200;

      &:last-child {
        border-bottom: none;
      }
    }

    &__detail-label {
      font-size: 13px;
      color: @neutral-500;
    }

    &__detail-value {
      font-size: 13px;
      font-weight: 500;
      color: @neutral-900;
    }

    &__warning {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background: var(--info-50);
      border: 1px solid var(--info-200);
      border-radius: 8px;
      margin-bottom: 24px;
      font-size: 13px;
      color: var(--info-700);
    }

    &__warning-icon {
      flex-shrink: 0;
      color: var(--info-500);
    }

    &__actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
  }
</style>
