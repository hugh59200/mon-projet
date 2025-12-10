<template>
  <div
    class="mobile-card"
    @click="openProductModal(product.id)"
  >
    <div class="row top-row">
      <div class="info">
        <div class="name-wrapper">
          <BasicText
            weight="bold"
            size="body-m"
          >
            {{ product.name }}
          </BasicText>
          <span
            v-if="product.dosage"
            class="dosage-tag"
          >
            {{ product.dosage }}
          </span>
        </div>

        <div class="sub-info">
          <BasicText
            size="body-s"
            color="neutral-500"
          >
            {{ product.category || '—' }}
          </BasicText>
          <span
            v-if="product.is_on_sale"
            class="promo-tag"
          >
            PROMO
          </span>
        </div>
      </div>

      <div class="price-column">
        <template v-if="product.is_on_sale && product.sale_price">
          <BasicText
            size="body-s"
            color="neutral-400"
            style="text-decoration: line-through"
          >
            {{ formatCurrency(product.price) }}
          </BasicText>
          <BasicText
            weight="bold"
            color="danger-600"
          >
            {{ formatCurrency(product.sale_price) }}
          </BasicText>
        </template>
        <template v-else>
          <BasicText weight="bold">
            {{ formatCurrency(product.price) }}
          </BasicText>
        </template>
      </div>
    </div>

    <div class="row bottom-row">
      <div class="stock-info">
        <BasicBadge
          :label="getProductStockLabel(product.stock)"
          :type="getProductStockType(product.stock)"
          size="small"
        />
        <span class="purity-text">
          Pureté: ≥99%
        </span>
      </div>

      <div
        class="actions"
        @click.stop
      >
        <PremiumButton
          type="danger"
          variant="ghost"
          size="sm"
          icon-left="Trash2"
          class="action-btn"
          @click="handleDelete(product)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Tables } from '@/supabase/types/supabase'
  import type { BadgeType } from '@designSystem/components/basic/badge/BasicBadge.types'

  defineProps<{
    product: Tables<'products'>
    formatCurrency: (v: number | null) => string
    openProductModal: (id: string) => void
    handleDelete: (p: any) => void
  }>()

  function getProductStockLabel(stock: number | null) {
    if (!stock || stock <= 0) return 'Rupture'
    if (stock < 10) return `Faible (${stock})`
    return `Stock: ${stock}`
  }

  function getProductStockType(stock: number | null): BadgeType {
    if (!stock || stock <= 0) return 'error'
    if (stock < 10) return 'pending'
    return 'success'
  }
</script>

<style scoped lang="less">
  .mobile-card {
    background: var(--bg-subtle);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: all 0.2s ease;

    &:active {
      background: rgba(var(--primary-500-rgb), 0.08);
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .name-wrapper {
    display: flex;
    align-items: baseline;
    gap: 6px;
    flex-wrap: wrap;
  }

  .dosage-tag {
    font-size: 11px;
    color: var(--text-secondary);
    font-weight: 500;
    background: var(--bg-subtle);
    padding: 1px 5px;
    border-radius: 4px;
  }

  .sub-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .promo-tag {
    font-size: 9px;
    font-weight: 800;
    color: @white;
    background: var(--danger-600);
    padding: 1px 4px;
    border-radius: 3px;
  }

  .price-column {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }

  .bottom-row {
    align-items: center;
    border-top: 1px dashed var(--border-default);
    padding-top: 10px;
  }

  .stock-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .purity-text {
    font-size: 12px;
    color: var(--text-muted);
  }

  // Zone tactile minimum 44px
  .action-btn {
    min-width: 44px;
    min-height: 44px;
  }
</style>
