<template>
  <div
    class="mobile-card"
    :class="{ 'mobile-card--pending': order.status === 'pending' }"
    @click="openOrderModal(order.order_id!)"
  >
    <div class="row">
      <div class="client-info">
        <div class="client-name-row">
          <BasicText weight="bold">{{ order.customer_name || 'Client Inconnu' }}</BasicText>
          <BasicBadge
            v-if="order.is_guest_order"
            label="Invite"
            type="info"
            size="small"
            class="guest-badge-mobile"
          />
        </div>
        <BasicText
          size="body-s"
          color="neutral-500"
        >
          {{ order.order_number ?? order.order_id?.slice(0, 8) }}
        </BasicText>
      </div>
      <BasicText
        size="body-s"
        color="neutral-600"
      >
        {{ formatDate(order.created_at!) }}
      </BasicText>
    </div>

    <div class="row">
      <div class="amount-payment">
        <BasicText
          weight="bold"
          color="primary-700"
        >
          {{ formatCurrency(order.total_amount ?? 0) }}
        </BasicText>
        <div
          class="payment-badge"
          :class="getPaymentClass(order.payment_method)"
        >
          {{ getPaymentLabel(order.payment_method) }}
        </div>
      </div>

      <div
        class="status-actions"
        @click.stop
      >
        <BasicBadge
          :label="getLabelBadge(order.status)"
          :type="getTypeBadge(order.status)"
          size="small"
        />

        <div class="separator"></div>

        <button
          v-if="order.status === 'pending'"
          class="validate-btn-mobile"
          title="Valider le paiement"
          @click="openValidationModal(order)"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </button>

        <BasicIconNext
          name="Trash2"
          :size="18"
          color="danger-600"
          pointer
          @click="handleDelete(order)"
          class="action-icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { OrdersOverviewForAdmin } from '@/supabase/types/supabase.types'
  import { getLabelBadge, getTypeBadge } from '@/utils'

  defineProps<{
    order: OrdersOverviewForAdmin
    formatDate: (v: string) => string
    formatCurrency: (v: number) => string
    getPaymentLabel: (method: string | null | undefined) => string
    getPaymentClass: (method: string | null | undefined) => string
    openOrderModal: (id: string) => void
    openValidationModal: (order: OrdersOverviewForAdmin) => void
    handleDelete: (o: any) => void
  }>()
</script>

<style scoped lang="less">
  .mobile-card {
    padding: 16px;
    border-radius: 12px;
    background: @white;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid @neutral-200;
    transition:
      background 0.2s ease,
      transform 0.2s ease;
    cursor: pointer;

    &:hover {
      background: @neutral-50;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    &:active {
      transform: scale(0.98);
    }

    &--pending {
      border-left: 3px solid var(--warning-500);
      background: linear-gradient(90deg, var(--warning-50) 0%, @white 20%);
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .client-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .client-name-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .guest-badge-mobile {
    font-size: 9px;
    padding: 1px 5px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .amount-payment {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .payment-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 3px 6px;
    border-radius: 4px;

    &.payment--crypto {
      background: #f7931a20;
      color: #f7931a;
    }

    &.payment--bank {
      background: #1a73e820;
      color: #1a73e8;
    }

    &.payment--card {
      background: #6772e520;
      color: #6772e5;
    }
  }

  .status-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .separator {
    width: 1px;
    height: 16px;
    background: @neutral-300;
  }

  .validate-btn-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: var(--success-100);
    color: var(--success-700);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--success-500);
      color: @white;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .action-icon {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
    opacity: 0.7;

    &:hover {
      transform: scale(1.05);
      opacity: 1;
    }
  }
</style>
