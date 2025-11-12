<template>
  <div
    class="mobile-card"
    @click="openProductModal(product.id)"
  >
    <div class="row">
      <div class="info">
        <BasicText weight="bold">{{ product.name }}</BasicText>
        <BasicText size="body-s">{{ product.category || '—' }}</BasicText>
      </div>
      <BasicText weight="bold">{{ formatCurrency(product.price) }}</BasicText>
    </div>

    <div class="row">
      <BasicText size="body-s">
        Pureté : {{ product.purity ? product.purity + '%' : '—' }}
      </BasicText>
      <BasicBadge
        :label="getLabelBadge(product.stock)"
        :type="getTypeBadge(product.stock)"
        size="small"
      />
    </div>

    <div
      class="actions"
      @click.stop
    >
      <BasicIconNext
        name="Trash2"
        :size="18"
        color="danger-600"
        pointer
        @click="handleDelete(product)"
        class="action-icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Products } from '@/supabase/types/supabase.types'
  import { getLabelBadge, getTypeBadge } from '@/utils'

  defineProps<{
    product: Products
    formatCurrency: (v: number | null) => string
    openProductModal: (id: string) => void
    handleDelete: (p: Products) => void
  }>()
</script>

<style scoped lang="less">
  .mobile-card {
    background: @neutral-100;
    border-radius: 10px;
    padding: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: pointer;
    transition:
      background 0.2s ease,
      transform 0.2s ease;

    &:hover {
      background: @neutral-200;
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

  .info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }

  .action-icon {
    opacity: 0.8;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }
</style>
