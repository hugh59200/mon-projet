<template>
  <MobileCard hoverable>
    <!-- 🧾 TITRE -->
    <template #title>
      <div class="order-client">
        <div class="order-name">{{ order.full_name }}</div>
        <div class="order-email">{{ order.email }}</div>
      </div>
    </template>

    <!-- 🏷️ BADGE DE STATUT -->
    <template #badge>
      <span
        class="status-chip"
        :class="`status-chip--${modelValue}`"
      >
        {{ statusLabel }}
      </span>
    </template>

    <!-- 💰 INFOS -->
    <template #info>
      <div class="line">
        <span class="label">Montant :</span>
        <span class="value">{{ formatCurrency(order.total_amount) }}</span>
      </div>
      <div class="line">
        <span class="label">Date :</span>
        <span class="value">{{ formatDate(order.created_at) }}</span>
      </div>
    </template>

    <!-- ⚙️ ACTIONS -->
    <template #actions>
      <BasicDropdown
        v-model="modelValue"
        :items="statuses"
        size="small"
        dropdown-type="table"
        force-value
        @update:model-value="(v) => handleStatusChange(order, v as string)"
      />

      <BasicButton
        label="Voir les détails"
        type="secondary"
        size="small"
        variant="outlined"
        block
        @click="openOrderModal(order.id)"
      />
    </template>
  </MobileCard>
</template>

<script setup lang="ts">
  import type { Tables } from '@/supabase/types/supabase'
  import MobileCard from './MobileCard.vue'

  type OrderRow = Tables<'orders'>
  type StatusOption = { id: string; label: string }

  defineProps<{
    order: OrderRow
    statusLabel: string
    statuses: StatusOption[]
    formatDate: (d: string | null) => string
    formatCurrency: (a: number | null) => string
    handleStatusChange: (order: OrderRow, status: string) => void
    openOrderModal: (id: string) => void
  }>()

  const modelValue = defineModel<string>('status')
</script>

<style scoped lang="less">
  .order-name {
    font-weight: 600;
    color: @primary-950;
  }
  .order-email {
    font-size: @font-size-body-m;
    color: @neutral-500;
  }
  .status-chip {
    padding: 3px 8px;
    border-radius: 6px;
    font-size: @font-size-body-s;
    font-weight: 600;
    text-transform: capitalize;

    &--pending {
      background: fade(@warning-400, 15%);
      color: @warning-700;
    }
    &--confirmed {
      background: fade(@primary-400, 15%);
      color: @primary-700;
    }
    &--shipped {
      background: fade(@indigo-400, 15%);
      color: @indigo-700;
    }
    &--completed {
      background: fade(@success-400, 15%);
      color: @success-700;
    }
    &--canceled {
      background: fade(@danger-400, 15%);
      color: @danger-700;
    }
  }
  .line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;

    .label {
      color: @neutral-500;
    }

    .value {
      color: @primary-900;
    }
  }
</style>
