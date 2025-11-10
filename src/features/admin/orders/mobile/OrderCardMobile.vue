<template>
  <div class="mobile-card">
    <div class="row">
      <BasicText weight="bold">{{ order.customer_name }}</BasicText>
      <BasicText size="body-s">{{ formatDate(order.created_at!) }}</BasicText>
    </div>

    <div class="row">
      <BasicText>{{ formatCurrency(order.total_amount!) }}</BasicText>

      <BasicDropdown
        v-model="localStatus"
        :items="statuses"
        dropdown-type="table"
      />
    </div>

    <div class="actions">
      <BasicButton
        type="secondary"
        size="small"
        icon-name="Eye"
        @click="openOrderModal(order.order_id!)"
      />
      <BasicButton
        type="danger"
        size="small"
        icon-name="Trash"
        @click="handleDelete(order)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Tables } from '@/supabase/types/supabase'
  import type { OrderStatus } from '@/utils/status'
  import { computed } from 'vue'

  const props = defineProps<{
    order: Tables<'orders_overview_for_admin'>
    status: OrderStatus
    statuses: { id: OrderStatus; label: string; value: OrderStatus }[]
    formatDate: (v: string) => string
    formatCurrency: (v: number) => string
    handleStatusChange: (o: any, s: OrderStatus) => void
    openOrderModal: (id: string) => void
    handleDelete: (o: any) => void
  }>()

  const emit = defineEmits<{
    'update:status': [OrderStatus]
  }>()

  /* Proxy v-model */
  const localStatus = computed({
    get: () => props.status,
    set: (v: OrderStatus) => {
      emit('update:status', v)
      props.handleStatusChange(props.order, v)
    },
  })
</script>

<style scoped>
  .mobile-card {
    padding: 14px;
    border-radius: 8px;
    background: var(--neutral-100);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
</style>
