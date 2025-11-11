<template>
  <div class="cardLayoutWrapper">
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
      :span="6"
      center
    >
      <BasicText>{{ formatDate(order.created_at!) }}</BasicText>
    </BasicCell>
    <BasicCellDropdown
      v-model="localStatus"
      :items="statuses"
      dropdown-type="table"
      center
      :span="8"
      force-value
      size="small"
    />

    <BasicCellActionIcon
      icon-name="eye"
      tooltip="Voir"
      center
      :span="3"
      @click="open(order.order_id!)"
    />
    <BasicCellActionIcon
      icon-name="trash"
      tooltip="Supprimer"
      center
      danger
      :span="3"
      @click="remove(order)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Tables } from '@/supabase/types/supabase'
  import type { OrderStatus } from '@/utils/status'
  import { computed } from 'vue'

  /* Props */
  const props = defineProps<{
    order: Tables<'orders_overview_for_admin'>
    status: OrderStatus
    statuses: { id: OrderStatus; label: string; value: OrderStatus }[]
    formatDate: (v: string) => string
    formatCurrency: (v: number) => string
    handleStatus: (o: any, s: OrderStatus) => void
    remove: (o: any) => void
    open: (id: string) => void
  }>()

  /* v-model:status */
  const emit = defineEmits<{
    'update:status': [OrderStatus]
  }>()

  const localStatus = computed({
    get: () => props.status,
    set: (v: OrderStatus) => {
      emit('update:status', v)
      props.handleStatus(props.order, v)
    },
  })
</script>

<style scoped>
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
