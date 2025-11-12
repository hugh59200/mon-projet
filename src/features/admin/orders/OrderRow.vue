<template>
  <div
    class="cardLayoutWrapper order-row"
    @click="open(order.order_id!)"
  >
    <BasicCell :span="10">
      <div class="client-info">
        <span class="client-name">{{ order.customer_name }}</span>
        <span class="client-email">{{ order.customer_email }}</span>
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

    <!-- 🗑️ Action explicite -->
    <BasicCellActionIcon
      icon-name="trash"
      tooltip="Supprimer"
      center
      danger
      :span="3"
      @click.stop="remove(order)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Tables } from '@/supabase/types/supabase'
  import type { OrderStatus } from '@/utils/mappingBadge'
  import { getLabelBadge, getTypeBadge } from '@/utils/mappingBadge'

  defineProps<{
    order: Tables<'orders_overview_for_admin'>
    statuses: { id: OrderStatus; label: string; value: OrderStatus }[]
    formatDate: (v: string) => string
    formatCurrency: (v: number) => string
    remove: (o: any) => void
    open: (id: string) => void
  }>()
</script>

<style scoped lang="less">
  .order-row {
    cursor: pointer;
    transition:
      background 0.15s ease,
      transform 0.1s ease;

    &:hover {
      background: @neutral-100;
    }

    &:active {
      transform: scale(0.995);
    }
  }
  .client-info {
    display: flex;
    flex-direction: column;
  }
  .client-name {
    font-weight: 600;
  }
  .client-email {
    font-size: 0.85rem;
    opacity: 0.7;
    word-break: break-word;
  }
</style>
