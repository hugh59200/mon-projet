<template>
  <div
    class="mobile-card"
    @click="openOrderModal(order.order_id!)"
  >
    <div class="row">
      <BasicText weight="bold">{{ order.customer_name }}</BasicText>
      <BasicText size="body-s">{{ formatDate(order.created_at!) }}</BasicText>
    </div>

    <div class="row">
      <BasicText>{{ formatCurrency(order.total_amount!) }}</BasicText>

      <div
        class="status-actions"
        @click.stop
      >
        <BasicBadge
          :label="getLabelBadge(order.status)"
          :type="getTypeBadge(order.status)"
          size="small"
        />
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
  import type { Tables } from '@/supabase/types/supabase'
  import { getLabelBadge, getTypeBadge } from '@/utils/mappingBadge'

  defineProps<{
    order: Tables<'orders_overview_for_admin'>
    formatDate: (v: string) => string
    formatCurrency: (v: number) => string
    openOrderModal: (id: string) => void
    handleDelete: (o: any) => void
  }>()
</script>

<style scoped lang="less">
  .mobile-card {
    padding: 14px;
    border-radius: 10px;
    background: @neutral-100;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition:
      background 0.2s ease,
      transform 0.2s ease;
    cursor: pointer;

    &:hover {
      background: @neutral-200;
      transform: translateY(-1px);
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

  .status-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-icon {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
    opacity: 0.8;

    &:hover {
      transform: scale(1.15);
      opacity: 1;
    }
  }
</style>
