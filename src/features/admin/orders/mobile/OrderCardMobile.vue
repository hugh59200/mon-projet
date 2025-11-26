<template>
  <div
    class="mobile-card"
    @click="openOrderModal(order.order_id!)"
  >
    <div class="row">
      <div class="client-info">
        <div class="client-name-row">
          <BasicText weight="bold">{{ order.customer_name || 'Client Inconnu' }}</BasicText>
          <!-- 🆕 Badge Invité -->
          <BasicBadge
            v-if="order.is_guest_order"
            label="Invité"
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
      <BasicText
        weight="bold"
        color="primary-700"
      >
        {{ formatCurrency(order.total_amount ?? 0) }}
      </BasicText>

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
    openOrderModal: (id: string) => void
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

  /* 🆕 Ligne avec nom + badge */
  .client-name-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  /* 🆕 Badge invité version mobile */
  .guest-badge-mobile {
    font-size: 9px;
    padding: 1px 5px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .status-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .separator {
    width: 1px;
    height: 16px;
    background: @neutral-300;
  }

  .action-icon {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
    opacity: 0.7;

    &:hover {
      transform: scale(1.15);
      opacity: 1;
    }
  }
</style>
